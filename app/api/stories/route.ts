import { NextRequest, NextResponse } from "next/server";

import { listStories, createStory } from "@/lib/services/stories.service";
import { requirePermission } from "@/lib/middleware/rbac";
import { handleApiError, successResponse } from "@/lib/utils/errors";
import { getCurrentUser } from "@/lib/utils/get-current-user";

/**
 * GET /api/stories
 * 
 * دریافت لیست استوری‌ها (نیاز به دسترسی stories:read)
 */
export async function GET(request: NextRequest) {
  const permissionResult = await requirePermission("stories:read")(request);
  if (!permissionResult.success) {
    return permissionResult.response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get("isActive") === "true" ? true : searchParams.get("isActive") === "false" ? false : undefined;
    const createdBy = searchParams.get("createdBy") || undefined;
    const expired = searchParams.get("expired") === "true" ? true : searchParams.get("expired") === "false" ? false : undefined;
    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : undefined;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : undefined;

    const stories = await listStories({
      isActive,
      createdBy,
      expired,
      page,
      limit,
    });

    return successResponse({
      data: stories,
      total: stories.length,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/stories
 * 
 * ایجاد استوری جدید (نیاز به دسترسی stories:write)
 */
export async function POST(request: NextRequest) {
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

    const payload = await request.json();
    const story = await createStory({
      ...payload,
      createdBy: user.id,
    });

    return successResponse(story, "استوری با موفقیت ایجاد شد.", 201);
  } catch (error) {
    return handleApiError(error);
  }
}

