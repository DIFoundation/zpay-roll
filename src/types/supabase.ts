import { Database } from "./database";

export type Tables =
  Database["public"]["Tables"];

export type Employee =
  Tables["employees"]["Row"];

export type NewEmployee =
  Tables["employees"]["Insert"];

export type UpdateEmployee =
  Tables["employees"]["Update"];

export type PayrollBatch =
  Tables["payroll_batches"]["Row"];

export type NewPayrollBatch =
  Tables["payroll_batches"]["Insert"];

export type UpdatePayrollBatch =
  Tables["payroll_batches"]["Update"];

export type PayrollItem =
  Tables["payroll_items"]["Row"];

export type Wallet =
  Tables["wallets"]["Row"];

export type Transaction =
  Tables["transactions"]["Row"];

export type Organization =
  Tables["organizations"]["Row"];

export type Profile =
  Tables["profiles"]["Row"];