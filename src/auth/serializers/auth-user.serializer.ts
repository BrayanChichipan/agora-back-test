import { Expose, Type } from 'class-transformer';

export class UserSerializer {
  @Expose()
  email: string;

  @Expose()
  id: string;

  @Expose()
  name: string;
}

export class AuthUserSerializer {
  @Expose()
  access_token: string;

  @Expose()
  @Type(() => UserSerializer)
  user: UserSerializer;
}
