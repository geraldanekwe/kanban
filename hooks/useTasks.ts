"use client";

import { useCallback, useMemo } from "react";
import { Task } from "@/types/task";
import { sampleTasks } from "@/data/task";
import {
  useLocalStorageTasks,
  useLocalStorageFilters,
} from "./useLocalStorage";

export interface TaskFilters {
  text: string;
  assignee: string;
  tag: string;
}

export function useTasks() {
  const [tasks, setTasks] = useLocalStorageTasks("tasks", sampleTasks);

  const [filters, setFilters] = useLocalStorageFilters("filters", {
    text: "",
    assignee: "",
    tag: "",
  });

  const addTask = useCallback(
    (task: Task) => setTasks((prev) => [...prev, task]),
    [setTasks]
  );

  const updateTask = useCallback(
    (updatedTask: Task) =>
      setTasks((prev) =>
        prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      ),
    [setTasks]
  );

  const deleteTask = useCallback(
    (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id)),
    [setTasks]
  );

  const reorderTasks = useCallback(
    (status: Task["status"] | "all", fromIndex: number, toIndex: number) => {
      setTasks((prev) => {
        let targetTasks: Task[];
        let otherTasks: Task[];

        if (status === "all") {
          targetTasks = [...prev];
          otherTasks = [];
        } else {
          targetTasks = prev.filter((t) => t.status === status);
          otherTasks = prev.filter((t) => t.status !== status);
        }

        const [moved] = targetTasks.splice(fromIndex, 1);
        targetTasks.splice(toIndex, 0, moved);

        return [...otherTasks, ...targetTasks];
      });
    },
    [setTasks]
  );

  const moveTask = useCallback(
    (taskId: string, newStatus: Task["status"], newIndex: number) => {
      setTasks((prev) => {
        const task = prev.find((t) => t.id === taskId);
        if (!task) return prev;

        const withoutTask = prev.filter((t) => t.id !== taskId);
        const destTasks = withoutTask.filter((t) => t.status === newStatus);
        const otherTasks = withoutTask.filter((t) => t.status !== newStatus);

        const updatedTask = { ...task, status: newStatus };
        destTasks.splice(newIndex, 0, updatedTask);

        return [...otherTasks, ...destTasks];
      });
    },
    [setTasks]
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
