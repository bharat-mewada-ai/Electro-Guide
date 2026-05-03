import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const prisma = new PrismaClient();
const router = Router();

const profileUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  state: z.string().min(2).optional()
});

router.get('/profile', authenticateToken, async (req: AuthRequest, res: Response, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user?.userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ name: user.name, state: user.state, email: user.email });
  } catch (error) {
    next(error);
  }
});

router.put('/profile', authenticateToken, async (req: AuthRequest, res: Response, next) => {
  try {
    const data = profileUpdateSchema.parse(req.body);
    const user = await prisma.user.update({
      where: { id: req.user?.userId },
      data
    });
    res.json({ name: user.name, state: user.state });
  } catch (error) {
    next(error);
  }
});

router.get('/journey', authenticateToken, async (req: AuthRequest, res: Response, next) => {
  try {
    const steps = await prisma.journeyStep.findMany({ where: { userId: req.user?.userId } });
    res.json(steps);
  } catch (error) {
    next(error);
  }
});

router.put('/journey/:stepId', authenticateToken, async (req: AuthRequest, res: Response, next) => {
  try {
    const { status, title, description } = req.body;
    const { stepId } = req.params;
    
    const step = await prisma.journeyStep.upsert({
      where: { userId_stepId: { userId: req.user!.userId, stepId } },
      update: { status },
      create: { userId: req.user!.userId, stepId, title, description, status }
    });
    res.json(step);
  } catch (error) {
    next(error);
  }
});

export default router;
