import {
  Collection,
  ObjectId,
  Db,
  WithId,
  Filter,
  OptionalUnlessRequiredId,
  FindOptions,
} from 'mongodb';

export class BaseRepository<T> {
  protected readonly collection: Collection<T>;

  constructor(db: Db, collectionName: string) {
    this.collection = db.collection<T>(collectionName);
  }

  async findAll(
    filter?: Filter<T>,
    options?: FindOptions,
  ): Promise<WithId<T>[]> {
    const docs = await this.collection.find(filter, options).toArray();
    return docs as WithId<T>[];
  }

  async findAndCount(
    filter?: Filter<T>,
    options?: FindOptions,
  ): Promise<{ data: WithId<T>[]; count: number }> {
    const docs = await this.collection.find(filter, options).toArray();
    const count = await this.collection.countDocuments(filter);
    return { data: docs as WithId<T>[], count };
  }

  async findOneById(id: ObjectId): Promise<WithId<T> | null> {
    return await this.collection.findOne({
      _id: id,
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

  async update(id: ObjectId, entity: T): Promise<WithId<T> | null> {
    const updatedAt = new Date().toISOString();
    const result = await this.collection.findOneAndUpdate(
      { _id: id } as Filter<T>,
      { $set: { ...entity, updatedAt } },
      { returnDocument: 'after' },
    );
    return result;
  }

  async delete(id: ObjectId): Promise<void> {
    await this.collection.deleteOne({ _id: id } as Filter<T>);
  }
}
