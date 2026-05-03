import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('Chat API', () => {
  let token: string;

  beforeEach(async () => {
    // Register a fresh user for each test to get a token
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Chat Tester',
        email: `chat${Math.random()}@example.com`,
        password: 'password123',
        state: 'Maharashtra'
      });
    token = res.body.token;
  });

  it('should process a message and detect intent', async () => {
    const res = await request(app)
      .post('/api/chat/message')
      .set('Authorization', `Bearer ${token}`)
      .send({ message: 'How do I register to vote?' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('intent');
    expect(res.body).toHaveProperty('confidence');
    expect(res.body).toHaveProperty('reasoning');
  });

  it('should return 401 without token', async () => {
    const res = await request(app)
      .post('/api/chat/message')
      .send({ message: 'Hello' });

    expect(res.status).toBe(401);
  });
});
