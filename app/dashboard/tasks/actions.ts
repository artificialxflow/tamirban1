"use server";

import { revalidatePath } from "next/cache";
import {
  createTask,
  updateTask,
  changeTaskStatus as changeTaskStatusService,
} from "@/lib/services/tasks.service";
import type { TaskStatus, TaskPriority } from "@/lib/types";
import { getCurrentUser } from "@/lib/utils/get-current-user";

export type CreateTaskFormState = {
  success: boolean;
  message: string | null;
};

export type UpdateTaskFormState = {
  success: boolean;
  message: string | null;
};

export async function createTaskAction(
  _prevState: CreateTaskFormState,
  formData: FormData,
): Promise<CreateTaskFormState> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        message: "لطفاً ابتدا وارد حساب کاربری خود شوید.",
      };
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const assignedTo = formData.get("assignedTo") as string;
    const dueAt = formData.get("dueAt") as string;
    const priority = formData.get("priority") as TaskPriority;
    const relatedCustomerId = formData.get("relatedCustomerId") as string;
    const relatedVisitId = formData.get("relatedVisitId") as string;
    const relatedInvoiceId = formData.get("relatedInvoiceId") as string;

    await createTask({
      title,
      description: description || undefined,
      assignedTo,
      assignedBy: user.id,
      createdBy: user.id,
      dueAt: dueAt || undefined,
      priority: priority || "MEDIUM",
      relatedCustomerId: relatedCustomerId || undefined,
      relatedVisitId: relatedVisitId || undefined,
      relatedInvoiceId: relatedInvoiceId || undefined,
    });

    revalidatePath("/dashboard/tasks");
    return {
      success: true,
      message: "تسک با موفقیت ایجاد شد.",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "خطا در ایجاد تسک",
    };
  }
}

export async function updateTaskAction(
  taskId: string,
  _prevState: UpdateTaskFormState,
  formData: FormData,
): Promise<UpdateTaskFormState> {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const assignedTo = formData.get("assignedTo") as string;
    const dueAt = formData.get("dueAt") as string;
    const priority = formData.get("priority") as TaskPriority;
    const relatedCustomerId = formData.get("relatedCustomerId") as string;
    const relatedVisitId = formData.get("relatedVisitId") as string;
    const relatedInvoiceId = formData.get("relatedInvoiceId") as string;

    await updateTask(taskId, {
      title,
      description: description || undefined,
      assignedTo,
      dueAt: dueAt || undefined,
      priority: priority || "MEDIUM",
      relatedCustomerId: relatedCustomerId || undefined,
      relatedVisitId: relatedVisitId || undefined,
      relatedInvoiceId: relatedInvoiceId || undefined,
    });

    revalidatePath("/dashboard/tasks");
    return {
      success: true,
      message: "تسک با موفقیت به‌روزرسانی شد.",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "خطا در به‌روزرسانی تسک",
    };
  }
}

export async function changeTaskStatusAction(taskId: string, status: TaskStatus) {
  try {
    await changeTaskStatusService(taskId, status);
    revalidatePath("/dashboard/tasks");
    return { success: true, message: "وضعیت تسک با موفقیت تغییر کرد" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "خطا در تغییر وضعیت تسک",
    };
  }
}

