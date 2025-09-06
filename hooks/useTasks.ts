"use client";

import { useCallback, useState, useMemo } from "react";
import { Task } from "@/types/task";
import { sampleTasks } from "@/data/task";
import { useLocalStorage } from "./useLocalStorage";

export interface TaskFilters {
  text: string;
  assignee: string;
  tag: string;
}

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage("tasks", sampleTasks);
  const [filters, setFilters] = useState<TaskFilters>({
    text: "",
    assignee: "",
    tag: "",
  });

  const addTask = useCallback(
    (task: Task) => setTasks([...tasks, task]),
    [tasks, setTasks]
  );

  const updateTask = useCallback(
    (updatedTask: Task) =>
      setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))),
    [tasks, setTasks]
  );

  const deleteTask = useCallback(
    (id: string) => setTasks(tasks.filter((t) => t.id !== id)),
    [tasks, setTasks]
  );

  const moveTask = useCallback(
    (id: string, status: Task["status"]) =>
      setTasks(tasks.map((t) => (t.id === id ? { ...t, status } : t))),
    [tasks, setTasks]
  );

  const filteredTasks = useMemo(() => {
    const lowerText = filters.text.toLowerCase();
    const lowerAssignee = filters.assignee.toLowerCase();
    const lowerTag = filters.tag.toLowerCase();

    return tasks.filter((t) => {
      const matchesText =
        !filters.text ||
        t.title.toLowerCase().includes(lowerText) ||
        t.description.toLowerCase().includes(lowerText);

      const matchesAssignee =
        !filters.assignee || t.assignee.toLowerCase() === lowerAssignee;

      const matchesTag =
        !filters.tag || t.tags.some((tag) => tag.toLowerCase() === lowerTag);

      return matchesText && matchesAssignee && matchesTag;
    });
  }, [tasks, filters]);

  return {
    tasks: filteredTasks,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    filters,
    setFilters,
  };
}
