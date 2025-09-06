import { useState, useEffect } from "react";
import { Task } from "@/types/task";
import { TaskFilters } from "@/hooks/useTasks";

export function useLocalStorageTasks(key: string, initialValue: Task[]) {
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(tasks));
  }, [key, tasks]);

  return [tasks, setTasks] as const;
}

export function useLocalStorageFilters(key: string, initialValue: TaskFilters) {
  const [filters, setFilters] = useState<TaskFilters>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(filters));
  }, [key, filters]);

  return [filters, setFilters] as const;
}
