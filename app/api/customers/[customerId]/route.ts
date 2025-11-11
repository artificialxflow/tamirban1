import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { deleteCustomer, getCustomerDetail, updateCustomer } from "@/lib/services/customers.service";

function buildErrorResponse(error: unknown, status = 400) {
  const message = error instanceof Error ? error.message : "خطای غیرمنتظره رخ داد";
  return NextResponse.json({ success: false, message }, { status });
}

type RouteContext = { params: Promise<{ customerId: string }> };

export async function GET(_: Request, context: RouteContext) {
  const { customerId } = await context.params;
  const customer = await getCustomerDetail(customerId);
  if (!customer) {
    return NextResponse.json({ success: false, message: "مشتری یافت نشد." }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: customer });
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const payload = await request.json();
    const { customerId } = await context.params;
    const customer = await updateCustomer(customerId, payload);
    return NextResponse.json({ success: true, data: customer });
  } catch (error) {
    if (error instanceof ZodError) {
      return buildErrorResponse(error, 422);
    }
    if (error instanceof Error && error.message === "مشتری یافت نشد.") {
      return buildErrorResponse(error, 404);
    }
    return buildErrorResponse(error, 400);
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  try {
    const { customerId } = await context.params;
    await deleteCustomer(customerId);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "مشتری یافت نشد.") {
      return buildErrorResponse(error, 404);
    }
    return buildErrorResponse(error, 400);
  }
}


