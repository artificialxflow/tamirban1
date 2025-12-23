import type { Task, TaskStatus } from "../types";
import { getTasksCollection } from "../db";
import { BaseRepository } from "./base-repository";

class TasksRepository extends BaseRepository<Task> {
  protected collectionPromise = getTasksCollection();

  findByAssignedTo(userId: string) {
    return this.findMany({ assignedTo: userId });
  }

  findByAssignedBy(userId: string) {
    return this.findMany({ assignedBy: userId });
  }

  findByStatus(status: TaskStatus) {
    return this.findMany({ status });
  }

  findOverdue() {
    const now = new Date();
    return this.findMany({
      status: { $in: ["PENDING", "IN_PROGRESS"] },
      dueAt: { $lt: now },
    });
  }
}

export const tasksRepository = new TasksRepository();

