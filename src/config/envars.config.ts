import { ConfigFactory } from '@nestjs/config';

export const EnvConfig: ConfigFactory = () => ({
  ENVIROMENT: process.env.NODE_ENV || 'dev',
  PORT: process.env.PORT || 3001,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/my-db',
  WEB_CLIENT_DOMAIN: process.env.WEB_CLIENT_DOMAIN || 'localhost',
  JWT_SECRET: process.env.JWT_SECRET,
  CACHE_TTL: process.env.CACHE_TTL || 6000,
});

export interface IEnvars {
  NODE_ENV: string;
  PORT: number;
  MONGO_URI: string;
  WEB_CLIENT_DOMAIN: string;
  JWT_SECRET: string;
  CACHE_TTL: number;
}
