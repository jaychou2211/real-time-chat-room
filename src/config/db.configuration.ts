import { Configuration, Value } from "@itgorillaz/configify";
import { IsNotEmpty } from "class-validator";

@Configuration()
export class DatabaseConfiguration {
  @IsNotEmpty()
  @Value('DB_NAME')
  DB_NAME: string;

  @IsNotEmpty()
  @Value('DB_HOST')
  DB_HOST: string;

  @IsNotEmpty()
  @Value('DB_USER')
  DB_USER: string;

  @IsNotEmpty()
  @Value('DB_PASSWORD')
  DB_PASSWORD: string;

  @IsNotEmpty()
  @Value('DB_PORT', { parse: parseInt })
  DB_PORT: number;
}