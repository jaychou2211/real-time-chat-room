import { Module } from '@nestjs/common';
import { Database } from './database';
import { Kysely, PostgresDialect } from 'kysely';
import { Transaction } from './execute-transaction';
import { DatabaseConfiguration } from 'src/config/db.configuration';
import { Pool } from 'pg';

const databaseProvider = {
  provide: 'DATABASE',
  useFactory: async (dbConfig: DatabaseConfiguration) => (new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool({
        database: dbConfig.DB_NAME,
        host: dbConfig.DB_HOST,
        user: dbConfig.DB_USER,
        password: dbConfig.DB_PASSWORD,
        port: dbConfig.DB_PORT,
        max: 10,
      })
    })
  })),
  inject: [DatabaseConfiguration]
}

const transactionProvider = {
  provide: 'TRANSACTION',
  useClass: Transaction
}

const providers = [
  databaseProvider,
  transactionProvider
]

@Module({
  providers: providers,
  exports: providers
})
export class DatabaseModule { }
