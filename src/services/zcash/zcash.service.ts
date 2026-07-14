export interface BroadcastResult {
  success: boolean;
  txHash: string;
  fee: number;
}

export const zcashService = {
  async getBalance(address: string) {
    // TODO:
    // Replace with Zcash RPC

    return {
      balance: 25.43891234,
      address,
    };
  },

  async estimateFee(
    recipients: number
  ) {
    return recipients * 0.0001;
  },

  async sendTransaction({
    from,
    to,
    amount,
  }: {
    from: string;
    to: string;
    amount: number;
  }): Promise<BroadcastResult> {
    // TODO:
    // Replace with Zcash RPC

    await new Promise((resolve) =>
      setTimeout(resolve, 1000)
    );

    return {
      success: true,
      txHash: crypto.randomUUID(),
      fee: 0.0001,
    };
  },

  async sendPayroll({
    wallet,
    payrollItems,
  }: {
    wallet: string;
    payrollItems: {
      employeeId: string;
      wallet: string;
      amount: number;
    }[];
  }) {
    const transactions = [];

    for (const item of payrollItems) {
      const tx =
        await this.sendTransaction({
          from: wallet,
          to: item.wallet,
          amount: item.amount,
        });

      transactions.push({
        employeeId: item.employeeId,
        amount: item.amount,
        txHash: tx.txHash,
        fee: tx.fee,
      });
    }

    return transactions;
  },
};