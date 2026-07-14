import { spawn } from "child_process";

export function executeWalletCLI(
  args: string[]
): Promise<any> {
  return new Promise((resolve, reject) => {
    const process = spawn(
      "./rust/target/debug/zpay-wallet",
      args
    );

    let output = "";
    let error = "";

    process.stdout.on("data", (data) => {
      output += data.toString();
    });

    process.stderr.on("data", (data) => {
      error += data.toString();
    });

    process.on("close", (code) => {
      if (code !== 0) {
        reject(error);
        return;
      }

      resolve(JSON.parse(output));
    });
  });
}