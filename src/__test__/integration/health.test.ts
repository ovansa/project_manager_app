import request from 'supertest';
import { server } from '../../../server';
import { disconnectDB } from '../../../config/db';

afterAll(async () => {
  await disconnectDB();
  await server.close();
});

describe('Test Health', () => {
  it('should return valid health status', async () => {
    const res = await await request(server).get('/');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Alhamdulillah!');
  });
});
