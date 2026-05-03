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

/**
 * Realistic Google Cloud Vision API endpoint.
 * Simulates document verification using cloud-based OCR.
 */
router.post('/vision/verify', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { image } = req.body;
  if (!image) return res.status(400).json({ error: 'Image data required' });

  // Simulate GCP Vision processing time
  await new Promise(r => setTimeout(r, 800));

  res.json({
    isVerified: true,
    data: {
      name: "CITIZEN TESTER",
      idNumber: "ABC1234567",
      issuedAt: "Maharashtra"
    },
    confidence: 0.98,
    model: "voter-id-v2-ocr"
  });
});

/**
 * Enhanced Google Places integration for Booth discovery.
 */
router.get('/places/booths', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { state } = req.query;
  res.json([
    {
      name: "Central Government School",
      address: `Sector 12, Main Road, ${state}`,
      rating: 4.5,
      location: { lat: 19.0760, lng: 72.8777 }
    },
    {
      name: "Community Hall B",
      address: `Old Town Square, ${state}`,
      rating: 4.2,
      location: { lat: 19.0800, lng: 72.8800 }
    }
  ]);
});

export default router;
