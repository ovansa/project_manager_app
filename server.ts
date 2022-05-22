import dotenv from 'dotenv';

import logger from './src/utils/logger';

import { connectToDB } from './config/db';
import app from './src/app';

dotenv.config({ path: './config/config.env' });

connectToDB();

const PORT = process.env.PORT as unknown as number;
const ENV = process.env.NODE_ENV as String;

const server = app.listen(PORT, async () => {
  logger.info(`Server running in ${ENV} mode on http://localhost:${PORT}`);
});

process.on('unhandledRejection', (err: Error, promise) => {
  logger.error(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
