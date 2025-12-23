"use client";

import type { StorySummary } from "@/lib/services/stories.service";
import { ProtectedComponent } from "@/components/common/protected-component";

const dateFormatter = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

interface StoryListProps {
  stories: StorySummary[];
  onEdit: (story: StorySummary) => void;
  onDelete: (storyId: string) => void;
  onToggleStatus: (storyId: string, currentStatus: boolean) => void;
}

export function StoryList({ stories, onEdit, onDelete, onToggleStatus }: StoryListProps) {
  if (stories.length === 0) {
    return (
      <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
        <p className="text-sm text-slate-600">هیچ استوری‌ای یافت نشد.</p>
      </div>
    );
  }

  const isExpired = (expiresAt: Date) => {
    return new Date(expiresAt) <= new Date();
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stories.map((story) => {
        const expired = isExpired(story.expiresAt);
        return (
          <div
            key={story.id}
            className={`rounded-3xl border-2 p-6 shadow-sm transition hover:shadow-md ${
              story.isActive && !expired
                ? "border-emerald-200 bg-white"
                : expired
                  ? "border-orange-200 bg-orange-50"
                  : "border-slate-200 bg-slate-50"
            }`}
          >
            {story.imageUrl && (
              <div className="mb-4 aspect-video overflow-hidden rounded-2xl bg-slate-100">
                <img src={story.imageUrl} alt={story.title} className="h-full w-full object-cover" />
              </div>
            )}

            <h3 className="mb-2 text-lg font-semibold text-slate-800">{story.title}</h3>

            {story.description && (
              <p className="mb-4 line-clamp-2 text-sm text-slate-600">{story.description}</p>
            )}

            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  story.isActive && !expired
                    ? "bg-emerald-100 text-emerald-700"
                    : expired
                      ? "bg-orange-100 text-orange-700"
                      : "bg-slate-100 text-slate-700"
                }`}
              >
                {story.isActive && !expired ? "فعال" : expired ? "منقضی شده" : "غیرفعال"}
              </span>
            </div>

            <div className="mb-4 space-y-1 text-xs text-slate-500">
              <p>تاریخ انقضا: {dateFormatter.format(new Date(story.expiresAt))}</p>
              <p>ایجاد شده: {dateFormatter.format(new Date(story.createdAt))}</p>
            </div>

            <ProtectedComponent permission="stories:write">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(story)}
                  className="flex-1 rounded-full border-2 border-primary-300 bg-primary-100 px-4 py-2 text-xs font-semibold text-primary-800 transition hover:border-primary-400 hover:bg-primary-200"
                >
                  ویرایش
                </button>
                <button
                  onClick={() => onToggleStatus(story.id, story.isActive)}
                  className={`rounded-full border-2 px-4 py-2 text-xs font-semibold transition ${
                    story.isActive
                      ? "border-rose-300 bg-rose-100 text-rose-800 hover:border-rose-400 hover:bg-rose-200"
                      : "border-emerald-300 bg-emerald-100 text-emerald-800 hover:border-emerald-400 hover:bg-emerald-200"
                  }`}
                >
                  {story.isActive ? "غیرفعال" : "فعال"}
                </button>
                <ProtectedComponent permission="stories:delete">
                  <button
                    onClick={() => onDelete(story.id)}
                    className="rounded-full border-2 border-rose-300 bg-rose-100 px-4 py-2 text-xs font-semibold text-rose-800 transition hover:border-rose-400 hover:bg-rose-200"
                  >
                    حذف
                  </button>
                </ProtectedComponent>
              </div>
            </ProtectedComponent>
          </div>
        );
      })}
    </div>
  );
}

