import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

router.post('/message', authenticateToken, async (req: AuthRequest, res: Response, next) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });
    
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
        if (myth.keywords.split(',').some((k: string) => text.includes(k.trim()))) {
          intent = 'MISINFORMATION_CHECK';
          confidence = myth.confidence;
          reasoning = myth.explanation;
          break;
        }
      }
    }

    res.json({ intent, confidence, reasoning });
  } catch (error) {
    next(error);
  }
});

router.post('/misinfo/check', authenticateToken, async (req: AuthRequest, res: Response, next) => {
  try {
    const { claim } = req.body;
    if (!claim) return res.status(400).json({ error: 'Claim is required' });
    
    const text = claim.toLowerCase();
    
    const mythMatches = await prisma.misinformationFact.findMany();
    for (const myth of mythMatches) {
      if (myth.keywords.split(',').some((k: string) => text.includes(k.trim()))) {
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
  } catch (error) {
    next(error);
  }
});

export default router;
