import mongoose from 'mongoose';
import logger from '../src/utils/logger';

export const connectToDB = async () => {
  const dbUri = process.env.MONGO_URI as string;
  console.log(`MONGO URI is ${dbUri}`);

  try {
    const conn = await mongoose.connect(dbUri);
    logger.info(`DB Connected: ${conn.connection.host}`);
  } catch (err) {
    logger.error(`Could not connect to DB: ${err}`);
    process.exit(1);
  }
};
