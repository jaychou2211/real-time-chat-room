import { Inject, Injectable } from '@nestjs/common';
import { IMessage } from './types/message';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IMessageRepository } from './repository/message-repository.interface';
import { IRoomRepository } from '../rooms/repository/room-repository.interface';

@Injectable()
export class MessagesService {
  constructor(
    @Inject('MESSAGE_REPOSITORY') private readonly messageRepository: IMessageRepository,
    @Inject('ROOM_REPOSITORY') private readonly roomRepository: IRoomRepository,
    private readonly eventEmitter: EventEmitter2
  ) { }

  findAll(roomId: string) {
    return this.messageRepository.findAll(roomId);
  }

  async create(message: Omit<IMessage, 'id'>) {
    const createdMessage = await this.messageRepository.create(message);
    const memberIds = await this.roomRepository
      .getMembers(createdMessage.roomId)
      .then(members => members.map(member => member.id));
    this.eventEmitter.emit('message.created', {
      message: createdMessage,
      memberIds
    });
    return createdMessage;
  }
}
