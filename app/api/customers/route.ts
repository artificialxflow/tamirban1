import { NextResponse } from "next/server";

import { ZodError } from "zod";

import { listCustomerSummaries, createCustomer } from "@/lib/services/customers.service";
import type { CustomerStatus } from "@/lib/types";
import { CUSTOMER_STATUSES } from "@/lib/types";

function buildErrorResponse(error: unknown, status = 400) {
  const message = error instanceof Error ? error.message : "خطای غیرمنتظره رخ داد";
  return NextResponse.json({ success: false, message }, { status });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status");
    const marketerId = searchParams.get("marketerId") ?? undefined;
    const search = searchParams.get("search") ?? undefined;

    let status: CustomerStatus | undefined;
    if (statusParam) {
      if (!CUSTOMER_STATUSES.includes(statusParam as CustomerStatus)) {
        return NextResponse.json(
          { success: false, message: "وضعیت وارد شده معتبر نیست." },
          { status: 422 },
        );
      }
      status = statusParam as CustomerStatus;
    }

    const customers = await listCustomerSummaries({ status, marketerId, search });
    return NextResponse.json({ success: true, data: customers });
  } catch (error) {
    return buildErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const customer = await createCustomer(payload);
    return NextResponse.json({ success: true, data: customer }, { status: 201 });
  } catch (error) {
    const status = error instanceof ZodError ? 422 : 400;
    return buildErrorResponse(error, status);
  }
}