"use client";

import { useCallback } from "react";
import { Task } from "@/types/task";
import { sampleTasks } from "@/data/task";
import { useLocalStorage } from "./useLocalStorage";

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage("tasks", sampleTasks);

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

  return { tasks, addTask, updateTask, deleteTask, moveTask };
}
