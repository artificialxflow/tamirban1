"use client";

import { useState, useActionState } from "react";
import { createStoryAction } from "@/app/dashboard/stories/actions";

interface StoryCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function StoryCreateModal({ isOpen, onClose, onSuccess }: StoryCreateModalProps) {
  const [state, formAction] = useActionState(createStoryAction, {
    success: false,
    message: null,
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    videoUrl: "",
    expiresAt: "",
    isActive: true,
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData();
    form.append("title", formData.title);
    if (formData.description) form.append("description", formData.description);
    if (formData.imageUrl) form.append("imageUrl", formData.imageUrl);
    if (formData.videoUrl) form.append("videoUrl", formData.videoUrl);
    form.append("expiresAt", formData.expiresAt);
    form.append("isActive", formData.isActive.toString());

    formAction(form);
  };

  if (state.success) {
    setTimeout(() => {
      onSuccess();
      setFormData({
        title: "",
        description: "",
        imageUrl: "",
        videoUrl: "",
        expiresAt: "",
        isActive: true,
      });
    }, 500);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-3xl border-2 border-slate-300 bg-white shadow-xl max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between border-b-2 border-slate-200 bg-white px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-800">ایجاد استوری جدید</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            عنوان *
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="rounded-xl border-2 border-slate-200 px-4 py-2 focus:border-primary-400 focus:outline-none"
              placeholder="مثال: تخفیف ویژه تعمیرات"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            توضیحات
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="rounded-xl border-2 border-slate-200 px-4 py-2 focus:border-primary-400 focus:outline-none"
              placeholder="توضیحات استوری..."
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            آدرس تصویر
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="rounded-xl border-2 border-slate-200 px-4 py-2 focus:border-primary-400 focus:outline-none"
              placeholder="https://example.com/image.jpg"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            آدرس ویدیو
            <input
              type="url"
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              className="rounded-xl border-2 border-slate-200 px-4 py-2 focus:border-primary-400 focus:outline-none"
              placeholder="https://example.com/video.mp4"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            تاریخ انقضا *
            <input
              type="datetime-local"
              required
              value={formData.expiresAt}
              onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
              className="rounded-xl border-2 border-slate-200 px-4 py-2 focus:border-primary-400 focus:outline-none"
            />
          </label>

          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
            />
            فعال
          </label>

          {state.message && (
            <div
              className={`rounded-xl px-4 py-2 text-sm ${
                state.success ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
              }`}
            >
              {state.message}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border-2 border-slate-300 bg-white px-6 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="rounded-full bg-primary-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
            >
              ایجاد استوری
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

