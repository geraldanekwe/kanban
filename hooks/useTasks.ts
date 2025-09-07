"use client";

import { useCallback, useMemo } from "react";
import { Task } from "@/types/task";
import { TaskStatus } from "@/constants/taskStatus";
import { sampleTasks } from "@/data/task";
import {
  useLocalStorageTasks,
  useLocalStorageFilters,
} from "./useLocalStorage";
import { useToast } from "@/components/ToastProvider";

export interface TaskFilters {
  text: string;
  assignee: string;
  tag: string;
}

export function useTasks(route: string = "default") {
  const storageKey = "tasks";
  const filtersKey = `${route}-filters`;

  const [tasks, setTasks] = useLocalStorageTasks(storageKey, sampleTasks);
  const [filters, setFilters] = useLocalStorageFilters(filtersKey, {
    text: "",
    assignee: "",
    tag: "",
  });

  const { addToast } = useToast();

  const addTask = useCallback(
    (task: Task) => {
      try {
        setTasks((prev) => [...prev, task]);
        addToast("Task added successfully!", "success");
      } catch (error) {
        console.error(error);
        addToast("Failed to add task.", "error");
      }
    },
    [setTasks, addToast]
  );

  const updateTask = useCallback(
    (updatedTask: Task) => {
      try {
        setTasks((prev) =>
          prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
        );
        addToast("Task updated successfully!", "success");
      } catch (error) {
        console.error(error);
        addToast("Failed to update task.", "error");
      }
    },
    [setTasks, addToast]
  );

  const deleteTask = useCallback(
    (id: string) => {
      try {
        setTasks((prev) => prev.filter((t) => t.id !== id));
        addToast("Task deleted successfully!", "success");
      } catch (error) {
        console.error(error);
        addToast("Failed to delete task.", "error");
      }
    },
    [setTasks, addToast]
  );

  const reorderTasks = useCallback(
    (status: TaskStatus, fromIndex: number, toIndex: number) => {
      try {
        setTasks((prev) => {
          const statusTasks = prev.filter((t) => t.status === status);
          const otherTasks = prev.filter((t) => t.status !== status);

          const [moved] = statusTasks.splice(fromIndex, 1);
          statusTasks.splice(toIndex, 0, moved);

          return [...otherTasks, ...statusTasks];
        });
        addToast("Tasks reordered successfully!", "success");
      } catch (error) {
        console.error(error);
        addToast("Failed to reorder tasks.", "error");
      }
    },
    [setTasks, addToast]
  );

  const moveTask = useCallback(
    (taskId: string, newStatus: TaskStatus, newIndex: number) => {
      try {
        setTasks((prev) => {
          const task = prev.find((t) => t.id === taskId);
          if (!task) throw new Error("Task not found");

          const withoutTask = prev.filter((t) => t.id !== taskId);
          const destTasks = withoutTask.filter((t) => t.status === newStatus);
          const otherTasks = withoutTask.filter((t) => t.status !== newStatus);

          const updatedTask = { ...task, status: newStatus };
          destTasks.splice(newIndex, 0, updatedTask);

          return [...otherTasks, ...destTasks];
        });
        addToast(`Task moved to "${newStatus}"!`, "success");
      } catch (error) {
        console.error(error);
        addToast("Failed to move task.", "error");
      }
    },
    [setTasks, addToast]
  );

  const filteredTasks = useMemo(() => {
    const lowerText = filters.text.toLowerCase();
    const lowerAssignee = filters.assignee.toLowerCase();
    const lowerTag = filters.tag.toLowerCase();

    return tasks.filter((t) => {
      const matchesText =
        !filters.text ||
        t.title.toLowerCase().includes(lowerText) ||
        t.description.toLowerCase().includes(lowerText) ||
        t.assignee.toLowerCase().includes(lowerText) ||
        t.tags.some((tag) => tag.toLowerCase().includes(lowerText));

      const matchesAssignee =
        !filters.assignee || t.assignee.toLowerCase() === lowerAssignee;

      const matchesTag =
        !filters.tag || t.tags.some((tag) => tag.toLowerCase() === lowerTag);

      return matchesText && matchesAssignee && matchesTag;
    });
  }, [tasks, filters.text, filters.assignee, filters.tag]);

  return {
    tasks: filteredTasks,
    addTask,
    updateTask,
    deleteTask,
    reorderTasks,
    moveTask,
    filters,
    setFilters,
  };
}
