import mongoose from 'mongoose';
import logger from '../src/utils/logger';

export const connectToDB = async () => {
  const dbUri = process.env.MONGO_URI as string;

  try {
    const conn = await mongoose.connect(dbUri);
    logger.info(`DB Connected: ${conn.connection.host}`);
  } catch (err) {
    logger.error(`Could not connect to DB: ${err}`);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
};
