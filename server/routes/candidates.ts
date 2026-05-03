import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

router.get('/', authenticateToken, async (req: AuthRequest, res: Response, next) => {
  try {
    const { state } = req.query;
    const candidates = await prisma.candidate.findMany({
      where: state ? { state: String(state) } : {}
    });
    res.json(candidates);
  } catch (error) {
    next(error);
  }
});

export default router;
