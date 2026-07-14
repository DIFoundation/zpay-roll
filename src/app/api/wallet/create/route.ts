import { NextResponse } from "next/server";

import { walletService } from "@/services/zcash";

export async function POST(request: Request) {
  try {
    const { organizationId } = await request.json();

    const wallet =
      await walletService.createWallet(
        organizationId
      );

    return NextResponse.json(wallet);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to create wallet",
      },
      {
        status: 500,
      }
    );
  }
}