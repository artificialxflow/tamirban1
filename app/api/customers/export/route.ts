import { NextRequest, NextResponse } from "next/server";

import { listCustomerSummaries } from "@/lib/services/customers.service";
import { requirePermission } from "@/lib/middleware/rbac";
import { handleApiError } from "@/lib/utils/errors";
import { exportCustomersToExcel } from "@/lib/utils/excel-export";
import type { CustomerStatus } from "@/lib/types";
import { CUSTOMER_STATUSES } from "@/lib/types";

export async function GET(request: NextRequest) {
  const permissionResult = await requirePermission("customers:read")(request);
  if (!permissionResult.success) {
    return permissionResult.response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status");
    const marketerId = searchParams.get("marketerId") || undefined;
    const search = searchParams.get("search") || undefined;
    const city = searchParams.get("city") || undefined;
    const tagsParam = searchParams.get("tags");
    const tags = tagsParam ? tagsParam.split(",").filter(Boolean) : undefined;

    // Location-based search parameters
    const latParam = searchParams.get("lat");
    const lngParam = searchParams.get("lng");
    const maxDistanceParam = searchParams.get("maxDistance");

    let status: CustomerStatus | undefined;
    if (statusParam) {
      if (!CUSTOMER_STATUSES.includes(statusParam as CustomerStatus)) {
        return NextResponse.json(
          {
            success: false,
            message: "وضعیت وارد شده معتبر نیست.",
            code: "VALIDATION_ERROR",
          },
          { status: 422 },
        );
      }
      status = statusParam as CustomerStatus;
    }

    let nearbyLocation: { latitude: number; longitude: number; maxDistance?: number } | undefined;
    if (latParam && lngParam) {
      const latitude = parseFloat(latParam);
      const longitude = parseFloat(lngParam);
      if (!isNaN(latitude) && !isNaN(longitude)) {
        nearbyLocation = { latitude, longitude };
        if (maxDistanceParam) {
          const maxDistance = parseFloat(maxDistanceParam);
          if (!isNaN(maxDistance)) {
            nearbyLocation.maxDistance = maxDistance;
          }
        }
      }
    }

    // دریافت همه مشتریان (بدون pagination برای export)
    const result = await listCustomerSummaries({
      status,
      marketerId,
      search,
      city,
      tags,
      nearbyLocation,
      limit: 10000, // حداکثر 10000 رکورد
    });

    // Export به Excel
    const excelBuffer = exportCustomersToExcel(result.data);

    // نام فایل با timestamp
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const filename = `customers-export-${timestamp}.xlsx`;

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

