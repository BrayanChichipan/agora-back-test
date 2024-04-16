import { Expose } from 'class-transformer';

export class UserSerializer {
  @Expose()
  email: string;

  @Expose()
  _id: string;

  @Expose()
  name: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
