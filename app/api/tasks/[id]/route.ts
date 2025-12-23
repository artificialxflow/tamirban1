import { NextRequest, NextResponse } from "next/server";

import { getTaskById, updateTask, deleteTask } from "@/lib/services/tasks.service";
import { requirePermission } from "@/lib/middleware/rbac";
import { handleApiError, successResponse } from "@/lib/utils/errors";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  const permissionResult = await requirePermission("tasks:read")(request);
  if (!permissionResult.success) {
    return permissionResult.response;
  }

  try {
    const { id } = await params;
    const task = await getTaskById(id);

    if (!task) {
      return NextResponse.json(
        {
          success: false,
          message: "تسک یافت نشد.",
          code: "NOT_FOUND",
        },
        { status: 404 },
      );
    }

    // اگر کاربر MARKETER است، فقط تسک‌های خودش را ببیند
    if (permissionResult.user.role === "MARKETER" && task.assignedTo !== permissionResult.user.id) {
      return NextResponse.json(
        {
          success: false,
          message: "دسترسی به این تسک ندارید.",
          code: "FORBIDDEN",
        },
        { status: 403 },
      );
    }

    return successResponse(task, "تسک با موفقیت دریافت شد.");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const permissionResult = await requirePermission("tasks:write")(request);
  if (!permissionResult.success) {
    return permissionResult.response;
  }

  try {
    const { id } = await params;
    const payload = await request.json();
    
    // بررسی دسترسی: MARKETER فقط می‌تواند تسک‌های خودش را ویرایش کند
    if (permissionResult.user.role === "MARKETER") {
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

    const task = await updateTask(id, payload);
    return successResponse(task, "تسک با موفقیت به‌روزرسانی شد.");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const permissionResult = await requirePermission("tasks:write")(request);
  if (!permissionResult.success) {
    return permissionResult.response;
  }

  try {
    const { id } = await params;
    
    // بررسی دسترسی: MARKETER فقط می‌تواند تسک‌های خودش را حذف کند
    if (permissionResult.user.role === "MARKETER") {
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

    await deleteTask(id);
    return successResponse(null, "تسک با موفقیت حذف شد.");
  } catch (error) {
    return handleApiError(error);
  }
}

