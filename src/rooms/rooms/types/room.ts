import { Relation_Contactor, Relation_Teacher } from "../constants";

export interface IRoom {
  id: string;
  name: string;
  hostId: string;
}

export interface IMember {
  id: string;
  relation: Relation_Contactor | typeof Relation_Teacher;
}