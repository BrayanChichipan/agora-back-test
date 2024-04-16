import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvConfig, IEnvars } from '@/config/envars.config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import { UserContactModule } from './user-contact/user-contact.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [EnvConfig],
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService<IEnvars>) => ({
        ttl: Number(configService.get('CACHE_TTL')),
      }),
      inject: [ConfigService],
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
    PostsModule,
    AuthModule,
    UserContactModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
