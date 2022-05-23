import dotenv from 'dotenv';
import express, { Application } from 'express';
import morgan from 'morgan';

import health from './routes/health.routes';

dotenv.config({ path: './config/config.env' });

const app: Application = express();
const ENV = process.env.NODE_ENV as string;

app.use(express.json());

if (ENV === 'development') {
  app.use(morgan('combined'));
}

app.use('/', health);

export default app;

// TODO: Setup test to use local database ✅
// TODO: Setup project for prod environment
// TODO: Setup project to run using docker
// TODO: Setup test pipeline with github action
