import { NextRequest, NextResponse } from "next/server";

import { changeInvoiceStatus } from "@/lib/services/invoices.service";
import { requirePermission } from "@/lib/middleware/rbac";
import { handleApiError, successResponse } from "@/lib/utils/errors";
import type { InvoiceStatus } from "@/lib/types";

const INVOICE_STATUSES: InvoiceStatus[] = ["DRAFT", "SENT", "PAID", "OVERDUE", "CANCELLED"];

type RouteParams = {
  params: Promise<{
    invoiceId: string;
  }>;
};

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const permissionResult = await requirePermission("invoices:write")(request);
  if (!permissionResult.success) {
    return permissionResult.response;
  }

  try {
    const { invoiceId } = await params;
    const payload = await request.json();
    const { status, paidAt, paymentReference, paymentInfo } = payload;

    if (!status || !INVOICE_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "وضعیت وارد شده معتبر نیست.",
          code: "VALIDATION_ERROR",
        },
        { status: 422 },
      );
    }

    // پردازش paymentInfo
    let processedPaymentInfo: {
      method: "CASH" | "CHECK" | "TRANSFER";
      checkAmount?: number;
      checkDate?: Date;
      checkOwner?: string;
      checkNumber?: string;
      status?: "PENDING" | "SETTLED" | "BOUNCED";
      transferReference?: string;
      cashAmount?: number;
    } | undefined;

    if (paymentInfo && status === "PAID") {
      processedPaymentInfo = {
        method: paymentInfo.method,
        status: paymentInfo.status || "PENDING",
      };
      
      if (paymentInfo.method === "CHECK") {
        if (paymentInfo.checkAmount) processedPaymentInfo.checkAmount = paymentInfo.checkAmount;
        if (paymentInfo.checkDate) processedPaymentInfo.checkDate = new Date(paymentInfo.checkDate);
        if (paymentInfo.checkOwner) processedPaymentInfo.checkOwner = paymentInfo.checkOwner;
        if (paymentInfo.checkNumber) processedPaymentInfo.checkNumber = paymentInfo.checkNumber;
      } else if (paymentInfo.method === "TRANSFER") {
        if (paymentInfo.transferReference) processedPaymentInfo.transferReference = paymentInfo.transferReference;
      } else if (paymentInfo.method === "CASH") {
        if (paymentInfo.cashAmount) processedPaymentInfo.cashAmount = paymentInfo.cashAmount;
      }
    }

    const invoice = await changeInvoiceStatus(
      invoiceId,
      status as InvoiceStatus,
      paidAt ? new Date(paidAt) : undefined,
      paymentReference,
      processedPaymentInfo,
    );
    return successResponse(invoice, "وضعیت پیش‌فاکتور با موفقیت تغییر کرد.");
  } catch (error) {
    return handleApiError(error);
  }
}

