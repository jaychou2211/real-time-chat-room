import { Inject, Injectable } from "@nestjs/common";
import { IMessageRepository } from "./message-repository.interface";
import type { DbConnection } from "../../../database/database";
import { IMessage } from "../types/message";

@Injectable()
export class MessageRepository implements IMessageRepository {
  constructor(
    @Inject('DATABASE') private readonly db: DbConnection
  ) { }

  getDb(db?: DbConnection): DbConnection {
    return db ?? this.db;
  }

  async findAll(roomId: string, db?: DbConnection): Promise<IMessage[]> {
    return this.getDb(db)
      .selectFrom('messages')
      .select(['id', 'room_id as roomId', 'type', 'payload', 'created_by as createdBy'])
      .where('room_id', '=', roomId)
      .execute();
  }

  async create(message: Omit<IMessage, 'id'>, db?: DbConnection): Promise<IMessage> {
    return await this.getDb(db)
      .insertInto('messages')
      .values(({
        room_id: message.roomId,
        type: message.type,
        payload: message.payload,
        created_by: message.createdBy
      }))
      .returning(['id', 'room_id as roomId', 'type', 'payload', 'created_by as createdBy'])
      .executeTakeFirstOrThrow();
  }
}