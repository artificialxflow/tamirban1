import { NextRequest, NextResponse } from "next/server";

import { getInvoiceById } from "@/lib/services/invoices.service";
import { generateInvoicePDF } from "@/lib/utils/pdf-generator";
import { authenticateRequest } from "@/lib/middleware/auth";
import { handleApiError } from "@/lib/utils/errors";

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

    // تولید PDF
    const pdfBuffer = await generateInvoicePDF(
      invoice,
      invoice.customerName,
      invoice.marketerName,
    );

    // برگرداندن PDF به عنوان Response
    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${invoice.meta?.invoiceNumber || invoiceId}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

