import dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';
import morgan from 'morgan';

import logger from './utils/logger';

import health from './routes/health.routes';

dotenv.config({ path: './config/config.env' });

const app: Application = express();
const ENV = process.env.NODE_ENV as String;

app.use(express.json());
// logger.info(`The env is ${process.env.NODE_ENV}`);

if (ENV === 'development') {
  app.use(morgan('combined'));
}

app.use('/', health);

export default app;

// TODO: Setup project for prod environment
// TODO: Setup project to run using docker
// TODO: Setup test pipeline with github action
