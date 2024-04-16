import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtPayload } from '../interfaces';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthType } from '../types';
import { User } from '@/users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, AuthType.access) {
  constructor(
    private readonly userService: UsersService,
    config: ConfigService,
  ) {
    super({
      secretOrKey: config.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: IJwtPayload): Promise<any> {
    //se ejecuta una ves passportj-wt valida que sea un token valido que no haya expirado
    const { id } = payload;

    const user = (await this.userService.findOneById(id)) as User;

    if (!user) throw new UnauthorizedException('Token not valid');

    return user; //se añade lo que sea que retorne a la request: req.user
  }
}
