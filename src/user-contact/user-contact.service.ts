import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserContactDto } from './dto/create-user-contact.dto';
import { UpdateUserContactDto } from './dto/update-user-contact.dto';
import { UserContactRepository } from './entities/user-contact.repository';
import { UserContact } from './entities/user-contact.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class UserContactService {
  constructor(private readonly userRepo: UserContactRepository) {}

  async create(createUserDto: CreateUserContactDto) {
    let user: UserContact;

    try {
      user = await this.userRepo.create(createUserDto);
      return user;
    } catch (error) {
      this.handeDBExceptions(error);
    }
  }

  findAll() {
    return this.userRepo.findAll();
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

  async findOneByEmail(email: string) {
    let user: UserContact;

    try {
      user = await this.userRepo.findOne({ email });
    } catch (error) {
      this.handeDBExceptions(error);
    }

    if (!user) {
      throw new NotFoundException(`UserContact with email: ${email} not found`);
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
      return await this.userRepo.update(id, user);
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
    console.log(error);

    throw new InternalServerErrorException(
      'Unspected error, check server logs',
    );
  }
}
