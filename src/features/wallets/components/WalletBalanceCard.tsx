"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  balance: number;
}

export function WalletBalanceCard({
  balance,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Balance</CardTitle>
      </CardHeader>

      <CardContent>
        <h2 className="text-3xl font-bold">
          {balance.toFixed(8)} ZEC
        </h2>
      </CardContent>
    </Card>
  );
}