import { RoomsTable, UsersTable, MessagesTable, RoomUserRefsTable } from './tables'
import { Pool } from 'pg'
import { Kysely, PostgresDialect, Transaction } from 'kysely'
import 'dotenv/config'

export interface Database {
  rooms: RoomsTable
  users: UsersTable
  room_user_refs: RoomUserRefsTable
  messages: MessagesTable
}

// export const dialect = new PostgresDialect({
//   pool: new Pool({
//     database: process.env.DB_NAME || 'test',
//     host: process.env.DB_HOST || 'localhost',
//     user: process.env.DB_USER || 'pizza',
//     password: process.env.DB_PASSWORD || '123456',
//     port: parseInt(process.env.DB_PORT || '5435'),
//     max: 10,
//   })
// })

export type DbConnection = Kysely<Database>;
