import { IMember, IRoom } from "../types/room";
import type { DbConnection } from "../../../database/database";

export interface IRoomRepository {
  findById(id: string, db?: DbConnection): Promise<IRoom | null>;
  findByHostId(hostId: string, db?: DbConnection): Promise<IRoom | null>;
  getMembers(roomId: string, db?: DbConnection): Promise<IMember[]>;

  create(room: MutateRoomParams, db?: DbConnection): Promise<MutateRoomResult>;

  update(id: string, room: Omit<IRoom, 'id'>, db?: DbConnection): Promise<IRoom | null>;
  joinRoom(roomId: string, members: IMember[], db?: DbConnection): Promise<void>;
  leaveRoom(roomId: string, memberIds: string[], db?: DbConnection): Promise<void>;

  delete(id: string, db?: DbConnection): Promise<void>;
}

export type MutateRoomParams = Omit<IRoom, 'id'> & { members: IMember[] };
export type MutateRoomResult = IRoom & { members: IMember[] };