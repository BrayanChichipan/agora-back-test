import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UnauthorizedException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ParseMongoIdPipe } from '@/core/pipes/parse-mongo-id.pipe';
import { Auth, GetUser } from '@/auth/decorators';
import { User } from '@/users/entities/user.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Auth({})
  @Post()
  create(@Body() createPostDto: CreatePostDto, @GetUser() user: User) {
    return this.postsService.create(createPostDto, user);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.postsService.findOneById(id);
  }

  @Auth({})
  @Patch(':id')
  async update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
    @GetUser() user: User,
  ) {
    const post = await this.postsService.findOneById(id);
    if (post.userId !== user._id) {
      throw new UnauthorizedException('You are not the author of this post');
    }

    return this.postsService.update(id, updatePostDto);
  }

  @Auth({})
  @Delete(':id')
  async remove(
    @Param('id', ParseMongoIdPipe) id: string,
    @GetUser() user: User,
  ) {
    const post = await this.postsService.findOneById(id);
    if (post.userId !== user._id) {
      throw new UnauthorizedException('You are not the author of this post');
    }
    return this.postsService.remove(id);
  }
}
