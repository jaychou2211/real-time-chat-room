import { Configuration, Value } from "@itgorillaz/configify";
import { IsNotEmpty } from "class-validator";

@Configuration()
export class RedisConfiguration {
  @IsNotEmpty()
  @Value('REDIS_HOST')
  host: string;

  @IsNotEmpty()
  @Value('REDIS_PORT', { parse: parseInt })
  port: number;

}