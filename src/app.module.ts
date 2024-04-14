import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { EnvConfig } from '@/config/envars.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [EnvConfig],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}