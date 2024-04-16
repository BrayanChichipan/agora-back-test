import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtPayload } from '../interfaces';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Request } from 'express';
import { AuthType } from '../types';
import { User } from '@/users/entities/user.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  AuthType.refresh,
) {
  constructor(
    private readonly userService: UsersService,
    config: ConfigService,
  ) {
    super({
      secretOrKey: config.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshJwtStrategy.extractJWT,
      ]),
    });
  }

  private static extractJWT(req: Request): string | null {
    if (
      req.cookies &&
      AuthType.refresh in req.cookies &&
      req.cookies[AuthType.refresh].length > 0
    ) {
      return req.cookies[AuthType.refresh];
    }
    return null;
  }

  async validate(payload: IJwtPayload): Promise<any> {
    //se ejecuta una ves passportj-wt valida que sea un token valido que no haya expirado
    const { id } = payload;

    const user = (await this.userService.findOneById(new ObjectId(id))) as User;

    if (!user) throw new UnauthorizedException('Token not valid');

    return user; //se añade lo que sea que retorne a la request: req.user
  }
}
