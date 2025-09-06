import { useState, useEffect } from "react";
import { Task } from "@/types/task";

export function useLocalStorage(key: string, initialValue: Task[]) {
  const [value, setValue] = useState<Task[]>(initialValue);

  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (stored) {
      setValue(JSON.parse(stored));
    }
  }, [key]);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
