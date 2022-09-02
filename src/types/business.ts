import { TransactionTypes } from "./card";

export interface Business {
  id: number;
  name: string;
  type: TransactionTypes;
}
