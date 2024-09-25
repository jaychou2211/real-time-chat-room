import { ColumnType, Generated } from "kysely";

export interface UsersTable {
  id: Generated<string>;
  username: string;
  password: string;
  created_at: ColumnType<Date, Generated<string>, string | undefined>;
  updated_at: ColumnType<Date, Generated<string>, string | undefined>;
  deleted_at: ColumnType<Date | null, string | undefined, string | undefined>;
}