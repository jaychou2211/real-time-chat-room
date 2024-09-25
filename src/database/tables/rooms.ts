import { ColumnType, Generated } from "kysely";


export interface RoomsTable {
  id: Generated<string>;
  name: string;
  host_id: string;
  // member_ids: string[];
  created_at: ColumnType<Date, Generated<string>, string | undefined>;
  updated_at: ColumnType<Date, Generated<string>, string | undefined>;
  deleted_at: ColumnType<Date | null, string | undefined, string | undefined>;
};