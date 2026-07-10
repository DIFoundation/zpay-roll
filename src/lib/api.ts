import { supabase } from "./supabase";
import type { Database } from "./database.types";

type PayrollBatch = Database["public"]["Tables"]["payroll_batches"]["Row"];
type PayrollBatchInsert = Database["public"]["Tables"]["payroll_batches"]["Insert"];
type PayrollRecipient = Database["public"]["Tables"]["payroll_recipients"]["Row"];
type PayrollRecipientInsert = Database["public"]["Tables"]["payroll_recipients"]["Insert"];

export async function listBatches() {
  const { data, error } = await supabase
    .from("payroll_batches")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw error;
  return data;
}

export async function getBatch(batchId: string) {
  const { data, error } = await supabase
    .from("payroll_batches")
    .select("*")
    .eq("id", batchId)
    .single();

  if (error) throw error;
  return data;
}

export async function getRecipients(batchId: string) {
  const { data, error } = await supabase
    .from("payroll_recipients")
    .select("*")
    .eq("batch_id", batchId);

  if (error) throw error;
  return data;
}

export async function createBatch(
  data: Omit<PayrollBatchInsert, "id" | "user_id"> & {
    recipients: Omit<PayrollRecipientInsert, "id" | "batch_id">[]
  }
) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Not authenticated");

  const totalZec = data.recipients.reduce((sum, r) => sum + Number(r.amount), 0);

  const { data: batch, error: batchError } = await supabase
    .from("payroll_batches")
    .insert({
      user_id: user.id,
      name: data.name,
      sender_address: data.sender_address,
      memo: data.memo,
      status: "draft",
      total_zec: totalZec,
      recipient_count: data.recipients.length,
    })
    .select()
    .single();

  if (batchError) throw batchError;

  const recipients = data.recipients.map((r) => ({
    ...r,
    batch_id: batch.id,
  }));

  const { error: recipientsError } = await supabase
    .from("payroll_recipients")
    .insert(recipients);

  if (recipientsError) throw recipientsError;

  return batch.id;
}

export async function updateBatchStatus(
  batchId: string,
  updates: Partial<Omit<PayrollBatchInsert, "id" | "user_id" | "created_at" | "updated_at">>
) {
  const { data, error } = await supabase
    .from("payroll_batches")
    .update(updates)
    .eq("id", batchId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function addRecipient(
  batchId: string,
  recipient: Omit<PayrollRecipientInsert, "id" | "batch_id">
) {
  const { data, error } = await supabase
    .from("payroll_recipients")
    .insert({
      ...recipient,
      batch_id: batchId,
    })
    .select()
    .single();

  if (error) throw error;

  // Update batch recipient count and total ZEC
  const { data: recipients } = await supabase
    .from("payroll_recipients")
    .select("amount")
    .eq("batch_id", batchId);

  if (recipients) {
    const totalZec = recipients.reduce((sum, r) => sum + Number(r.amount), 0);
    await supabase
      .from("payroll_batches")
      .update({
        recipient_count: recipients.length,
        total_zec: totalZec,
      })
      .eq("id", batchId);
  }

  return data;
}

export async function updateRecipient(
  recipientId: string,
  updates: Partial<Omit<PayrollRecipientInsert, "id" | "batch_id">>
) {
  const { data: recipient, error: getError } = await supabase
    .from("payroll_recipients")
    .select("batch_id")
    .eq("id", recipientId)
    .single();

  if (getError) throw getError;

  const { data, error } = await supabase
    .from("payroll_recipients")
    .update(updates)
    .eq("id", recipientId)
    .select()
    .single();

  if (error) throw error;

  // Update batch total ZEC
  const { data: recipients } = await supabase
    .from("payroll_recipients")
    .select("amount")
    .eq("batch_id", recipient.batch_id);

  if (recipients) {
    const totalZec = recipients.reduce((sum, r) => sum + Number(r.amount), 0);
    await supabase
      .from("payroll_batches")
      .update({
        total_zec: totalZec,
      })
      .eq("id", recipient.batch_id);
  }

  return data;
}

export async function deleteRecipient(recipientId: string) {
  const { data: recipient, error: getError } = await supabase
    .from("payroll_recipients")
    .select("batch_id")
    .eq("id", recipientId)
    .single();

  if (getError) throw getError;

  const { error } = await supabase.from("payroll_recipients").delete().eq("id", recipientId);

  if (error) throw error;

  // Update batch recipient count and total ZEC
  const { data: recipients } = await supabase
    .from("payroll_recipients")
    .select("amount")
    .eq("batch_id", recipient.batch_id);

  if (recipients) {
    const totalZec = recipients.reduce((sum, r) => sum + Number(r.amount), 0);
    await supabase
      .from("payroll_batches")
      .update({
        recipient_count: recipients.length,
        total_zec: totalZec,
      })
      .eq("id", recipient.batch_id);
  }
}

export async function broadcastBatch(batchId: string) {
  // Update status to broadcasting
  const { error } = await supabase
    .from("payroll_batches")
    .update({
      status: "broadcasting",
      broadcasted_at: new Date().toISOString(),
    })
    .eq("id", batchId);

  if (error) throw error;

  // Note: Actual transaction broadcasting will be handled by a server-side process
  // This function just updates the database status
  return true;
}
