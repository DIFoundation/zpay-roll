import { NextRequest, NextResponse } from "next/server";

import { zcashService } from "@/services/zcash/zcash.service";

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    const result =
      await zcashService.sendPayroll(body);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Payment failed.",
      },
      {
        status: 500,
      }
    );
  }
}