import { NextRequest } from "next/server";

import {
  listTasks,
  createTask,
  type TaskListFilters,
} from "@/lib/services/tasks.service";
import { requirePermission } from "@/lib/middleware/rbac";
import { handleApiError, successResponse } from "@/lib/utils/errors";
import type { TaskStatus, TaskPriority } from "@/lib/types";

export async function GET(request: NextRequest) {
  const permissionResult = await requirePermission("tasks:read")(request);
  if (!permissionResult.success) {
    return permissionResult.response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const filters: TaskListFilters = {
      assignedTo: searchParams.get("assignedTo") || undefined,
      assignedBy: searchParams.get("assignedBy") || undefined,
      status: searchParams.get("status") as TaskStatus | undefined,
      priority: searchParams.get("priority") as TaskPriority | undefined,
      overdue: searchParams.get("overdue") === "true",
      relatedCustomerId: searchParams.get("relatedCustomerId") || undefined,
      relatedVisitId: searchParams.get("relatedVisitId") || undefined,
      relatedInvoiceId: searchParams.get("relatedInvoiceId") || undefined,
      page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : undefined,
      limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined,
    };

    // اگر کاربر MARKETER است، فقط تسک‌های خودش را ببیند
    if (permissionResult.user.role === "MARKETER") {
      filters.assignedTo = permissionResult.user.id;
    }

    const tasks = await listTasks(filters);
    return successResponse(tasks, "لیست تسک‌ها با موفقیت دریافت شد.");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  const permissionResult = await requirePermission("tasks:write")(request);
  if (!permissionResult.success) {
    return permissionResult.response;
  }

  try {
    const payload = await request.json();
    // assignedBy را از کاربر فعلی تنظیم می‌کنیم
    const task = await createTask({
      ...payload,
      assignedBy: permissionResult.user.id,
    });
    return successResponse(task, "تسک با موفقیت ایجاد شد.", 201);
  } catch (error) {
    return handleApiError(error);
  }
}

