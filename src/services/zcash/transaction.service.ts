import path from "path";

import { executeCLI } from "./execute-cli";
import { ZCASH } from "./constants";

class TransactionService {
  private walletDir(
    organizationId: string
  ) {
    return path.join(
      ZCASH.walletsDir,
      organizationId
    );
  }

  async quickSend(
    organizationId: string,
    address: string,
    amount: number
  ) {
    return executeCLI(
      this.walletDir(organizationId),
      "quicksend",
      address,
      amount.toString()
    );
  }

  async history(
    organizationId: string
  ) {
    return executeCLI(
      this.walletDir(organizationId),
      "transactions"
    );
  }
}

export const transactionService =
  new TransactionService();