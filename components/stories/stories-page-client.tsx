"use client";

import { useState, useEffect } from "react";
import { StoryList } from "./story-list";
import { StoryCreateModal } from "./story-create-modal";
import { StoryEditModal } from "./story-edit-modal";
import { ProtectedComponent } from "@/components/common/protected-component";
import type { StorySummary } from "@/lib/services/stories.service";

export function StoriesPageClient() {
  const [stories, setStories] = useState<StorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingStory, setEditingStory] = useState<StorySummary | null>(null);
  const [filters, setFilters] = useState({
    isActive: undefined as boolean | undefined,
    expired: undefined as boolean | undefined,
  });

  useEffect(() => {
    loadStories();
  }, [filters]);

  const loadStories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("No access token found");
        return;
      }

      const params = new URLSearchParams();
      if (filters.isActive !== undefined) {
        params.append("isActive", filters.isActive.toString());
      }
      if (filters.expired !== undefined) {
        params.append("expired", filters.expired.toString());
      }

      const response = await fetch(`/api/stories?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("خطا در بارگذاری استوری‌ها");
      }

      const data = await response.json();
      if (data.success) {
        setStories(data.data.data || []);
      }
    } catch (error) {
      console.error("Error loading stories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    loadStories();
  };

  const handleEditSuccess = () => {
    setEditingStory(null);
    loadStories();
  };

  const handleDelete = async (storyId: string) => {
    if (!confirm("آیا از حذف این استوری اطمینان دارید؟")) {
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("لطفاً دوباره وارد شوید");
        return;
      }

      const response = await fetch(`/api/stories/${storyId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "خطا در حذف استوری");
      }

      loadStories();
    } catch (error) {
      alert(error instanceof Error ? error.message : "خطا در حذف استوری");
    }
  };

  const handleToggleStatus = async (storyId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("لطفاً دوباره وارد شوید");
        return;
      }

      const response = await fetch(`/api/stories/${storyId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !currentStatus,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "خطا در تغییر وضعیت");
      }

      loadStories();
    } catch (error) {
      alert(error instanceof Error ? error.message : "خطا در تغییر وضعیت");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">لیست استوری‌ها</h2>
          <p className="text-sm text-slate-600">
            {stories.length} استوری {filters.isActive !== undefined && (filters.isActive ? "فعال" : "غیرفعال")}
          </p>
        </div>
        <ProtectedComponent permission="stories:write">
          <button
            onClick={() => setShowCreateModal(true)}
            style={{ background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" }}
            className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 active:scale-100 disabled:opacity-50"
          >
            ایجاد استوری جدید
          </button>
        </ProtectedComponent>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setFilters({ ...filters, isActive: undefined })}
          className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
            filters.isActive === undefined
              ? "bg-primary-100 text-primary-800 border-2 border-primary-300"
              : "bg-slate-100 text-slate-600 border-2 border-slate-200"
          }`}
        >
          همه
        </button>
        <button
          onClick={() => setFilters({ ...filters, isActive: true })}
          className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
            filters.isActive === true
              ? "bg-emerald-100 text-emerald-800 border-2 border-emerald-300"
              : "bg-slate-100 text-slate-600 border-2 border-slate-200"
          }`}
        >
          فعال
        </button>
        <button
          onClick={() => setFilters({ ...filters, isActive: false })}
          className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
            filters.isActive === false
              ? "bg-rose-100 text-rose-800 border-2 border-rose-300"
              : "bg-slate-100 text-slate-600 border-2 border-slate-200"
          }`}
        >
          غیرفعال
        </button>
        <button
          onClick={() => setFilters({ ...filters, expired: true })}
          className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
            filters.expired === true
              ? "bg-orange-100 text-orange-800 border-2 border-orange-300"
              : "bg-slate-100 text-slate-600 border-2 border-slate-200"
          }`}
        >
          منقضی شده
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-slate-500">در حال بارگذاری...</div>
        </div>
      ) : (
        <StoryList
          stories={stories}
          onEdit={setEditingStory}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {showCreateModal && (
        <StoryCreateModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onSuccess={handleCreateSuccess} />
      )}

      {editingStory && (
        <StoryEditModal
          story={editingStory}
          isOpen={!!editingStory}
          onClose={() => setEditingStory(null)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}

