"use client";

import { useEffect, useRef, useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { updateTaskAction, type UpdateTaskFormState } from "@/app/dashboard/tasks/actions";
import { apiClient } from "@/lib/utils/api-client";
import type { TaskSummary } from "@/lib/services/tasks.service";
import type { MarketerSummary } from "@/lib/services/marketers.service";
import { PersianDateTimePicker } from "@/components/visits/persian-date-time-picker";
import { Button } from "@/components/common/button";

const updateTaskDefaultState: UpdateTaskFormState = {
  success: false,
  message: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="lg"
      isLoading={pending}
      loadingText="در حال به‌روزرسانی..."
      className="text-white shadow-lg"
      style={{ background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" }}
    >
      به‌روزرسانی تسک
    </Button>
  );
}

interface TaskEditModalProps {
  task: TaskSummary;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function TaskEditModal({ task, isOpen, onClose, onSuccess }: TaskEditModalProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(updateTaskAction.bind(null, task.id), updateTaskDefaultState);
  const [marketers, setMarketers] = useState<MarketerSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      apiClient
        .get<{ data: MarketerSummary[]; total: number; page: number; limit: number }>("/marketers?limit=100")
        .then((res) => {
          if (res.success && "data" in res && res.data) {
            const responseData = res.data as { data?: MarketerSummary[]; total?: number; page?: number; limit?: number };
            let marketersData: MarketerSummary[] = [];
            if (responseData && typeof responseData === "object" && "data" in responseData) {
              if (Array.isArray(responseData.data)) {
                marketersData = responseData.data;
              }
            } else if (Array.isArray(responseData)) {
              marketersData = responseData;
            }
            setMarketers(marketersData);
          }
        })
        .catch((err) => {
          console.error("Error fetching marketers:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen]);

  useEffect(() => {
    if (state.success) {
      onSuccess?.();
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  }, [state.success, onSuccess, onClose]);

  if (!isOpen) return null;

  const dueAtValue = task.dueAt ? new Date(task.dueAt).toISOString().slice(0, 16) : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-3xl border-2 border-slate-300 bg-white shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <h2 className="text-xl font-bold text-slate-900">ویرایش تسک</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {state.message && (
            <div
              className={`mb-4 rounded-2xl px-4 py-3 text-sm ${
                state.success ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
              }`}
            >
              {state.message}
            </div>
          )}

          <form ref={formRef} action={formAction} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                عنوان تسک <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                defaultValue={task.title}
                className="w-full rounded-2xl border-2 border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 focus:border-primary-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">توضیحات</label>
              <textarea
                name="description"
                rows={3}
                defaultValue={task.description || ""}
                className="w-full rounded-2xl border-2 border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 focus:border-primary-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  اختصاص به <span className="text-red-500">*</span>
                </label>
                {loading ? (
                  <div className="rounded-2xl border-2 border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                    در حال بارگذاری...
                  </div>
                ) : (
                  <select
                    name="assignedTo"
                    required
                    defaultValue={task.assignedTo}
                    className="w-full rounded-2xl border-2 border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 focus:border-primary-500 focus:outline-none"
                  >
                    {marketers.map((marketer) => (
                      <option key={marketer.id} value={marketer.id}>
                        {marketer.fullName}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">اولویت</label>
                <select
                  name="priority"
                  defaultValue={task.priority}
                  className="w-full rounded-2xl border-2 border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 focus:border-primary-500 focus:outline-none"
                >
                  <option value="LOW">پایین</option>
                  <option value="MEDIUM">متوسط</option>
                  <option value="HIGH">بالا</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">تاریخ سررسید</label>
              <PersianDateTimePicker name="dueAt" defaultValue={dueAtValue} />
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-slate-200 px-6 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
              >
                انصراف
              </button>
              <SubmitButton />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

