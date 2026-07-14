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

  // async quickSend(
  //   organizationId: string,
  //   address: string,
  //   amount: number
  // ) {
  //   return executeCLI({
  //     organizationId,
  //     command: "quicksend",
  //     args: [address, amount.toString()],
  //     parseJson: true,
  //   });
  // }

  async history(
    organizationId: string
  ) {
    return executeCLI({
      dataDir: this.walletDir(organizationId),
      command: "transactions"
    });
  }
  async quickSend(
     dataDir: string,
     address: string,
     amount: number
   ) {
     return executeCLI({
       dataDir,
       command: "quicksend",
       args: [address, amount.toString()],
     });
   }
  
   async transactions(dataDir: string) {
     return executeCLI({
       dataDir,
       command: "transactions",
     });
   }
  
   async valueTransfers(dataDir: string) {
     return executeCLI({
       dataDir,
       command: "value_transfers"
     });
   }
}


export const transactionService =
  new TransactionService();