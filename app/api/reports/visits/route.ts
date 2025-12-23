import { NextRequest } from "next/server";

import { getVisitReport } from "@/lib/services/reports.service";
import { requirePermission } from "@/lib/middleware/rbac";
import { handleApiError, successResponse } from "@/lib/utils/errors";

export async function GET(request: NextRequest) {
  const permissionResult = await requirePermission("reports:read")(request);
  if (!permissionResult.success) {
    return permissionResult.response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate") ? new Date(searchParams.get("startDate")!) : undefined;
    const endDate = searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : undefined;
    const marketerId = searchParams.get("marketerId") || undefined;
    const customerId = searchParams.get("customerId") || undefined;
    const status = searchParams.get("status") || undefined;

    const report = await getVisitReport({
      startDate,
      endDate,
      marketerId,
      customerId,
      status,
    });

    return successResponse(report, "گزارش ویزیت‌ها با موفقیت دریافت شد.");
  } catch (error) {
    return handleApiError(error);
  }
}

