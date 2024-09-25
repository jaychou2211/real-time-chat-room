import { Module } from '@nestjs/common';
import { dialect, Database } from './database';
import { Kysely } from 'kysely';
import { Transaction } from './execute-transaction';

const databaseProvider = {
  provide: 'DATABASE',
  useFactory: async () => (new Kysely<Database>({ dialect }))
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
