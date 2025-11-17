import { NextRequest, NextResponse } from "next/server";

import {
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
} from "@/lib/services/invoices.service";
import { authenticateRequest } from "@/lib/middleware/auth";
import { handleApiError, successResponse } from "@/lib/utils/errors";

type RouteParams = {
  params: Promise<{
    invoiceId: string;
  }>;
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  const authResult = await authenticateRequest(request);
  if (!authResult.success) {
    return authResult.response;
  }

  try {
    const { invoiceId } = await params;
    const invoice = await getInvoiceById(invoiceId);

    if (!invoice) {
      return NextResponse.json(
        {
          success: false,
          message: "پیش‌فاکتور یافت نشد.",
          code: "NOT_FOUND",
        },
        { status: 404 },
      );
    }

    return successResponse(invoice);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const authResult = await authenticateRequest(request);
  if (!authResult.success) {
    return authResult.response;
  }

  try {
    const { invoiceId } = await params;
    const payload = await request.json();
    const invoice = await updateInvoice(invoiceId, payload);
    return successResponse(invoice, "پیش‌فاکتور با موفقیت به‌روزرسانی شد.");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const authResult = await authenticateRequest(request);
  if (!authResult.success) {
    return authResult.response;
  }

  try {
    const { invoiceId } = await params;
    const deleted = await deleteInvoice(invoiceId);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          message: "پیش‌فاکتور یافت نشد.",
          code: "NOT_FOUND",
        },
        { status: 404 },
      );
    }

    return successResponse(null, "پیش‌فاکتور با موفقیت حذف شد.");
  } catch (error) {
    return handleApiError(error);
  }
}

