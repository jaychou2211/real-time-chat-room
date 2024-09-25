import { IMessage } from "../types/message";
import type { DbConnection } from "../../../database/database";

export interface IMessageRepository {
  findAll(roomId: string, db?: DbConnection): Promise<IMessage[]>;
  create(message: Omit<IMessage, 'id'>, db?: DbConnection): Promise<IMessage>;
  // 可以根據需要添加更多方法
}