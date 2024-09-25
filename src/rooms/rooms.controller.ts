import { Body, Controller, Delete, Get, Inject, Logger, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateRoomDto } from './rooms/dto/create-room.dto';
import { CreateMessageDto } from 'src/rooms/messages/dto/create-message.dto';
import { RoomsService } from './rooms/rooms.service';
import { MessagesService } from './messages/messages.service';
import { Relation_Contactor } from './rooms/constants';
import { IMember } from './rooms/types/room';

@Controller('rooms')
export class RoomsController {
  private readonly logger = new Logger(RoomsController.name);
  constructor(
    private readonly roomsService: RoomsService,
    private readonly messagesService: MessagesService,
  ) { }

  @Get(':id')
  findById(@Param('id') id: string) {
    this.logger.log('findById');
    return this.roomsService.findById(id);
  }

  @Get('by-host/:hostId')
  findByHostId(@Param('hostId') hostId: string) {
    this.logger.log('findByHostId');
    return this.roomsService.findByHostId(hostId);
  }

  @Get(':roomId/members')
  getMembers(@Param('roomId') roomId: string) {
    this.logger.log('getMembers');
    return this.roomsService.getMembers(roomId);
  }

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() room: CreateRoomDto) {
    this.logger.log('createRoom');
    return this.roomsService.create({
      ...room,
      members: [{ id: room.hostId, relation: Relation_Contactor.Me }],
    });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() room: any) {
    return this.roomsService.update(id, room);
  }

  @Post(':id/join')
  join(@Param('id') id: string, @Body() members: IMember[]) {
    return this.roomsService.joinRoom(id, members);
  }

  @Post(':id/leave')
  leave(@Param('id') id: string, @Body() memberIds: string[]) {
    return this.roomsService.leaveRoom(id, memberIds);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.roomsService.delete(id);
  }

  @Get(':roomId/messages')
  findMessagesByRoomId(@Param('roomId') roomId: string) {
    return this.messagesService.findAll(roomId);
  }

  @Post(':roomId/messages')
  @UsePipes(ValidationPipe)
  createMessage(
    @Param('roomId') roomId: string,
    @Body() message: CreateMessageDto
  ) {
    this.logger.log('createMessage');
    return this.messagesService.create({
      roomId,
      ...message,
    });
  }
}
