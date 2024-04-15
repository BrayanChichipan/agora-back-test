import { ConfigFactory } from '@nestjs/config';

export const EnvConfig: ConfigFactory = () => ({
  ENVIROMENT: process.env.NODE_ENV || 'dev',
  PORT: process.env.PORT || 3001,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/my-db',
});

export interface IEnvars {
  NODE_ENV: string;
  PORT: number;
  MONGO_URI: string;
}
