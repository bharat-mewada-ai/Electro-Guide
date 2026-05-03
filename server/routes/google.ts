import { Router, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/booth', authenticateToken, (req: AuthRequest, res: Response) => {
  const { state } = req.query;
  // Enhanced mock logic
  res.json({
    lat: 19.0760,
    lng: 72.8777,
    address: `Mocked Polling Booth Location for ${state}`,
    nearbyBooths: [
      { name: "Public School A", distance: "0.5km" },
      { name: "Community Center B", distance: "1.2km" }
    ]
  });
});

router.post('/calendar/reminder', authenticateToken, (req: AuthRequest, res: Response) => {
  const { state, electionDate } = req.body;
  
  const reminderTime = new Date(electionDate || new Date());
  reminderTime.setHours(8, 0, 0); // Default to 8 AM on election day
  
  res.json({ 
    success: true, 
    message: `Election reminder set for ${state}`,
    scheduledAt: reminderTime.toISOString(),
    eventLink: "https://calendar.google.com/calendar/event?eid=mocked_id"
  });
});

export default router;
