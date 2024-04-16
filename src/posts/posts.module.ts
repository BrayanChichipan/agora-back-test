import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostRepository } from './entities/post.repository';

@Module({
  controllers: [PostsController],
  providers: [PostsService, PostRepository],
})
export class PostsModule {}
