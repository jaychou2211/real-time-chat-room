import type { DbConnection } from "../../database/database";

export interface IUser {
  id: string;
  username: string;
  password: string;
}

export interface IUserRepository {
  findOneByUsername(username: string, db?: DbConnection): Promise<IUser | null>;
  create(user: Omit<IUser, 'id'>, db?: DbConnection): Promise<IUser>;
  // 可以根據需要添加更多方法
}