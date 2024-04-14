import { ConfigFactory } from '@nestjs/config';

export const EnvConfig: ConfigFactory = () => ({
  ENVIROMENT: process.env.NODE_ENV || 'dev',
  PORT: process.env.PORT || 3001,
});

export interface IEnvars {
  NODE_ENV: string;
  PORT: number;
}
