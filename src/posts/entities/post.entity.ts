import { ObjectId } from 'mongodb';
import { PostType } from '../types';

export class Post {
  _id: ObjectId;
  title: string;
  subtitle: string;
  content: string;
  userId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  isPublished: boolean;
  type: PostType;
  images?: string[];
}
