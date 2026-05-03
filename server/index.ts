import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

// Security & Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Auth Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// ----------------------------------------------------
// AUTHENTICATION ROUTES
// ----------------------------------------------------
app.post('/api/auth/register', async (req, res) => {
  const schema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    state: z.string()
  });

  try {
    const { name, email, password, state } = schema.parse(req.body);
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, state, city: '' }
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.json({ token, user: { id: user.id, name, state } });
  } catch (error) {
    res.status(400).json({ error: 'Invalid input' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, state: user.state } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ----------------------------------------------------
// USER ROUTES
// ----------------------------------------------------
app.get('/api/user/profile', authenticateToken, async (req: any, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
  res.json({ name: user?.name, state: user?.state, email: user?.email });
});

app.put('/api/user/profile', authenticateToken, async (req: any, res) => {
  const { name, state } = req.body;
  const user = await prisma.user.update({
    where: { id: req.user.userId },
    data: { name, state }
  });
  res.json({ name: user.name, state: user.state });
});

// ----------------------------------------------------
// JOURNEY ROUTES
// ----------------------------------------------------
app.get('/api/user/journey', authenticateToken, async (req: any, res) => {
  const steps = await prisma.journeyStep.findMany({ where: { userId: req.user.userId } });
  res.json(steps);
});

app.put('/api/user/journey/:stepId', authenticateToken, async (req: any, res) => {
  const { status, title, description } = req.body;
  const { stepId } = req.params;
  
  const step = await prisma.journeyStep.upsert({
    where: { userId_stepId: { userId: req.user.userId, stepId } },
    update: { status },
    create: { userId: req.user.userId, stepId, title, description, status }
  });
  res.json(step);
});

// ----------------------------------------------------
// CHAT & MISINFO (AI MOCK)
// ----------------------------------------------------
app.post('/api/chat/message', authenticateToken, async (req: any, res) => {
  const { message } = req.body;
  const text = message.toLowerCase();
  
  let intent = 'GENERAL';
  let confidence = 0.5;
  let reasoning = 'Generic response based on keywords.';

  if (text.includes('register')) { intent = 'REGISTRATION_INTENT'; confidence = 0.95; }
  else if (text.includes('how') && text.includes('vote')) { intent = 'PROCEDURAL_GUIDE'; confidence = 0.9; }
  else if (text.includes('simulate')) { intent = 'SIMULATION_REQUEST'; confidence = 0.98; }
  else if (text.includes('location')) { intent = 'LOCATION_SERVICE'; confidence = 0.88; }
  else if (text.includes('candidate')) { intent = 'INFORMATION_QUERY'; confidence = 0.8; }
  else {
    const mythMatches = await prisma.misinformationFact.findMany();
    for (const myth of mythMatches) {
      if (myth.keywords.split(',').some(k => text.includes(k))) {
        intent = 'MISINFORMATION_CHECK';
        confidence = myth.confidence;
        reasoning = myth.explanation;
        break;
      }
    }
  }

  res.json({ intent, confidence, reasoning });
});

app.post('/api/misinfo/check', authenticateToken, async (req: any, res) => {
  const { claim } = req.body;
  const text = claim.toLowerCase();
  
  const mythMatches = await prisma.misinformationFact.findMany();
  for (const myth of mythMatches) {
    if (myth.keywords.split(',').some(k => text.includes(k))) {
      return res.json({
        status: myth.verdict,
        color: myth.verdict === 'FALSE' ? '#ef4444' : '#10b981',
        explanation: myth.explanation
      });
    }
  }

  res.json({
    status: 'MISLEADING',
    color: '#f59e0b',
    explanation: 'This claim lacks context. Official guidelines from ECI should be consulted for clarity.'
  });
});

// ----------------------------------------------------
// CANDIDATES ROUTES
// ----------------------------------------------------
app.get('/api/candidates', authenticateToken, async (req: any, res) => {
  const { state } = req.query;
  const candidates = await prisma.candidate.findMany({
    where: state ? { state: String(state) } : {}
  });
  res.json(candidates);
});

// ----------------------------------------------------
// GOOGLE SERVICES MOCK ROUTES
// ----------------------------------------------------
app.get('/api/google/booth', authenticateToken, (req, res) => {
  // MOCKED for now. User must replace with real Google Maps API integration.
  const { state } = req.query;
  res.json({
    lat: 19.0760,
    lng: 72.8777,
    address: `Mocked Polling Booth Location for ${state}`
  });
});

app.post('/api/google/calendar/reminder', authenticateToken, (req, res) => {
  const { state } = req.body;
  // Simulate logic for creating a calendar event
  const reminderTime = new Date();
  reminderTime.setMinutes(reminderTime.getMinutes() + 1); // Mock reminder for 1 min from now
  
  res.json({ 
    success: true, 
    message: `Election reminder set for ${state}`,
    scheduledAt: reminderTime.toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
