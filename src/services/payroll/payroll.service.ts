import { createClient } from "@/lib/supabase/client";
import {
  NewPayrollBatch,
  UpdatePayrollBatch,
  PayrollBatch,
} from "@/types/supabase";

const supabase = createClient();

export const payrollService = {
  async getAll() {
    const { data, error } = await supabase
      .from("payroll_batches")
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("payroll_batches")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return data;
  },

  async create(payload: NewPayrollBatch) {
    const { data, error } = await supabase
      .from("payroll_batches")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async update(id: string, payload: UpdatePayrollBatch) {
    const { data, error } = await supabase
      .from("payroll_batches")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async remove(id: string) {
    const { error } = await supabase
      .from("payroll_batches")
      .update({
        deleted_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw error;
  },

  async createItems(items: {
    batch_id: string;
    employee_id: string;
    amount: number;
    wallet_address: string;
  }[]) {
    const { data, error } = await supabase
      .from("payroll_items")
      .insert(items)
      .select();

    if (error) throw error;

    return data;
  },
};