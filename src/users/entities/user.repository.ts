import { Inject, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { BaseRepository } from '@/core';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(@Inject('DATABASE_CONNECTION') protected readonly db) {
    super(db, 'users');
  }
}
