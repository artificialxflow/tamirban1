import { listTasks } from "@/lib/services/tasks.service";
import { TasksPageClient } from "@/components/tasks/tasks-page-client";
import type { TaskStatus } from "@/lib/types";

type TasksPageProps = {
  searchParams: Promise<{
    assignedTo?: string;
    assignedBy?: string;
    status?: string;
    priority?: string;
    overdue?: string;
    page?: string;
  }>;
};

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;
  const limit = 20;

  const result = await listTasks({
    assignedTo: params.assignedTo,
    assignedBy: params.assignedBy,
    status: params.status as TaskStatus | undefined,
    priority: params.priority as "LOW" | "MEDIUM" | "HIGH" | undefined,
    overdue: params.overdue === "true",
    page,
    limit,
  });

  return (
    <TasksPageClient
      initialTasks={result}
    />
  );
}

