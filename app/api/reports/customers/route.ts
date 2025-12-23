import { NextRequest } from "next/server";

import { getCustomerReport } from "@/lib/services/reports.service";
import { requirePermission } from "@/lib/middleware/rbac";
import { handleApiError, successResponse } from "@/lib/utils/errors";

export async function GET(request: NextRequest) {
  const permissionResult = await requirePermission("reports:read")(request);
  if (!permissionResult.success) {
    return permissionResult.response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const marketerId = searchParams.get("marketerId") || undefined;
    const status = searchParams.get("status") || undefined;

    const report = await getCustomerReport({
      marketerId,
      status,
    });

    return successResponse(report, "گزارش مشتریان با موفقیت دریافت شد.");
  } catch (error) {
    return handleApiError(error);
  }
}

