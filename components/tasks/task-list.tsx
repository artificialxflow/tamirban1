"use client";

import { useState } from "react";
import type { TaskSummary } from "@/lib/services/tasks.service";
import type { TaskStatus, TaskPriority } from "@/lib/types";
import { TaskStatusChangeButton } from "./task-status-change-button";
import { ProtectedComponent } from "@/components/common/protected-component";

const STATUS_LABELS: Record<TaskStatus, string> = {
  PENDING: "در انتظار",
  IN_PROGRESS: "در حال انجام",
  COMPLETED: "تکمیل شد",
  CANCELLED: "لغو شد",
};

const STATUS_BADGE_CLASS: Record<TaskStatus, string> = {
  PENDING: "bg-slate-100 text-slate-700 border border-slate-200",
  IN_PROGRESS: "bg-amber-100 text-amber-700 border border-amber-200",
  COMPLETED: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  CANCELLED: "bg-rose-100 text-rose-700 border border-rose-200",
};

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  LOW: "پایین",
  MEDIUM: "متوسط",
  HIGH: "بالا",
};

const PRIORITY_BADGE_CLASS: Record<TaskPriority, string> = {
  LOW: "bg-blue-100 text-blue-700 border border-blue-200",
  MEDIUM: "bg-amber-100 text-amber-700 border border-amber-200",
  HIGH: "bg-rose-100 text-rose-700 border border-rose-200",
};

const dateFormatter = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function formatDate(value?: Date | null) {
  if (!value) return "نامشخص";
  return dateFormatter.format(value);
}

interface TaskListProps {
  tasks: TaskSummary[];
  onEdit?: (task: TaskSummary) => void;
  onRefresh?: () => void;
}

export function TaskList({ tasks, onEdit, onRefresh }: TaskListProps) {
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const handleDelete = async (taskId: string) => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید این تسک را حذف کنید؟")) {
      return;
    }

    setDeletingTaskId(taskId);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("لطفاً ابتدا وارد شوید.");
        return;
      }

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "خطا در حذف تسک");
      }

      onRefresh?.();
    } catch (error) {
      alert(error instanceof Error ? error.message : "خطا در حذف تسک");
    } finally {
      setDeletingTaskId(null);
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-12 text-center text-sm text-slate-600">
        <p>تسکی یافت نشد.</p>
        <p className="mt-2">برای شروع، یک تسک جدید ایجاد کنید.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">عنوان</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">اختصاص به</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">وضعیت</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">اولویت</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">تاریخ سررسید</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">عملیات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tasks.map((task) => {
            const isOverdue = task.dueAt && new Date(task.dueAt) < new Date() && task.status !== "COMPLETED" && task.status !== "CANCELLED";
            
            return (
              <tr key={task.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900">{task.title}</span>
                    {task.description && (
                      <span className="mt-1 text-xs text-slate-500 line-clamp-1">{task.description}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-700">
                  {task.assignedToName || task.assignedTo}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGE_CLASS[task.status]}`}>
                    {STATUS_LABELS[task.status]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${PRIORITY_BADGE_CLASS[task.priority]}`}>
                    {PRIORITY_LABELS[task.priority]}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-700">
                  <span className={isOverdue ? "text-rose-600 font-semibold" : ""}>
                    {formatDate(task.dueAt)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <ProtectedComponent permission="tasks:write">
                      <TaskStatusChangeButton
                        task={task}
                        onSuccess={onRefresh}
                      />
                      <button
                        onClick={() => onEdit?.(task)}
                        className="rounded-full border border-primary-300 bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700 transition hover:bg-primary-100"
                      >
                        ویرایش
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        disabled={deletingTaskId === task.id}
                        className="rounded-full border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
                      >
                        {deletingTaskId === task.id ? "در حال حذف..." : "حذف"}
                      </button>
                    </ProtectedComponent>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

