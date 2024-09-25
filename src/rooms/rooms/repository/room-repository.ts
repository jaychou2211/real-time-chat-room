import { Inject, Injectable } from "@nestjs/common";
import { IRoomRepository, MutateRoomParams, MutateRoomResult } from "./room-repository.interface";
import type { DbConnection } from "../../../database/database";
import { IMember, IRoom } from "../types/room";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { Transaction } from "../../../database/execute-transaction";

@Injectable()
export class RoomRepository implements IRoomRepository {
  constructor(
    @Inject('DATABASE') private readonly db: DbConnection,
    @Inject('TRANSACTION') private readonly transaction: Transaction,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  getDb(db?: DbConnection): DbConnection {
    return db ?? this.db;
  }

  async findById(id: string, db?: DbConnection): Promise<IRoom | null> {
    const room = await this.getDb(db)
      .selectFrom('rooms')
      .select(['id', 'name', 'host_id as hostId'])
      .where('id', '=', id)
      .where('deleted_at', 'is', null)
      .executeTakeFirst();

    if (!room) return null;
    return room;
  }

  async findByHostId(hostId: string, db?: DbConnection): Promise<IRoom | null> {
    const room = await this.getDb(db)
      .selectFrom('rooms')
      .select(['id', 'name', 'host_id as hostId'])
      .where('host_id', '=', hostId)
      .where('deleted_at', 'is', null)
      .executeTakeFirst();

    if (!room) return null;

    return room;
  }

  async getMembers(roomId: string, db?: DbConnection): Promise<IMember[]> {
    const getMembers = (db: DbConnection) => db
      .selectFrom('room_user_refs')
      .select(['user_id as id', 'relation'])
      .where('room_id', '=', roomId)
      .where('deleted_at', 'is', null)
      .execute();

    // 有外部帶進來的 db connection(aka transaction) 不能使用 cache 的值
    if (db) return getMembers(db);

    // 從 cache 中取得 memberIds
    const cacheKey = `member_ids_in_room:${roomId}`;
    const cachedMembers = await this.cacheManager.get<IMember[]>(cacheKey);
    console.log('60');
    if (cachedMembers)
      return cachedMembers;

    const members = await getMembers(this.db);
    console.log('64', members);

    await this.cacheManager.set(cacheKey, members, 60*1000);

    return members;
  };

  private async createRoom(
    room: MutateRoomParams,
    db: DbConnection
  ): Promise<MutateRoomResult> {
    const createdRoom = await db
      .insertInto('rooms')
      .values({
        name: room.name,
        host_id: room.hostId
      })
      .returning(['id', 'name', 'host_id as hostId'])
      .executeTakeFirstOrThrow();

    const members = await db
      .insertInto('room_user_refs')
      .values(room.members.map(member => ({ 
        room_id: createdRoom.id, 
        user_id: member.id, 
        relation: member.relation 
      })))
      .returning(['user_id as id', 'relation'])
      .execute();

    return {
      ...createdRoom,
      members,
    };
  }

  create(
    room: MutateRoomParams,
    db?: DbConnection
  ): Promise<MutateRoomResult> {
    return db
      // 有外部帶進來的 db connection(aka transaction) 直接使用
      ? this.createRoom(room, db)
      // 外部沒有帶進 db connection，則發起一個新的 transaction
      : this.transaction.execute(async trx => this.createRoom(room, trx));
  }

  async update(id: string, room: Omit<IRoom, 'id'>, db?: DbConnection): Promise<IRoom | null> {
    const updatedRoom = await this.getDb(db)
      .updateTable('rooms')
      .set(room)
      .where('id', '=', id)
      .returning(['id', 'name', 'host_id as hostId'])
      .executeTakeFirst();

    if (!updatedRoom) return null;
    return updatedRoom;
  }

  private async deleteRoom(
    id: string,
    db: DbConnection
  ): Promise<void> {
    await db
      .updateTable('rooms')
      .set({ deleted_at: (new Date()).toISOString() })
      .where('id', '=', id)
      .execute();

    await db
      .updateTable('room_user_refs')
      .set({ deleted_at: (new Date).toISOString() })
      .where('room_id', '=', id)
      .execute();

    await db
      .updateTable('messages')
      .set({ deleted_at: (new Date).toISOString() })
      .where('room_id', '=', id)
      .execute();
  }

  async delete(
    id: string,
    db?: DbConnection
  ): Promise<void> {
    return db
      // 有外部帶進來的 db connection(aka transaction) 直接使用
      ? this.deleteRoom(id, db)
      // 外部沒有帶進 db connection，則發起一個新的 transaction
      : this.transaction.execute(async trx => this.deleteRoom(id, trx));
  }

  async joinRoom(roomId: string, members: IMember[], db?: DbConnection): Promise<void> {
    await this.getDb(db)
      .insertInto('room_user_refs')
      .values(members.map(member => ({ 
        room_id: roomId, 
        user_id: member.id, 
        relation: member.relation 
      })))
      .execute();
  }

  async leaveRoom(roomId: string, memberIds: string[], db?: DbConnection): Promise<void> {
    await this.getDb(db)
      .updateTable('room_user_refs')
      .set({ deleted_at: (new Date).toISOString() })
      .where('room_id', '=', roomId)
      .where('user_id', 'in', memberIds)
      .execute();
  }
}