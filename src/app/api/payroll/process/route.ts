import { NextResponse } from "next/server";

import { payrollProcessor } from "@/services/payroll/payroll.processor";

export async function POST(
  request: Request
) {
  try {
    const { batchId } =
      await request.json();

    const result =
      await payrollProcessor.process(
        batchId
      );

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Payroll failed",
      },
      {
        status: 500,
      }
    );
  }
}