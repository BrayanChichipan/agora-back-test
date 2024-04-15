import { IEnvars } from '@/config/envars.config';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongoClient } from 'mongodb';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      inject: [ConfigService],
      useFactory: async (config: ConfigService<IEnvars>) => {
        const client = new MongoClient(config.get('MONGO_URI'));
        await client.connect();
        console.log('Connected to MongoDB');
        return client.db();
      },
    },
  ],
  exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule {}
