import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RoomsModule } from './rooms/rooms.module';
import { DatabaseModule } from './database/database.module';
import { CacheModule } from '@nestjs/cache-manager';
import type { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';
import { ConfigifyModule } from '@itgorillaz/configify';
import { RedisConfiguration } from './config/redis.configuration';


@Module({
  imports: [
    UsersModule,
    AuthModule,
    EventsModule,
    RoomsModule,
    DatabaseModule,
    EventEmitterModule.forRoot(),
    ConfigifyModule.forRootAsync(),
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      useFactory: async (redisConfig: RedisConfiguration) => ({
        store: redisStore,
        socket: {
          host: redisConfig.host,
          port: redisConfig.port,
        },
      }),
      inject: [RedisConfiguration]
    })
  ],
})
export class AppModule { }
