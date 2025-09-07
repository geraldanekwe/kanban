import { TaskStatus } from "@/constants/taskStatus";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee: string;
  tags: string[];
  createdAt: string;
  // priority?: "low" | "medium" | "high";
  // dueDate?: string;
}
