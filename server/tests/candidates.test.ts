import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('Candidates API', () => {
  let token: string;

  beforeEach(async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Cand Tester',
        email: `cand${Math.random()}@example.com`,
        password: 'password123',
        state: 'Maharashtra'
      });
    token = res.body.token;
  });

  it('should return candidates for a valid state', async () => {
    const res = await request(app)
      .get('/api/candidates?state=Maharashtra')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should return empty array for state with no candidates', async () => {
    const res = await request(app)
      .get('/api/candidates?state=UnknownState')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});
