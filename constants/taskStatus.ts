export const TASK_STATUS = {
  SCHEDULED: "scheduled",
  IN_PROGRESS: "in-progress",
  DONE: "done",
  BACKLOG: "backlog",
} as const;
export type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];
