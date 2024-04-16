import { Module } from '@nestjs/common';
import { UserContactService } from './user-contact.service';
import { UserContactController } from './user-contact.controller';
import { UserContactRepository } from './entities/user-contact.repository';

@Module({
  controllers: [UserContactController],
  providers: [UserContactService, UserContactRepository],
})
export class UserContactModule {}
