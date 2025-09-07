// __mocks__/taskMocks.tsx
import React from "react";
import { Task, TaskStatus } from "@/types/task";
import { TaskModal as OriginalTaskModal } from "@/components/TaskModal";

export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Task 1",
    description: "Desc 1",
    status: "scheduled" as TaskStatus,
    assignee: "Alice",
    tags: [],
    createdAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "2",
    title: "Task 2",
    description: "Desc 2",
    status: "in-progress" as TaskStatus,
    assignee: "Bob",
    tags: [],
    createdAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "3",
    title: "Task 3",
    description: "Desc 3",
    status: "done" as TaskStatus,
    assignee: "Charlie",
    tags: [],
    createdAt: "2025-01-01T00:00:00Z",
  },
];

export const mockTaskFunctions = {
  addTask: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
  moveTask: jest.fn(),
  reorderTasks: jest.fn(),
  setFilters: jest.fn(),
};

export const MockTaskModal = jest.fn(
  (props: React.ComponentProps<typeof OriginalTaskModal>) => {
    return (
      <div data-testid="task-modal">
        {props.isOpen ? `${props.mode} modal open` : "closed"}
      </div>
    );
  }
);
