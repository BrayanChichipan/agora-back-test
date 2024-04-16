import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IEnvars } from 'src/config/envars.config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshJwtStrategy } from './strategies/jwt-refresh.strategy';
import { UserRepository } from '@/users/entities/user.repository';

@Module({
  providers: [
    AuthService,
    UserRepository,
    UsersService,
    JwtStrategy,
    RefreshJwtStrategy,
  ],
  controllers: [AuthController],
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<IEnvars>) => {
        return {
          secret: config.getOrThrow('JWT_SECRET'),
          signOptions: { expiresIn: '600s' }, // can be modified at sign tokens
        };
      },
    }),
  ],
  exports: [JwtModule, JwtStrategy],
})
export class AuthModule {}
