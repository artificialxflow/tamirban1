import { NextRequest } from "next/server";

import { listMarketers, createMarketer } from "@/lib/services/marketers.service";
import { authenticateRequest } from "@/lib/middleware/auth";
import { handleApiError, successResponse } from "@/lib/utils/errors";

export async function GET(request: NextRequest) {
  const authResult = await authenticateRequest(request);
  if (!authResult.success) {
    return authResult.response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get("region") ?? undefined;
    const isActiveParam = searchParams.get("isActive");
    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : undefined;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : undefined;

    let isActive: boolean | undefined;
    if (isActiveParam === "true") {
      isActive = true;
    } else if (isActiveParam === "false") {
      isActive = false;
    }

    const result = await listMarketers({
      region,
      isActive,
      page,
      limit,
    });

    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  const authResult = await authenticateRequest(request);
  if (!authResult.success) {
    return authResult.response;
  }

  try {
    const payload = await request.json();
    const marketer = await createMarketer(payload);
    return successResponse(marketer, "بازاریاب با موفقیت ثبت شد.", 201);
  } catch (error) {
    return handleApiError(error);
  }
}

