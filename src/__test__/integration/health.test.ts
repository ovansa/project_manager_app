import request from 'supertest';
import { server } from '../../../server';
import { disconnectDB } from '../../../config/db';

afterEach(async () => {
  return await disconnectDB();
});

describe('Test Health', () => {
  it('should return valid health status', async () => {
    const res = await await request(server).get('/');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Alhamdulillah!');

    await server.close();
  });
});
