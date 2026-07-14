import {
  WalletAddress,
  WalletBalance,
} from "./types";

export function parseAddresses(
  output: string
): WalletAddress[] {
  return JSON.parse(output);
}

export function parseBalance(
  output: string
): WalletBalance {
  const value = (key: string) => {
    const match = output.match(
      new RegExp(`${key}:\\s*(\\d+)`)
    );

    return Number(match?.[1] ?? 0);
  };

  return {
    confirmed_orchard_balance: value(
      "confirmed_orchard_balance"
    ),
    unconfirmed_orchard_balance: value(
      "unconfirmed_orchard_balance"
    ),
    total_orchard_balance: value(
      "total_orchard_balance"
    ),

    confirmed_sapling_balance: value(
      "confirmed_sapling_balance"
    ),
    unconfirmed_sapling_balance: value(
      "unconfirmed_sapling_balance"
    ),
    total_sapling_balance: value(
      "total_sapling_balance"
    ),

    confirmed_transparent_balance: value(
      "confirmed_transparent_balance"
    ),
    unconfirmed_transparent_balance: value(
      "unconfirmed_transparent_balance"
    ),
    total_transparent_balance: value(
      "total_transparent_balance"
    ),
  };
}