import { spawn } from "child_process";

import { ZCASH } from "./constants";

interface ExecuteOptions {
  dataDir: string;
  command?: string;
  args?: string[];
  stdin?: string[];
}

export async function executeCLI({
  dataDir,
  command,
  args = [],
  stdin = []
}: ExecuteOptions) {
  return new Promise<{
    stdout: string;
    stderr: string;
  }>((resolve, reject) => {
    const cliArgs = [
      "--chain",
      ZCASH.chain,
      "--server",
      ZCASH.server,
      "--data-dir",
      dataDir,
    ];

    if (command) {
      cliArgs.push(command, ...args);
    }

    const child = spawn(
        ZCASH.cli,
        cliArgs
    );

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("error", reject);

    for (const line of stdin) {
        child.stdin.write(`${line}\n`);
    }

    child.stdin.end();

    child.on("close", (code) => {
      if (code !== 0) {
        reject(
          new Error(stderr || "CLI failed")
        );
        return;
      }

      resolve({
        stdout: cleanOutput(stdout),
        stderr,
      });
    });
  });
}


function cleanOutput(output: string) {
  return output
    .replace(/Launching sync task\.\.\.\n?/g, "")
    .replace(/Launching save task\.\.\.\n?/g, "")
    .replace(/Save task shutdown successfully\.\n?/g, "")
    .replace(/Zingo CLI quit successfully\.\n?/g, "")
    .trim();
}