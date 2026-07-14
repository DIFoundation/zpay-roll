"use client";

import { RefreshCcw, Unplug } from "lucide-react";

import { Wallet } from "@/types/supabase";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  wallet: Wallet;
  balance: number;
  onRefresh: () => void;
  onDisconnect: () => void;
}

export function WalletCard({
  wallet,
  balance,
  onRefresh,
  onDisconnect,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">
            Address
          </p>

          <p className="font-mono break-all">
            {wallet.address}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Network
          </p>

          <p>{wallet.network}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Status
          </p>

          <p>{wallet.status}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Balance
          </p>

          <p className="text-2xl font-bold">
            {balance.toFixed(8)} ZEC
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onRefresh}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          <Button
            variant="destructive"
            onClick={onDisconnect}
          >
            <Unplug className="mr-2 h-4 w-4" />
            Disconnect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}