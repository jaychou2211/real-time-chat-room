import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Socket } from "socket.io";

@Injectable()
export class WebSocketMiddleware {
  constructor(
    private readonly jwtService: JwtService
  ) { }

  validateToken = async (socket: Socket, next: any) => {
    const { authorization } = socket.handshake.headers;
    const token = authorization.split(' ')[1];
    if (!token) throw new UnauthorizedException;

    try {
      const decoded = await this.jwtService.verify(token);
      socket.data.user = {
        username: decoded.username,
        id: decoded.sub
      };
      return next();
    } catch (error) {
      throw new UnauthorizedException;
    }
  }
}