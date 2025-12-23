"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import type { TaskStatus, TaskPriority } from "@/lib/types";

const STATUS_OPTIONS: { value: TaskStatus | ""; label: string }[] = [
  { value: "", label: "همه وضعیت‌ها" },
  { value: "PENDING", label: "در انتظار" },
  { value: "IN_PROGRESS", label: "در حال انجام" },
  { value: "COMPLETED", label: "تکمیل شد" },
  { value: "CANCELLED", label: "لغو شد" },
];

const PRIORITY_OPTIONS: { value: TaskPriority | ""; label: string }[] = [
  { value: "", label: "همه اولویت‌ها" },
  { value: "LOW", label: "پایین" },
  { value: "MEDIUM", label: "متوسط" },
  { value: "HIGH", label: "بالا" },
];

export function TaskFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<TaskStatus | "">((searchParams.get("status") as TaskStatus) || "");
  const [priority, setPriority] = useState<TaskPriority | "">((searchParams.get("priority") as TaskPriority) || "");
  const [overdue, setOverdue] = useState(searchParams.get("overdue") === "true");

  useEffect(() => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (priority) params.set("priority", priority);
    if (overdue) params.set("overdue", "true");
    router.push(`/dashboard/tasks?${params.toString()}`);
  }, [status, priority, overdue, router]);

  const handleClear = () => {
    setStatus("");
    setPriority("");
    setOverdue(false);
    router.push("/dashboard/tasks");
  };

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border-2 border-slate-300 bg-white p-4 shadow-sm">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as TaskStatus | "")}
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as TaskPriority | "")}
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
      >
        {PRIORITY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
        <input
          type="checkbox"
          checked={overdue}
          onChange={(e) => setOverdue(e.target.checked)}
          className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
        />
        <span>تسک‌های معوق</span>
      </label>

      {(status || priority || overdue) && (
        <button
          onClick={handleClear}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          پاک کردن فیلترها
        </button>
      )}
    </div>
  );
}

