import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isMongoId } from 'class-validator';
import { ObjectId } from 'mongodb';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: string) {
    if (!isMongoId(value)) {
      throw new BadRequestException(`${value} is not a valid MongoID`);
    }

    return new ObjectId(value);
  }
}
