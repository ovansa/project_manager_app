import dotenv from 'dotenv';
import express, { Application } from 'express';
import morgan from 'morgan';

import health from './routes/health.routes';
import organization from './routes/organization.routes';
import user from './routes/user.routes';

dotenv.config({ path: './config/config.env' });

const app: Application = express();
const ENV = process.env.NODE_ENV as string;

app.use(express.json());
// logger.info(`The env is ${process.env.NODE_ENV}`);

if (ENV === 'development') {
  app.use(morgan('combined'));
}

app.use('/', health);
app.use('/api/user', user);
app.use('/api/organization', organization);

export default app;

// TODO: Create model for Users
// TODO: Create model for Organization

// TODO: Setup test to use local database ✅
// TODO: Setup project for prod environment
// TODO: Setup project to run using docker
// TODO: Setup test pipeline with github action ✅
