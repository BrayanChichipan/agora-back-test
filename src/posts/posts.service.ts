import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRepository } from './entities/post.repository';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(private readonly postRepo: PostRepository) {}

  async create(createPostDto: CreatePostDto) {
    try {
      const post = await this.postRepo.create(createPostDto);
      return post;
    } catch (error) {
      this.handeDBExceptions(error);
    }
  }

  findAll() {
    return this.postRepo.findAll();
  }

  async findOneById(id: string) {
    let post: Post;

    try {
      post = await this.postRepo.findOneById(id);
    } catch (error) {
      this.handeDBExceptions(error);
    }

    if (!post) {
      throw new NotFoundException(`Post with  id not found`);
    }

    return post;
  }

  async update(id: string, updatePost: UpdatePostDto) {
    let post: Post;
    try {
      post = await this.postRepo.findOneById(id);
    } catch (error) {
      this.handeDBExceptions(error);
    }

    if (!post) {
      throw new NotFoundException(
        `Post with id:  ${JSON.stringify(id)} not found`,
      );
    }
    Object.assign(post, updatePost);

    try {
      return await this.postRepo.update(id, post);
    } catch (error) {
      this.handeDBExceptions(error);
    }
  }

  //softdelete
  async remove(id: string) {
    let post: Post;
    try {
      post = await this.postRepo.findOneById(id);
    } catch (error) {
      this.handeDBExceptions(error);
    }

    if (!post) {
      return new NotFoundException(
        `Post with id:  ${JSON.stringify(id)} not found`,
      );
    }

    try {
      return await this.postRepo.delete(post._id);
    } catch (error) {
      this.handeDBExceptions(error);
    }
  }

  private handeDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    if (error.code === '23503') {
      throw new BadRequestException(error.detail);
    }
    console.log(error);

    throw new InternalServerErrorException(
      'Unspected error, check server logs',
    );
  }
}
