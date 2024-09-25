import { Inject, Injectable } from '@nestjs/common';
import { IMember, IRoom } from './types/room';
import { IRoomRepository } from './repository/room-repository.interface';

@Injectable()
export class RoomsService {
  constructor(
    @Inject('ROOM_REPOSITORY') private readonly roomRepository: IRoomRepository,
  ) { }

  findByHostId(hostId: string) {
    return this.roomRepository.findByHostId(hostId);
  }

  findById(id: string) {
    return this.roomRepository.findById(id);
  }

  getMembers(roomId: string): Promise<IMember[]> {
    return this.roomRepository.getMembers(roomId);
  }

  create(room: Omit<IRoom, 'id'> & { members: IMember[] }) {
    return this.roomRepository.create(room);
  }

  update(id: string, room: IRoom) {
    return this.roomRepository.update(id, room);
  }

  joinRoom(id: string, members: IMember[]) {
    return this.roomRepository.joinRoom(id, members);
  }

  leaveRoom(id: string, memberIds: string[]) {
    return this.roomRepository.leaveRoom(id, memberIds);
  }

  delete(id: string) {
    return this.roomRepository.delete(id);
  }
}
