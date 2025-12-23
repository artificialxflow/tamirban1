import { NextRequest, NextResponse } from "next/server";

import { getMarketerPerformanceById } from "@/lib/services/reports.service";
import { requirePermission } from "@/lib/middleware/rbac";
import { handleApiError, successResponse } from "@/lib/utils/errors";

type RouteParams = {
  params: Promise<{
    memberId: string;
  }>;
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  const permissionResult = await requirePermission("reports:read")(request);
  if (!permissionResult.success) {
    return permissionResult.response;
  }

  try {
    const { memberId } = await params;
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate") ? new Date(searchParams.get("startDate")!) : undefined;
    const endDate = searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : undefined;

    const report = await getMarketerPerformanceById(memberId, {
      startDate,
      endDate,
    });

    if (!report) {
      return NextResponse.json(
        {
          success: false,
          message: "گزارش یافت نشد.",
          code: "NOT_FOUND",
        },
        { status: 404 },
      );
    }

    return successResponse(report, "گزارش عملکرد بازاریاب با موفقیت دریافت شد.");
  } catch (error) {
    return handleApiError(error);
  }
}

