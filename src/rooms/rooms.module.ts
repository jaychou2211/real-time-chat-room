import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms/rooms.service';
import { RoomRepository } from './rooms/repository/room-repository';
import { DatabaseModule } from 'src/database/database.module';
import { MessagesService } from './messages/messages.service';
import { MessageRepository } from './messages/repository/message-repository';

@Module({
  imports: [DatabaseModule],
  controllers: [RoomsController],
  providers: [
    RoomsService,
    {
      provide: 'ROOM_REPOSITORY',
      useClass: RoomRepository
    },
    MessagesService,
    {
      provide: 'MESSAGE_REPOSITORY',
      useClass: MessageRepository
    }
  ]
})
export class RoomsModule {}
