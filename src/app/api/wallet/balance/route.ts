import { NextResponse } from "next/server";

import { walletService } from "@/services/zcash";

export async function GET(request: Request) {
  const { searchParams } = new URL(
    request.url
  );

  const organizationId =
    searchParams.get("organizationId");

  if (!organizationId) {
    return NextResponse.json(
      {
        message:
          "organizationId is required",
      },
      {
        status: 400,
      }
    );
  }

  const balance =
    await walletService.getBalance(
      organizationId
    );

  return NextResponse.json(balance);
}