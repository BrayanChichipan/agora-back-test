import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRepository } from './entities/post.repository';
import { Post } from './entities/post.entity';
import { User } from '@/users/entities/user.entity';
import { ObjectId } from 'mongodb';
import { PostQueryDto } from './dto/query.dto';

@Injectable()
export class PostsService {
  logger = new Logger(PostsService.name);

  constructor(private readonly postRepo: PostRepository) {}

  async create(createPostDto: CreatePostDto, user: User) {
    try {
      const post = await this.postRepo.create({
        ...createPostDto,
        userId: user._id,
      });

      this.logger.log(`Post created: ${JSON.stringify(post)}`);
      return post;
    } catch (error) {
      this.handeDBExceptions(error);
    }
  }

  findAll(query: PostQueryDto) {
    const filter = {};

    if (query.search) {
      filter['$or'] = [
        { title: { $regex: query.search, $options: 'i' } },
        { subtitle: { $regex: query.search, $options: 'i' } },
      ];
    }
    if (query.type) {
      filter['type'] = query.type;
    }
    return this.postRepo.findAndCount(
      {
        ...filter,
        isPublished: true,
      },
      {
        limit: query.limit,
        skip: (query.page - 1) * query.limit,
        sort: query.sort,
      },
    );
  }

  async findOneById(id: ObjectId) {
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

    return post;
  }

  async update(id: ObjectId, updatePost: UpdatePostDto) {
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
      const postUpdated = await this.postRepo.update(id, post);
      this.logger.log(`Post updated: ${JSON.stringify(postUpdated)}`);
      return postUpdated;
    } catch (error) {
      this.handeDBExceptions(error);
    }
  }

  //softdelete
  async remove(id: ObjectId) {
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
      await this.postRepo.delete(post._id);
      this.logger.log(`Post deleted: ${JSON.stringify(post)}`);
      return {
        status: 'ok',
        message: 'Post deleted successfully',
      };
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
    this.logger.error(error);

    throw new InternalServerErrorException(
      'Unspected error, check server logs',
    );
  }
}
