import { NextRequest, NextResponse } from "next/server";

import { getStoryById, updateStory, deleteStory } from "@/lib/services/stories.service";
import { requirePermission } from "@/lib/middleware/rbac";
import { handleApiError, successResponse } from "@/lib/utils/errors";
import { getCurrentUser } from "@/lib/utils/get-current-user";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * GET /api/stories/[id]
 * 
 * دریافت جزئیات یک استوری (نیاز به دسترسی stories:read)
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const permissionResult = await requirePermission("stories:read")(request);
  if (!permissionResult.success) {
    return permissionResult.response;
  }

  try {
    const { id } = await params;
    const story = await getStoryById(id);

    if (!story) {
      return NextResponse.json(
        {
          success: false,
          message: "استوری یافت نشد.",
          code: "NOT_FOUND",
        },
        { status: 404 },
      );
    }

    return successResponse(story);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/stories/[id]
 * 
 * به‌روزرسانی استوری (نیاز به دسترسی stories:write)
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const permissionResult = await requirePermission("stories:write")(request);
  if (!permissionResult.success) {
    return permissionResult.response;
  }

  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "کاربر یافت نشد.",
          code: "UNAUTHORIZED",
        },
        { status: 401 },
      );
    }

    const { id } = await params;
    const payload = await request.json();
    const story = await updateStory(id, payload, user.id);

    return successResponse(story, "استوری با موفقیت به‌روزرسانی شد.");
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/stories/[id]
 * 
 * حذف استوری (نیاز به دسترسی stories:delete)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const permissionResult = await requirePermission("stories:delete")(request);
  if (!permissionResult.success) {
    return permissionResult.response;
  }

  try {
    const { id } = await params;
    await deleteStory(id);

    return successResponse(null, "استوری با موفقیت حذف شد.");
  } catch (error) {
    return handleApiError(error);
  }
}

