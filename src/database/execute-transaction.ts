import { Inject, Injectable } from "@nestjs/common"
import { Database, DbConnection } from "./database"
import { Transaction as KyselyTransaction } from "kysely"

@Injectable()
export class Transaction {
  constructor(@Inject('DATABASE') private readonly db: DbConnection) { }

  execute(cb: (trx: KyselyTransaction<Database>) => Promise<any>) {
    return this.db
      .transaction()
      .execute(async trx => cb(trx)) as ReturnType<typeof cb>
  }
}