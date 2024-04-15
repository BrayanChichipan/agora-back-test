import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from './entities/user.repository';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
})
export class UsersModule {}
