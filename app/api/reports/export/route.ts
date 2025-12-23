import { NextRequest, NextResponse } from "next/server";

import { requirePermission } from "@/lib/middleware/rbac";
import { handleApiError } from "@/lib/utils/errors";
import {
  getMarketerPerformanceReport,
} from "@/lib/services/reports.service";
import {
  exportMarketerPerformanceToExcel,
  exportInvoicesToExcel,
  exportVisitsToExcel,
  exportCustomersToExcel,
} from "@/lib/utils/excel-export";
import { listInvoices } from "@/lib/services/invoices.service";
import { listVisits } from "@/lib/services/visits.service";
import { listCustomerSummaries } from "@/lib/services/customers.service";
import type { InvoiceStatus, VisitStatus } from "@/lib/types";

export async function GET(request: NextRequest) {
  const permissionResult = await requirePermission("reports:read")(request);
  if (!permissionResult.success) {
    return permissionResult.response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "marketers" | "invoices" | "visits" | "customers"
    const startDate = searchParams.get("startDate") ? new Date(searchParams.get("startDate")!) : undefined;
    const endDate = searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : undefined;
    const marketerId = searchParams.get("marketerId") || undefined;
    const customerId = searchParams.get("customerId") || undefined;
    const status = searchParams.get("status") || undefined;

    let excelBuffer: Buffer;
    let filename: string;

    switch (type) {
      case "marketers": {
        const reports = await getMarketerPerformanceReport({
          startDate,
          endDate,
          marketerId,
        });
        excelBuffer = exportMarketerPerformanceToExcel(reports);
        filename = `marketer-performance-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}.xlsx`;
        break;
      }

      case "invoices": {
        // دریافت لیست کامل فاکتورها برای export
        const invoicesResult = await listInvoices({
          marketerId,
          customerId,
          status: status as InvoiceStatus | undefined,
          startDate,
          endDate,
          limit: 10000,
        });
        
        excelBuffer = exportInvoicesToExcel(invoicesResult.data);
        filename = `invoices-export-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}.xlsx`;
        break;
      }

      case "visits": {
        // دریافت لیست کامل ویزیت‌ها برای export
        const visitsResult = await listVisits({
          marketerId,
          customerId,
          status: status as VisitStatus | undefined,
          startDate,
          endDate,
          limit: 10000,
        });
        
        excelBuffer = exportVisitsToExcel(visitsResult.data);
        filename = `visits-export-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}.xlsx`;
        break;
      }

      case "customers": {
        // دریافت لیست کامل مشتریان برای export
        const customersResult = await listCustomerSummaries({
          marketerId,
          status: status as any,
          limit: 10000,
        });
        
        excelBuffer = exportCustomersToExcel(customersResult.data);
        filename = `customers-export-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}.xlsx`;
        break;
      }

      default:
        return NextResponse.json(
          {
            success: false,
            message: "نوع گزارش معتبر نیست. انواع مجاز: marketers, invoices, visits, customers",
            code: "VALIDATION_ERROR",
          },
          { status: 422 },
        );
    }

    return new NextResponse(excelBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
        "Content-Length": excelBuffer.length.toString(),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

