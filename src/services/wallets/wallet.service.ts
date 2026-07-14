import { createClient } from "@/lib/supabase/client";
import { Wallet } from "@/types/supabase";

const supabase = createClient();

export const walletService = {
  async getWallet() {
    const { data, error } = await supabase
      .from("wallets")
      .select("*")
      .limit(1)
      .single();

    if (error) throw error;

    return data as Wallet;
  },

  async connectWallet(
    address: string,
    organizationId: string,
    createdBy: string
  ) {
    const { data, error } = await supabase
      .from("wallets")
      .insert({
        address,
        organization_id: organizationId,
        created_by: createdBy,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async disconnectWallet(id: string) {
    const { error } = await supabase
      .from("wallets")
      .update({
        status: "disconnected",
      })
      .eq("id", id);

    if (error) throw error;
  },

  async refreshBalance(id: string) {
    const balance = Number((Math.random() * 30).toFixed(8));

    const { data, error } = await supabase
      .from("wallets")
      .update({
        last_synced_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return {
      wallet: data,
      balance,
    };
  },
};