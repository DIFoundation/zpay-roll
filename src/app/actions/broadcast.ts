"use server";

import { supabase } from "@/lib/supabase";

interface BroadcastPayload {
  batchId: string;
  senderAddress: string;
  recipients: Array<{
    address: string;
    amount: number;
    memo?: string;
  }>;
}

export async function broadcastTransaction(payload: BroadcastPayload) {
  const { batchId, senderAddress, recipients } = payload;

  try {
    // Step 1: Validate we have Zcash RPC configured
    const rpcUrl = process.env.ZCASH_RPC_URL;
    const rpcUser = process.env.ZCASH_RPC_USER;
    const rpcPass = process.env.ZCASH_RPC_PASS;

    if (!rpcUrl || !rpcUser || !rpcPass) {
      throw new Error("Zcash RPC not configured. Please set ZCASH_RPC_URL, ZCASH_RPC_USER, and ZCASH_RPC_PASS");
    }

    // Step 2: Build transaction with recipients
    console.log(`Broadcasting batch ${batchId} with ${recipients.length} recipients`);

    // Create transaction outputs
    const sends = recipients.map((r) => ({
      address: r.address,
      amount: r.amount,
      memo: r.memo,
    }));

    // Step 3: Call z_sendmany (requires unlocked wallet)
    const auth = Buffer.from(`${rpcUser}:${rpcPass}`).toString("base64");

    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: batchId,
        method: "z_sendmany",
        params: [senderAddress, sends, 1, 0],
      }),
    });

    const result = await response.json();

    if (result.error) {
      throw new Error(`Zcash RPC error: ${result.error.message}`);
    }

    const operationId = result.result;

    // Step 4: Update batch with operation ID
    const { error: updateError } = await supabase
      .from("payroll_batches")
      .update({
        status: "pending",
        operation_id: operationId,
      })
      .eq("id", batchId);

    if (updateError) throw updateError;

    return {
      success: true,
      operationId,
      message: "Transaction broadcast successfully. Operation ID: " + operationId,
    };
  } catch (error) {
    console.error("Broadcast error:", error);

    // Update batch with error status
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    await supabase
      .from("payroll_batches")
      .update({
        status: "failed",
        error_message: errorMessage,
      })
      .eq("id", batchId);

    throw error;
  }
}
