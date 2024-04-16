import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from '@/core';
import { Db } from 'mongodb';
import { UserContact } from './user-contact.entity';

@Injectable()
export class UserContactRepository extends BaseRepository<UserContact> {
  constructor(@Inject('DATABASE_CONNECTION') protected readonly db: Db) {
    super(db, 'user_contacts');
  }
}
