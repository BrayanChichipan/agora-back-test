import { IsNotEmpty, IsEmail, MinLength, IsString } from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}
