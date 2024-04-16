import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserContactService } from './user-contact.service';
import { CreateUserContactDto } from './dto/create-user-contact.dto';
import { UpdateUserContactDto } from './dto/update-user-contact.dto';
import { ParseMongoIdPipe } from '@/core/pipes/parse-mongo-id.pipe';
import { ObjectId } from 'mongodb';
import { UserContactQueryDto } from './dto/user-contact-query.dto';

@Controller('user-contact')
export class UserContactController {
  constructor(private readonly userContactService: UserContactService) {}

  @Post()
  create(@Body() createUserContactDto: CreateUserContactDto) {
    return this.userContactService.create(createUserContactDto);
  }

  @Get()
  findAll(@Query() query: UserContactQueryDto) {
    return this.userContactService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: ObjectId) {
    return this.userContactService.findOneById(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: ObjectId,
    @Body() updateUserContactDto: UpdateUserContactDto,
  ) {
    return this.userContactService.update(id, updateUserContactDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: ObjectId) {
    return this.userContactService.remove(id);
  }
}
