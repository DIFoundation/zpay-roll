"use client";

import { Wallet } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";

import {
  useDisconnectWallet,
  useRefreshWallet,
  useWallet,
} from "@/hooks/useWallet";

import { ConnectWalletDialog } from "./ConnectWalletDialog";
import { WalletBalanceCard } from "./WalletBalanceCard";
import { WalletCard } from "./WalletCard";

export function WalletPage() {
  const { data: wallet, isLoading } =
    useWallet();

  const refreshWallet =
    useRefreshWallet();

  const disconnectWallet =
    useDisconnectWallet();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Wallet"
        description="Manage your Zcash wallet."
        action={
          !wallet && (
            <ConnectWalletDialog>
              <Button>
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </Button>
            </ConnectWalletDialog>
          )
        }
      />

      {wallet ? (
        <>
          <WalletBalanceCard
            balance={0}
          />

          <WalletCard
            wallet={wallet}
            balance={0}
            onRefresh={() =>
              refreshWallet.mutate(wallet.id)
            }
            onDisconnect={() =>
              disconnectWallet.mutate(wallet.id)
            }
          />
        </>
      ) : (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <Wallet className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />

          <h2 className="text-xl font-semibold">
            No Wallet Connected
          </h2>

          <p className="mt-2 text-muted-foreground">
            Connect your Zcash wallet to start paying employees.
          </p>
        </div>
      )}
    </div>
  );
}