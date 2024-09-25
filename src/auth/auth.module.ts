import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { WebSocketMiddleware } from './guards/websocket.middleware';
import { AuthConfiguration } from 'src/config/auth.configuration';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      useFactory: (authConfig: AuthConfiguration) => ({
        global: true,
        secret: authConfig.secret,
        signOptions: { expiresIn: '1d' },
      }),
      inject: [AuthConfiguration],
    }),
    PassportModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, WebSocketMiddleware],
  exports: [AuthService, WebSocketMiddleware],
  controllers: [AuthController],
})
export class AuthModule { }
