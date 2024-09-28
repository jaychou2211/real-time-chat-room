import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './redis-io.adapter';
import { RedisConfiguration } from './config/redis.configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const redisConfiguration = app.get(RedisConfiguration);
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis(redisConfiguration.host, redisConfiguration.port);

  app.useWebSocketAdapter(redisIoAdapter);
  await app.listen(3000);
}
bootstrap();
