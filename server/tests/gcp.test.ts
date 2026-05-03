import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('GCP Service Integration', () => {
  let token: string;

  beforeEach(async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'GCP Tester',
        email: `gcp${Math.random()}@example.com`,
        password: 'password123',
        state: 'Maharashtra'
      });
    token = res.body.token;
  });

  it('should verify voter ID via simulated Google Cloud Vision', async () => {
    const res = await request(app)
      .post('/api/google/vision/verify')
      .set('Authorization', `Bearer ${token}`)
      .send({ image: 'base64_data_here' });

    expect(res.status).toBe(200);
    expect(res.body.isVerified).toBe(true);
    expect(res.body.model).toBe('voter-id-v2-ocr');
  });

  it('should fetch polling booths via simulated Google Places API', async () => {
    const res = await request(app)
      .get('/api/google/places/booths?state=Maharashtra')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('rating');
  });
});
