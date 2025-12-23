import { NextRequest } from "next/server";

import { listCustomerInteractions, createInteraction } from "@/lib/services/interactions.service";
import { requirePermission } from "@/lib/middleware/rbac";
import { handleApiError, successResponse } from "@/lib/utils/errors";

type RouteParams = {
  params: Promise<{
    customerId: string;
  }>;
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  const permissionResult = await requirePermission("customers:read")(request);
  if (!permissionResult.success) {
    return permissionResult.response;
  }

  try {
    const { customerId } = await params;
    const interactions = await listCustomerInteractions(customerId);
    return successResponse(interactions);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const permissionResult = await requirePermission("customers:write")(request);
  if (!permissionResult.success) {
    return permissionResult.response;
  }

  try {
    const { customerId } = await params;
    const payload = await request.json();
    
    // اضافه کردن customerId از URL
    const interaction = await createInteraction({
      ...payload,
      customerId: customerId,
      marketerId: payload.marketerId || permissionResult.user.id,
    });
    
    return successResponse(interaction, "ارتباط با موفقیت ثبت شد.", 201);
  } catch (error) {
    return handleApiError(error);
  }
}

