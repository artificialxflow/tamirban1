import { NextRequest, NextResponse } from "next/server";

import { listCustomerSummaries, createCustomer } from "@/lib/services/customers.service";
import { requirePermission } from "@/lib/middleware/rbac";
import { withRateLimit } from "@/lib/middleware/rate-limit";
import { handleApiError, successResponse } from "@/lib/utils/errors";
import type { CustomerStatus } from "@/lib/types";
import { CUSTOMER_STATUSES } from "@/lib/types";

export async function GET(request: NextRequest) {
  const permissionResult = await requirePermission("customers:read")(request);
  if (!permissionResult.success) {
    return permissionResult.response;
  }

  // Rate limiting برای بازاریاب‌ها: محدودتر
  const rateLimitOptions = permissionResult.user.role === "MARKETER" 
    ? { maxRequests: 100, windowMs: 60 * 60 * 1000 } // 100 درخواست در ساعت
    : { maxRequests: 1000, windowMs: 60 * 60 * 1000 }; // 1000 درخواست در ساعت برای سایر نقش‌ها
  
  const rateLimitMiddleware = withRateLimit({
    ...rateLimitOptions,
    keyGenerator: () => `customers:${permissionResult.user.id}`,
  });
  
  const rateLimitResult = await rateLimitMiddleware(request);
  
  if (!rateLimitResult.success) {
    return rateLimitResult.response;
  }

  // Logging دسترسی
  console.log(`[CUSTOMERS_API] User ${permissionResult.user.id} (${permissionResult.user.role}) accessed customers list at ${new Date().toISOString()}`);

  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status");
    let marketerId = searchParams.get("marketerId") ?? undefined;
    
    // محدودیت برای بازاریاب‌ها: فقط مشتری‌های اختصاص یافته به خودشان
    if (permissionResult.user.role === "MARKETER") {
      marketerId = permissionResult.user.id;
    }
    const search = searchParams.get("search") ?? undefined;
    const city = searchParams.get("city") ?? undefined;
    const tagsParam = searchParams.get("tags");
    const tags = tagsParam ? tagsParam.split(",").filter(Boolean) : undefined;
    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : undefined;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : undefined;

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

    // ساخت nearbyLocation اگر lat و lng موجود باشند
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

    const result = await listCustomerSummaries({ 
      status, 
      marketerId, 
      search, 
      city,
      tags,
      nearbyLocation,
      page, 
      limit 
    });
    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  const permissionResult = await requirePermission("customers:write")(request);
  if (!permissionResult.success) {
    return permissionResult.response;
  }

  try {
    const payload = await request.json();
    const customer = await createCustomer(payload);
    return successResponse(customer, "مشتری با موفقیت ثبت شد.", 201);
  } catch (error) {
    return handleApiError(error);
  }
}

