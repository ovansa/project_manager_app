import { Server } from 'http';
import mongoose from 'mongoose';
import request from 'supertest';
import { IUser } from '../models/user.model';

export const clearDatabase = async () => {
  await mongoose.connection.db.dropDatabase();
};

export const loginUser = async (
  user: IUser,
  server: Server
): Promise<string> => {
  const body = {
    email: user.email,
    password: user.password,
  };

  const response = await request(server).post('/api/user/login').send(body);
  return response.body.token;
};
