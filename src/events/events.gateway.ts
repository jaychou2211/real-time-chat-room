import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import { WebSocketMiddleware } from 'src/auth/guards/websocket.middleware';
import { Cache } from 'cache-manager';
import { Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { IMessage } from 'src/rooms/messages/types/message';

@WebSocketGateway()
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger('EventsGateway');
  @WebSocketServer()
  server: Server<any, any>;

  constructor(
    private readonly websocketMiddleware: WebSocketMiddleware
  ) { }

  afterInit(server: Server) {
    this.logger.log('WebSocketGateway initialized');
    server.use(this.websocketMiddleware.validateToken);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: 🔥 usesrId: ${client.data.user.id}🔥`);
    // Support multiple tabs/devices for the same user 
    //or different users logging in with the same user_account
    client.join(client.data.user.id);

    client.on("disconnecting", () => {
      // the Set contains at least the socket ID
      this.logger.log(`${JSON.stringify([...client.rooms])}`);
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected:, ${JSON.stringify(Array.from(client.rooms))}`);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  @OnEvent('message.created')
  sendMessage(payload: { message: IMessage, memberIds: string[] }) {
    console.log('payload_49', payload);
    this.server.to(payload.memberIds).emit('message', payload.message);
  }
}
