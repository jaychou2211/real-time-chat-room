import { ColumnType, Generated } from "kysely";
import { Relation_Contactor, Relation_Teacher } from "../../rooms/rooms/constants";

export interface RoomUserRefsTable {
  id: Generated<string>;
  room_id: string;
  user_id: string;
  relation: Relation_Contactor | typeof Relation_Teacher;
  created_at: ColumnType<Date, Generated<string>, string | undefined>;
  updated_at: ColumnType<Date, Generated<string>, string | undefined>;
  deleted_at: ColumnType<Date | null, string | undefined, string | undefined>;
};