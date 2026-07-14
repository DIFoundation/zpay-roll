import fs from "fs/promises";
import path from "path";

import { executeCLI } from "./execute-cli";
import { parseAddresses, parseBalance } from "./parser";
import { ZCASH } from "./constants";

class WalletService {
  private walletDir(organizationId: string) {
    return path.join(ZCASH.walletsDir, organizationId);
  }

  async createWallet(organizationId: string) {
    const walletDir = this.walletDir(organizationId);

    await fs.mkdir(walletDir, {
      recursive: true,
    });

    await executeCLI({
      dataDir: walletDir,
      stdin: ["create"],
    });

    const addresses = await this.getAddresses(organizationId);

    return addresses[0];
  }

  async getAddresses(organizationId: string) {
    const result = await executeCLI({
      dataDir: this.walletDir(organizationId),
      stdin: ["addresses"],
    });

    return parseAddresses(result.stdout);
  }

  async getBalance(organizationId: string) {
    const result = await executeCLI({
      dataDir: this.walletDir(organizationId),
      stdin: ["balance"],
    });

    return parseBalance(result.stdout);
  }

  async recoveryInfo(organizationId: string) {
    const result = await executeCLI({
      dataDir: this.walletDir(organizationId),
      stdin: ["recovery_info"],
    });

    return result.stdout;
  }

  async deleteWallet(organizationId: string) {
    return executeCLI({
      dataDir: this.walletDir(organizationId),
      stdin: ["delete"],
    });
  }

  async sync(organizationId: string) {
    return executeCLI({
      dataDir: this.walletDir(organizationId),
      command: "sync",
      args: ["run"],
    });
  }
}

export const walletService = new WalletService();
