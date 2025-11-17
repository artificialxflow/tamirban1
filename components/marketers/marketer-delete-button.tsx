"use client";

import { useState } from "react";

import { apiClient } from "@/lib/utils/api-client";

interface MarketerDeleteButtonProps {
  marketerId: string;
  marketerName: string;
  onDelete?: (marketerId: string) => void;
}

export function MarketerDeleteButton({ marketerId, marketerName, onDelete }: MarketerDeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`آیا از حذف بازاریاب "${marketerName}" اطمینان دارید؟`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await apiClient.delete(`/api/marketers/${marketerId}`);
      if (response.success) {
        onDelete?.(marketerId);
        window.location.reload();
      } else {
        alert(response.message || "خطا در حذف بازاریاب");
      }
    } catch (error) {
      console.error("Error deleting marketer:", error);
      alert("خطا در حذف بازاریاب");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="rounded-full border border-rose-200 px-4 py-2 text-rose-600 transition hover:border-rose-300 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isDeleting ? "در حال حذف..." : "حذف"}
    </button>
  );
}

