import { Inject, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { BaseRepository } from '@/core';
import { Db } from 'mongodb';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(@Inject('DATABASE_CONNECTION') protected readonly db: Db) {
    super(db, 'users');
  }
}
