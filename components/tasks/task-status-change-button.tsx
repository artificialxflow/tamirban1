"use client";

import { useState } from "react";
import type { TaskSummary } from "@/lib/services/tasks.service";
import type { TaskStatus } from "@/lib/types";

const STATUS_OPTIONS: TaskStatus[] = ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

const STATUS_LABELS: Record<TaskStatus, string> = {
  PENDING: "در انتظار",
  IN_PROGRESS: "در حال انجام",
  COMPLETED: "تکمیل شد",
  CANCELLED: "لغو شد",
};

interface TaskStatusChangeButtonProps {
  task: TaskSummary;
  onSuccess?: () => void;
}

export function TaskStatusChangeButton({ task, onSuccess }: TaskStatusChangeButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus: TaskStatus) => {
    if (newStatus === task.status) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("لطفاً ابتدا وارد شوید.");
        return;
      }

      const response = await fetch(`/api/tasks/${task.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "خطا در تغییر وضعیت");
      }

      onSuccess?.();
    } catch (error) {
      alert(error instanceof Error ? error.message : "خطا در تغییر وضعیت");
    } finally {
      setLoading(false);
    }
  };

  if (task.status === "COMPLETED" || task.status === "CANCELLED") {
    return null;
  }

  return (
    <select
      value={task.status}
      onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
      disabled={loading}
      className="rounded-full border border-primary-300 bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700 transition hover:bg-primary-100 disabled:opacity-50"
    >
      {STATUS_OPTIONS.map((status) => (
        <option key={status} value={status}>
          {STATUS_LABELS[status]}
        </option>
      ))}
    </select>
  );
}

