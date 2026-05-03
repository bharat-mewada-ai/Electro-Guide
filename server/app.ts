import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Security Middleware
// Advanced Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https://*.tile.openstreetmap.org", "https://maps.gstatic.com"],
      connectSrc: ["'self'", "https://*.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,
}));
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || true,
  credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', limiter);

app.use(express.json());

// Health Check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Routes
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import chatRoutes from './routes/chat';
import candidateRoutes from './routes/candidates';
import googleRoutes from './routes/google';

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/google', googleRoutes);

// Error Handling
app.use(errorHandler);

export default app;
