import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserContactDto } from './dto/create-user-contact.dto';
import { UpdateUserContactDto } from './dto/update-user-contact.dto';
import { UserContactRepository } from './entities/user-contact.repository';
import { UserContact } from './entities/user-contact.entity';
import { ObjectId } from 'mongodb';
import { PostQueryDto } from '@/posts/dto/query.dto';

@Injectable()
export class UserContactService {
  logger = new Logger(UserContactService.name);

  constructor(private readonly userRepo: UserContactRepository) {}

  async create(createUserDto: CreateUserContactDto) {
    let user: UserContact;

    try {
      user = await this.userRepo.create(createUserDto);
      this.logger.log(`UserContact created: ${JSON.stringify(user)}`);
      return user;
    } catch (error) {
      this.handeDBExceptions(error);
    }
  }

  findAll(query: PostQueryDto) {
    const filter = {};

    if (query.search) {
      filter['$or'] = [
        { name: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
      ];
    }
    return this.userRepo.findAndCount(
      {
        ...filter,
      },
      {
        limit: query.limit,
        skip: (query.page - 1) * query.limit,
        sort: query.sort,
      },
    );
  }

  async findOneById(id: ObjectId) {
    let user: UserContact;

    try {
      user = await this.userRepo.findOneById(id);
    } catch (error) {
      this.handeDBExceptions(error);
    }

    if (!user) {
      throw new NotFoundException(`UserContact with  id not found`);
    }

    return user;
  }

  async update(id: ObjectId, updateUserDto: UpdateUserContactDto) {
    let user: UserContact;
    try {
      user = await this.userRepo.findOneById(id);
    } catch (error) {
      this.handeDBExceptions(error);
    }

    if (!user) {
      throw new NotFoundException(
        `UserContact with id:  ${JSON.stringify(id)} not found`,
      );
    }

    Object.assign(user, updateUserDto);
    try {
      const userUpdated = await this.userRepo.update(id, user);
      this.logger.log(`UserContact updated: ${JSON.stringify(userUpdated)}`);
      return userUpdated;
    } catch (error) {
      this.handeDBExceptions(error);
    }
  }

  //softdelete
  async remove(id: ObjectId) {
    let user: UserContact;
    try {
      user = await this.userRepo.findOneById(id);
    } catch (error) {
      this.handeDBExceptions(error);
    }

    if (!user) {
      throw new NotFoundException(
        `UserContact with id:  ${JSON.stringify(id)} not found`,
      );
    }

    try {
      await this.userRepo.delete(user._id);
      this.logger.log(`UserContact deleted: ${JSON.stringify(user)}`);
      return {
        status: 'ok',
        message: 'UserContact deleted successfully',
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
    this.logger.error(error.detail);

    throw new InternalServerErrorException(
      'Unspected error, check server logs',
    );
  }
}
