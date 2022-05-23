import dotenv from 'dotenv';

dotenv.config({ path: './config/config.env' });

const env = process.env.NODE_ENV as string;
const port = process.env.PORT as unknown as number;
const db_url = process.env.MONGO_URI as string;
const test_db_url = process.env.TEST_MONGO_URI as string;

interface AppEnvironment {
  port: number;
}

interface DBEnvironment {
  db_url: string;
}

interface ProjectEnvironment {
  app: AppEnvironment;
  db: DBEnvironment;
}

interface EnvironmentData {
  [development: string]: ProjectEnvironment;
  production: ProjectEnvironment;
  test: ProjectEnvironment;
}

const development: ProjectEnvironment = {
  app: {
    port: port || 5000,
  },
  db: {
    db_url: db_url || '',
  },
};

const production: ProjectEnvironment = {
  app: {
    port: port || 5000,
  },
  db: {
    db_url: db_url || '',
  },
};

const test: ProjectEnvironment = {
  app: {
    port: port || 5000,
  },
  db: {
    db_url: test_db_url || 'mongodb://localhost:27017/test',
  },
};

const config: EnvironmentData = { development, production, test };

export default config[env];
