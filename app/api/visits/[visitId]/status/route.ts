import { NextRequest } from "next/server";

import { changeVisitStatus } from "@/lib/services/visits.service";
import { authenticateRequest } from "@/lib/middleware/auth";
import { handleApiError, successResponse } from "@/lib/utils/errors";

type RouteContext = { params: Promise<{ visitId: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  const authResult = await authenticateRequest(request);
  if (!authResult.success) {
    return authResult.response;
  }

  try {
    const payload = await request.json();
    const { visitId } = await context.params;
    const visit = await changeVisitStatus(visitId, payload);
    return successResponse(visit, "وضعیت ویزیت با موفقیت تغییر کرد.");
  } catch (error) {
    return handleApiError(error);
  }
}

