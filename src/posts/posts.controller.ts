import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UnauthorizedException,
  UseInterceptors,
  Inject,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ParseMongoIdPipe } from '@/core/pipes/parse-mongo-id.pipe';
import { Auth, GetUser } from '@/auth/decorators';
import { User } from '@/users/entities/user.entity';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ObjectId } from 'mongodb';

@Controller('posts')
@UseInterceptors(CacheInterceptor)
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Auth({})
  @Post()
  async create(@Body() createPostDto: CreatePostDto, @GetUser() user: User) {
    const post = await this.postsService.create(createPostDto, user);
    this.cacheManager.del('posts');
    return post;
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: ObjectId) {
    return this.postsService.findOneById(id);
  }

  @Auth({})
  @Patch(':id')
  async update(
    @Param('id', ParseMongoIdPipe) id: ObjectId,
    @Body() updatePostDto: UpdatePostDto,
    @GetUser() user: User,
  ) {
    const post = await this.postsService.findOneById(id);
    if (post.userId.toHexString() !== user._id.toHexString()) {
      throw new UnauthorizedException('You are not the author of this post');
    }

    const updatedPost = await this.postsService.update(id, updatePostDto);
    this.cacheManager.del('posts');
    this.cacheManager.del(`posts/${id.toHexString()}`);
    return updatedPost;
  }

  @Auth({})
  @Delete(':id')
  async remove(
    @Param('id', ParseMongoIdPipe) id: ObjectId,
    @GetUser() user: User,
  ) {
    const post = await this.postsService.findOneById(id);
    if (post.userId.toHexString() !== user._id.toHexString()) {
      throw new UnauthorizedException('You are not the author of this post');
    }
    const resp = await this.postsService.remove(id);
    this.cacheManager.del('posts');
    this.cacheManager.del(`posts/${id.toHexString()}`);
    return resp;
  }
}
