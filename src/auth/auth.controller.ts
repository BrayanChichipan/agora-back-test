import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { LoginDto, SignupDto } from './dtos';
import { AuthService } from './auth.service';
import { CookieOptions, Response } from 'express';
import { Auth, GetUser } from './decorators';
import { AuthType } from './types';
import { AuthUserSerializer, UserSerializer } from './serializers';
import { ConfigService } from '@nestjs/config';
import { IEnvars } from 'src/config/envars.config';
import { Serialize } from '@/core/interceptors';
import { User } from '@/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  private readonly refreshCookieConfig: CookieOptions = {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, //show suthService: refresh token valid 7 days
    sameSite: 'lax',
    domain: this.config.get('WEB_CLIENT_DOMAIN'),
    secure: true,
  };

  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService<IEnvars>,
  ) {}

  @Serialize(AuthUserSerializer)
  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto: LoginDto,
  ) {
    //passthrough = true to use return as nestjs and not the res.status().json({})
    const { user, access_token, refresh_token } =
      await this.authService.login(loginDto);

    //todo: check best configuration to production

    res.cookie(`${AuthType.refresh}`, refresh_token, this.refreshCookieConfig);
    return { user, access_token };
  }

  @Serialize(AuthUserSerializer)
  @Post('signup')
  async signup(
    @Res({ passthrough: true }) res: Response,
    @Body() signupDto: SignupDto,
  ) {
    const { access_token, refresh_token, user } =
      await this.authService.signup(signupDto);

    res.cookie(`${AuthType.refresh}`, refresh_token, this.refreshCookieConfig);
    return { access_token, user };
  }

  @Auth({ type: AuthType.refresh })
  @Get('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.cookie(AuthType.refresh, '', { expires: new Date() });
    return { ok: true };
  }

  @Auth({ type: AuthType.refresh })
  @Get('refresh')
  refresh(@GetUser() user: User) {
    const { access_token } = this.authService.generateTokens({
      id: user._id,
    });

    return {
      access_token,
    };
  }

  @Serialize(UserSerializer)
  @Auth({})
  @Get('me')
  me(@GetUser() user: User) {
    return user;
  }
}
