import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from '@/core';
import { Post } from './post.entity';
import { Db } from 'mongodb';

@Injectable()
export class PostRepository extends BaseRepository<Post> {
  constructor(@Inject('DATABASE_CONNECTION') protected readonly db: Db) {
    super(db, 'posts');
  }
}
