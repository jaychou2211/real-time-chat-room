import { Inject, Injectable } from "@nestjs/common";
import { IUserRepository, IUser } from "./user-repository.interface";
import type { DbConnection } from "../../database/database";

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @Inject('DATABASE') private readonly db: DbConnection
  ) {}

  getDb(db?: DbConnection): DbConnection {
    return db ?? this.db;
  }

  async findOneByUsername(username: string, db?: DbConnection): Promise<IUser | null> {
    return this.getDb(db)
      .selectFrom('users')
      .select(['id', 'username', 'password'])
      .where('username', '=', username)
      .executeTakeFirst();
  }

  async create(user: Omit<IUser, 'id'>, db?: DbConnection): Promise<IUser> {
    return this.getDb(db)
      .insertInto('users')
      .values(user)
      .returning(['id', 'username', 'password'])
      .executeTakeFirstOrThrow();
  }
}