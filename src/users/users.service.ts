import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './entities/user.repository';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersService {
  constructor(private readonly userRepo: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    let user: User;

    const userDto: CreateUserDto = {
      ...createUserDto,
      password: bcrypt.hashSync(createUserDto.password, 10),
    };
    try {
      user = await this.userRepo.findOne({ email: userDto.email });
    } catch (error) {
      this.handeDBExceptions(error);
    }

    if (user) {
      throw new BadRequestException('Email already exists');
    }

    try {
      user = await this.userRepo.create(userDto);
      return user;
    } catch (error) {
      this.handeDBExceptions(error);
    }
  }

  findAll() {
    return this.userRepo.findAll();
  }

  async findOneById(id: ObjectId) {
    let user: User;

    try {
      user = await this.userRepo.findOneById(id);
    } catch (error) {
      this.handeDBExceptions(error);
    }

    if (!user) {
      throw new NotFoundException(`User with  id not found`);
    }

    return user;
  }

  async findOneByEmail(email: string) {
    let user: User;

    try {
      user = await this.userRepo.findOne({ email });
    } catch (error) {
      this.handeDBExceptions(error);
    }

    if (!user) {
      throw new NotFoundException(`User with email: ${email} not found`);
    }

    return user;
  }

  async update(id: ObjectId, updateUserDto: UpdateUserDto) {
    let user: User;
    try {
      user = await this.userRepo.findOneById(id);
    } catch (error) {
      this.handeDBExceptions(error);
    }

    if (!user) {
      throw new NotFoundException(
        `User with id:  ${JSON.stringify(id)} not found`,
      );
    }

    Object.assign(user, updateUserDto);
    try {
      return await this.userRepo.update(id, user);
    } catch (error) {
      this.handeDBExceptions(error);
    }
  }

  //softdelete
  async remove(id: ObjectId) {
    let user: User;
    try {
      user = await this.userRepo.findOneById(id);
    } catch (error) {
      this.handeDBExceptions(error);
    }

    if (!user) {
      throw new NotFoundException(
        `User with id:  ${JSON.stringify(id)} not found`,
      );
    }

    try {
      await this.userRepo.delete(user._id);
      return {
        status: 'ok',
        message: 'User deleted successfully',
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
    console.log(error);

    throw new InternalServerErrorException(
      'Unspected error, check server logs',
    );
  }
}
