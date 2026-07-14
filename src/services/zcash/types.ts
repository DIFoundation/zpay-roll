export interface CLIResult {
  stdout: string;
  stderr: string;
}

export interface WalletAddress {
  account: number;
  address_index: number;
  has_orchard: boolean;
  has_sapling: boolean;
  has_transparent: boolean;
  encoded_address: string;
}

export interface WalletBalance {
  confirmed_orchard_balance: number;
  unconfirmed_orchard_balance: number;
  total_orchard_balance: number;

  confirmed_sapling_balance: number;
  unconfirmed_sapling_balance: number;
  total_sapling_balance: number;

  confirmed_transparent_balance: number;
  unconfirmed_transparent_balance: number;
  total_transparent_balance: number;
}