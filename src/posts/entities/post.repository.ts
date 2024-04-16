import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from '@/core';
import { Post } from './post.entity';

@Injectable()
export class PostRepository extends BaseRepository<Post> {
  constructor(@Inject('DATABASE_CONNECTION') protected readonly db) {
    super(db, 'posts');
  }
}
