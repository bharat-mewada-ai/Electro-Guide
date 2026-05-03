import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('Google API (Simulated)', () => {
  let token: string;

  beforeEach(async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Google Tester',
        email: `google${Math.random()}@example.com`,
        password: 'password123',
        state: 'Maharashtra'
      });
    token = res.body.token;
  });

  it('should return simulated booth location', async () => {
    const res = await request(app)
      .get('/api/google/booth?state=Maharashtra')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('lat');
    expect(res.body).toHaveProperty('address');
  });

  it('should return simulated reminder confirmation', async () => {
    const res = await request(app)
      .post('/api/google/calendar/reminder')
      .set('Authorization', `Bearer ${token}`)
      .send({ state: 'Maharashtra' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
