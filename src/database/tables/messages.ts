import { ColumnType, Generated, JSONColumnType } from "kysely";

export interface MessagesTable {
  id: Generated<string>;
  room_id: string;
  type: 'text' | 'image' | 'file';
  payload: JSONColumnType<any>;
  created_by: string;
  created_at: ColumnType<Date, Generated<string>, string | undefined>;
  updated_at: ColumnType<Date, Generated<string>, string | undefined>;
  updated_by: string | null;
  deleted_at: ColumnType<Date | null, string | undefined, string | undefined>;
}