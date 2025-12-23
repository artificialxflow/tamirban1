import { NextRequest, NextResponse } from "next/server";

import { changeTaskStatus } from "@/lib/services/tasks.service";
import { requirePermission } from "@/lib/middleware/rbac";
import { handleApiError, successResponse } from "@/lib/utils/errors";
import type { TaskStatus } from "@/lib/types";

const TASK_STATUSES: TaskStatus[] = ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const permissionResult = await requirePermission("tasks:write")(request);
  if (!permissionResult.success) {
    return permissionResult.response;
  }

  try {
    const { id } = await params;
    const payload = await request.json();
    const { status } = payload;

    if (!status || !TASK_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "وضعیت وارد شده معتبر نیست.",
          code: "VALIDATION_ERROR",
        },
        { status: 422 },
      );
    }

    // بررسی دسترسی: MARKETER فقط می‌تواند وضعیت تسک‌های خودش را تغییر دهد
    if (permissionResult.user.role === "MARKETER") {
      const { getTaskById } = await import("@/lib/services/tasks.service");
      const existing = await getTaskById(id);
      if (!existing || existing.assignedTo !== permissionResult.user.id) {
        return NextResponse.json(
          {
            success: false,
            message: "دسترسی به این تسک ندارید.",
            code: "FORBIDDEN",
          },
          { status: 403 },
        );
      }
    }

    const task = await changeTaskStatus(id, status as TaskStatus);
    return successResponse(task, "وضعیت تسک با موفقیت تغییر کرد.");
  } catch (error) {
    return handleApiError(error);
  }
}

