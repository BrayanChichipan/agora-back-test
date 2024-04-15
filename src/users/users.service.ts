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

@Injectable()
export class UsersService {
  constructor(private readonly userRepo: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    const userDto: CreateUserDto = {
      ...createUserDto,
      password: bcrypt.hashSync(createUserDto.password, 10),
    };
    try {
      const user = await this.userRepo.create(userDto);
      return user;
    } catch (error) {
      this.handeDBExceptions(error);
    }
  }

  findAll() {
    return this.userRepo.findAll();
  }

  async findOneById(id: string) {
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

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepo.findOneById(id);
      if (!user) {
        return new NotFoundException(
          `Pet with id:  ${JSON.stringify(id)} not found`,
        );
      }
      Object.assign(user, updateUserDto);
      return await this.userRepo.update(id, user);
    } catch (error) {
      this.handeDBExceptions(error);
    }
  }

  //softdelete
  async remove(id: string) {
    let user: User;
    try {
      user = await this.userRepo.findOneById(id);
    } catch (error) {
      this.handeDBExceptions(error);
    }

    if (!user) {
      return new NotFoundException(
        `User with id:  ${JSON.stringify(id)} not found`,
      );
    }

    try {
      return await this.userRepo.delete(user._id);
    } catch (error) {
      this.handeDBExceptions(error);
    }
  }

  //db delete
  // async delete(id: string) {
  //   try {
  //     await this.userRepo.delete({ id });
  //   } catch (error) {
  //     this.handeDBExceptions(error);
  //   }
  // }

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
