import { createClient } from "@/lib/supabase/server";
import { transactionService } from "@/services/zcash";
import { payrollService } from "./payroll.service";

export class PayrollProcessor {
  async process(batchId: string) {
    const supabase = await createClient();

    const batch = await payrollService.getBatch(batchId);

    if (!batch) {
      throw new Error("Payroll batch not found.");
    }

    await supabase
      .from("payroll_batches")
      .update({
        status: "processing",
      })
      .eq("id", batchId);

    const { data: items, error } = await supabase
      .from("payroll_items")
      .select(`
        *,
        employee:employees(*)
      `)
      .eq("batch_id", batchId);

    if (error) throw error;

    const results = [];

    for (const item of items ?? []) {
      try {
        const response =
          await transactionService.quickSend(
            batch.organization_id,
            item.wallet_address,
            Number(item.amount)
          );

        // const txHash =
        //   response.txid ??
        //   response.tx_hash ??
        //   null;

        const txHash = response.stdout.trim();

        await supabase
          .from("transactions")
          .insert({
            payroll_item_id: item.id,
            amount: item.amount,
            status: "broadcasting",
          })
          .select()
          .single();

        await supabase
          .from("payroll_items")
          .update({
            status: "paid",
          })
          .eq("id", item.id);

        results.push({
          employee: item.employee.first_name,
          success: true,
          txHash,
        });
      } catch (err) {
        await supabase
          .from("payroll_items")
          .update({
            status: "failed",
          })
          .eq("id", item.id);

        results.push({
          employee: item.employee.first_name,
          success: false,
          error:
            err instanceof Error
              ? err.message
              : "Unknown error",
        });
      }
    }

    const failed = results.some(
      (r) => !r.success
    );

    await supabase
      .from("payroll_batches")
      .update({
        status: failed
          ? "failed"
          : "completed",
      })
      .eq("id", batchId);

    return results;
  }
}

export const payrollProcessor =
  new PayrollProcessor();