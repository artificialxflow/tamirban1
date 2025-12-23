"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { TaskList } from "./task-list";
import { TaskCreateModal } from "./task-create-modal";
import { TaskEditModal } from "./task-edit-modal";
import { TaskFilters } from "./task-filters";
import { ProtectedComponent } from "@/components/common/protected-component";
import type { TaskSummary } from "@/lib/services/tasks.service";

interface TasksPageClientProps {
  initialTasks: TaskSummary[];
}

export function TasksPageClient({ initialTasks }: TasksPageClientProps) {
  const router = useRouter();
  const [tasks] = useState<TaskSummary[]>(initialTasks);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskSummary | null>(null);

  const handleRefresh = () => {
    router.refresh();
  };

  const handleTaskCreated = () => {
    handleRefresh();
    setShowCreateModal(false);
  };

  const handleTaskUpdated = () => {
    handleRefresh();
    setEditingTask(null);
  };

  const handleEdit = (task: TaskSummary) => {
    setEditingTask(task);
  };

  return (
    <AppShell
      title="مدیریت تسک‌ها"
      description="ایجاد، ویرایش و مدیریت تسک‌های تیم"
      activeHref="/dashboard/tasks"
      actions={
        <ProtectedComponent permission="tasks:write">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center justify-center rounded-full border-2 border-primary-300 bg-primary-100 px-5 py-2.5 text-sm font-semibold text-primary-800 transition hover:border-primary-400 hover:bg-primary-200 hover:text-primary-900 shadow-md"
          >
            + ایجاد تسک جدید
          </button>
        </ProtectedComponent>
      }
    >
      <div className="flex flex-col gap-6">
        <TaskFilters />
        
        <div className="rounded-3xl border-2 border-slate-300 bg-white shadow-sm">
          <TaskList
            tasks={tasks}
            onEdit={handleEdit}
            onRefresh={handleRefresh}
          />
        </div>
      </div>

      {showCreateModal && (
        <TaskCreateModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleTaskCreated}
        />
      )}

      {editingTask && (
        <TaskEditModal
          task={editingTask}
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSuccess={handleTaskUpdated}
        />
      )}
    </AppShell>
  );
}

