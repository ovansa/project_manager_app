import mongoose from 'mongoose';
import logger from '../src/utils/logger';
import config from './config';

const {
  db: { db_url },
} = config;

const env = process.env.NODE_ENV as string;
// logger.info(`The DB URL for ${env} is ${db_url}`);

export const connectToDB = async () => {
  try {
    const conn = await mongoose.connect(db_url);
    logger.info(`DB Connected: ${conn.connection.host}`);
  } catch (err) {
    logger.error(`Could not connect to DB: ${err}`);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
};
