import { NextResponse } from "next/server";

import { walletService } from "@/services/zcash";

export async function POST(request: Request) {
  const { organizationId } =
    await request.json();

  await walletService.sync(
    organizationId
  );

  const balance =
    await walletService.getBalance(
      organizationId
    );

  return NextResponse.json(balance);
}