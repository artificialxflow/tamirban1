import { z } from "zod";

import { tasksRepository } from "@/lib/repositories";
import type { Task, TaskPriority, TaskStatus } from "@/lib/types";

export type TaskSummary = {
  id: string;
  title: string;
  description?: string;
  assignedTo: string;
  assignedToName?: string;
  assignedBy: string;
  assignedByName?: string;
  status: TaskStatus;
  dueAt?: Date;
  priority: TaskPriority;
  completedAt?: Date;
  relatedCustomerId?: string;
  relatedVisitId?: string;
  relatedInvoiceId?: string;
};

export type TaskDetail = TaskSummary & {
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
};

export type TaskListFilters = {
  assignedTo?: string;
  assignedBy?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  overdue?: boolean;
  relatedCustomerId?: string;
  relatedVisitId?: string;
  relatedInvoiceId?: string;
  page?: number;
  limit?: number;
};

const createTaskSchema = z.object({
  title: z.string().min(1, "عنوان تسک الزامی است"),
  description: z.string().optional(),
  assignedTo: z.string().min(1, "اختصاص به کاربر الزامی است"),
  assignedBy: z.string().min(1, "اختصاص‌دهنده الزامی است"),
  createdBy: z.string().min(1, "ایجادکننده الزامی است"),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).default("PENDING"),
  dueAt: z.coerce.date().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  relatedCustomerId: z.string().optional(),
  relatedVisitId: z.string().optional(),
  relatedInvoiceId: z.string().optional(),
});

const updateTaskSchema = z
  .object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    assignedTo: z.string().min(1).optional(),
    status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
    dueAt: z.coerce.date().optional().nullable(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
    relatedCustomerId: z.string().optional().nullable(),
    relatedVisitId: z.string().optional().nullable(),
    relatedInvoiceId: z.string().optional().nullable(),
  })
  .strict();

/**
 * لیست تسک‌ها با فیلتر
 */
export async function listTasks(filters: TaskListFilters = {}): Promise<TaskSummary[]> {
  const query: Record<string, unknown> = {};

  if (filters.assignedTo) {
    query.assignedTo = filters.assignedTo;
  }

  if (filters.assignedBy) {
    query.assignedBy = filters.assignedBy;
  }

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.priority) {
    query.priority = filters.priority;
  }

  if (filters.relatedCustomerId) {
    query.relatedCustomerId = filters.relatedCustomerId;
  }

  if (filters.relatedVisitId) {
    query.relatedVisitId = filters.relatedVisitId;
  }

  if (filters.relatedInvoiceId) {
    query.relatedInvoiceId = filters.relatedInvoiceId;
  }

  if (filters.overdue) {
    const now = new Date();
    query.status = { $in: ["PENDING", "IN_PROGRESS"] };
    query.dueAt = { $lt: now };
  }

  const tasks = await tasksRepository.findMany(query);
  
  // TODO: Populate assignedTo and assignedBy names from users collection
  return tasks.map((task) => ({
    id: task._id,
    title: task.title,
    description: task.description,
    assignedTo: task.assignedTo,
    assignedBy: task.assignedBy,
    status: task.status,
    dueAt: task.dueAt,
    priority: task.priority,
    completedAt: task.completedAt,
    relatedCustomerId: task.relatedCustomerId,
    relatedVisitId: task.relatedVisitId,
    relatedInvoiceId: task.relatedInvoiceId,
  }));
}

/**
 * دریافت تسک بر اساس ID
 */
export async function getTaskById(taskId: string): Promise<TaskDetail | null> {
  const task = await tasksRepository.findById(taskId);
  if (!task) {
    return null;
  }

  // TODO: Populate assignedTo and assignedBy names
  return {
    id: task._id,
    title: task.title,
    description: task.description,
    assignedTo: task.assignedTo,
    assignedBy: task.assignedBy,
    status: task.status,
    dueAt: task.dueAt,
    priority: task.priority,
    completedAt: task.completedAt,
    relatedCustomerId: task.relatedCustomerId,
    relatedVisitId: task.relatedVisitId,
    relatedInvoiceId: task.relatedInvoiceId,
    createdAt: task.createdAt,
    createdBy: task.createdBy,
    updatedAt: task.updatedAt || task.createdAt,
  };
}

/**
 * ایجاد تسک جدید
 */
export async function createTask(payload: unknown): Promise<Task> {
  const validated = createTaskSchema.parse(payload);

  const task: Omit<Task, "_id"> = {
    title: validated.title,
    description: validated.description,
    assignedTo: validated.assignedTo,
    assignedBy: validated.assignedBy,
    status: validated.status,
    dueAt: validated.dueAt || undefined,
    priority: validated.priority,
    relatedCustomerId: validated.relatedCustomerId,
    relatedVisitId: validated.relatedVisitId,
    relatedInvoiceId: validated.relatedInvoiceId,
    createdAt: new Date(),
    createdBy: validated.createdBy,
    updatedAt: new Date(),
  };

  const created = await tasksRepository.insertOne(task as never);
  return created as Task;
}

/**
 * به‌روزرسانی تسک
 */
export async function updateTask(taskId: string, payload: unknown): Promise<Task> {
  const validated = updateTaskSchema.parse(payload);

  const existing = await tasksRepository.findById(taskId);
  if (!existing) {
    throw new Error("تسک یافت نشد.");
  }

  const updateData: Partial<Task> = {
    updatedAt: new Date(),
  };

  if (validated.title !== undefined) {
    updateData.title = validated.title;
  }

  if (validated.description !== undefined) {
    updateData.description = validated.description;
  }

  if (validated.assignedTo !== undefined) {
    updateData.assignedTo = validated.assignedTo;
  }

  if (validated.status !== undefined) {
    updateData.status = validated.status;
    if (validated.status === "COMPLETED" && !existing.completedAt) {
      updateData.completedAt = new Date();
    } else if (validated.status !== "COMPLETED") {
      updateData.completedAt = undefined;
    }
  }

  if (validated.dueAt !== undefined) {
    updateData.dueAt = validated.dueAt || undefined;
  }

  if (validated.priority !== undefined) {
    updateData.priority = validated.priority;
  }

  if (validated.relatedCustomerId !== undefined) {
    updateData.relatedCustomerId = validated.relatedCustomerId || undefined;
  }

  if (validated.relatedVisitId !== undefined) {
    updateData.relatedVisitId = validated.relatedVisitId || undefined;
  }

  if (validated.relatedInvoiceId !== undefined) {
    updateData.relatedInvoiceId = validated.relatedInvoiceId || undefined;
  }

  const updated = await tasksRepository.updateById(taskId, updateData);
  if (!updated) {
    throw new Error("خطا در به‌روزرسانی تسک.");
  }

  const result = await tasksRepository.findById(taskId);
  if (!result) {
    throw new Error("تسک یافت نشد.");
  }

  return result as Task;
}

/**
 * تغییر وضعیت تسک
 */
export async function changeTaskStatus(taskId: string, status: TaskStatus): Promise<Task> {
  const existing = await tasksRepository.findById(taskId);
  if (!existing) {
    throw new Error("تسک یافت نشد.");
  }

  const updateData: Partial<Task> = {
    status,
    updatedAt: new Date(),
  };

  if (status === "COMPLETED" && !existing.completedAt) {
    updateData.completedAt = new Date();
  } else if (status !== "COMPLETED") {
    updateData.completedAt = undefined;
  }

  const updated = await tasksRepository.updateById(taskId, updateData);
  if (!updated) {
    throw new Error("خطا در تغییر وضعیت تسک.");
  }

  const result = await tasksRepository.findById(taskId);
  if (!result) {
    throw new Error("تسک یافت نشد.");
  }

  return result as Task;
}

/**
 * حذف تسک
 */
export async function deleteTask(taskId: string): Promise<boolean> {
  const deleted = await tasksRepository.deleteById(taskId);
  return deleted;
}

