import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('User API', () => {
  let token: string;

  beforeEach(async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'User Tester',
        email: `user${Math.random()}@example.com`,
        password: 'password123',
        state: 'Maharashtra'
      });
    token = res.body.token;
  });

  it('should get user profile', async () => {
    const res = await request(app)
      .get('/api/user/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('User Tester');
    expect(res.body.state).toBe('Maharashtra');
  });

  it('should update user profile', async () => {
    const res = await request(app)
      .put('/api/user/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Name', state: 'Kerala' });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated Name');
    expect(res.body.state).toBe('Kerala');
  });

  it('should manage journey steps', async () => {
    // Update a step
    const updateRes = await request(app)
      .put('/api/user/journey/step-1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        status: 'completed',
        title: 'Test Step',
        description: 'Test Description'
      });
    
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.status).toBe('completed');

    // Get journey
    const getRes = await request(app)
      .get('/api/user/journey')
      .set('Authorization', `Bearer ${token}`);
    
    expect(getRes.status).toBe(200);
    expect(getRes.body.length).toBeGreaterThan(0);
    expect(getRes.body[0].stepId).toBe('step-1');
  });
});
