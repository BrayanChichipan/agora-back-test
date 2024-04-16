import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { LoginDto, SignupDto } from './dtos';
import * as bcrypt from 'bcrypt';
import { IJwtPayload } from './interfaces';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { User } from '@/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = (await this.userService.findOneByEmail(
      loginDto.email,
    )) as User;
    if (!user) {
      throw new UnauthorizedException('Creadentias are not valids');
    }

    if (!bcrypt.compareSync(loginDto.password, user.password)) {
      throw new UnauthorizedException('Creadentias are not valids');
    }

    const { access_token, refresh_token } = this.generateTokens({
      id: user._id,
    });
    return { user, access_token, refresh_token };
  }

  //aqui llegan los que se registran por la pagina: deben validar su correo
  async signup(signupDto: SignupDto) {
    let user: User;
    try {
      user = await this.userService.findOneByEmail(signupDto.email);
    } catch (e) {
      user = undefined;
    }

    user = await this.userService.create({
      ...signupDto,
    });

    const { access_token, refresh_token } = this.generateTokens({
      id: user._id,
    });
    return { access_token, refresh_token, user };
  }

  generateTokens(payload: IJwtPayload) {
    const access_token = this.generateJWT(payload);
    const refresh_token = this.generateJWT(payload, { expiresIn: '7d' });
    return { access_token, refresh_token };
  }

  private generateJWT(
    payload: IJwtPayload,
    options: JwtSignOptions = undefined,
  ) {
    return this.jwtService.sign(payload, options);
  }
}
