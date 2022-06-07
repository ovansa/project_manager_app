import 'reflect-metadata';
import dotenv from 'dotenv';

import app from './src/app';
import logger from './src/utils/logger';
import { connectToDB } from './config/db';

dotenv.config({ path: './config/config.env' });

const PORT = process.env.PORT as unknown as number;
const ENV = process.env.NODE_ENV as string;

const server = app.listen(PORT, async () => {
  logger.info(`Server running in ${ENV} mode on http://localhost:${PORT}`);
  connectToDB();
});

process.on('unhandledRejection', (err: Error) => {
  logger.error(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

export { server };
