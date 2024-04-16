import { ObjectId } from 'mongodb';

export class UserContact {
  _id: ObjectId;
  name: string;
  lastName: string;
  email: string;
  profession: string;
  company: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}
