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

  const addresses =
    await walletService.getAddresses(
      organizationId
    );

  return NextResponse.json(addresses);
}