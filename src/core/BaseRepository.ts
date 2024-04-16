import { Injectable, Inject } from '@nestjs/common';
import {
  Collection,
  ObjectId,
  Db,
  WithId,
  Filter,
  OptionalUnlessRequiredId,
} from 'mongodb';

@Injectable()
export class BaseRepository<T> {
  protected readonly collection: Collection<T>;

  constructor(
    @Inject('DATABASE_CONNECTION') protected readonly db: Db,
    collectionName: string,
  ) {
    this.collection = db.collection<T>(collectionName);
  }

  async findAll(): Promise<WithId<T>[]> {
    return await this.collection.find().toArray();
  }

  async findOneById(id: string): Promise<WithId<T> | null> {
    return await this.collection.findOne({
      _id: new ObjectId(id),
    } as Filter<T>);
  }

  async findOne(filter: Filter<T>): Promise<WithId<T> | null> {
    return await this.collection.findOne(filter);
  }

  async create(
    entity: Omit<T, '_id' | 'createdAt' | 'updatedAt'>,
  ): Promise<WithId<T>> {
    const now = new Date();
    const createdAt = now.toISOString();
    const updatedAt = now.toISOString();
    const entityWithTimestamps = {
      ...entity,
      createdAt,
      updatedAt,
    };
    const result = await this.collection.insertOne(
      entityWithTimestamps as unknown as OptionalUnlessRequiredId<T>,
    );
    return {
      ...entityWithTimestamps,
      _id: result.insertedId,
    } as unknown as WithId<T>;
  }

  async update(id: string, entity: T): Promise<WithId<T> | null> {
    const updatedAt = new Date().toISOString();
    const result = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) } as Filter<T>,
      { $set: { ...entity, updatedAt } },
      { returnDocument: 'after' },
    );
    return result;
  }

  async delete(id: string): Promise<void> {
    await this.collection.deleteOne({ _id: new ObjectId(id) } as Filter<T>);
  }
}
