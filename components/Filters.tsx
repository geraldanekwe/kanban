"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Task } from "@/types/task";

interface FiltersProps {
  tasks: Task[];
  value: {
    text: string;
    assignee: string;
    tag: string;
  };
  onChange: (filters: { text: string; assignee: string; tag: string }) => void;
}

export const Filters: React.FC<FiltersProps> = ({ tasks, value, onChange }) => {
  const [text, setText] = useState(value.text);
  const [assignee, setAssignee] = useState(value.assignee);
  const [tag, setTag] = useState(value.tag);

  const assignees = useMemo(
    () => Array.from(new Set(tasks.map((t) => t.assignee))),
    [tasks]
  );
  const tags = useMemo(
    () => Array.from(new Set(tasks.flatMap((t) => t.tags))),
    [tasks]
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange({ text, assignee, tag });
    }, 300);
    return () => clearTimeout(handler);
  }, [text, assignee, tag, onChange]);

  return (
    <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
      <input
        type="text"
        placeholder="Search tasks..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full md:w-1/3 border p-2 rounded placeholder-gray-500 text-black"
      />

      <select
        value={assignee}
        onChange={(e) => setAssignee(e.target.value)}
        className="border p-2 rounded text-black"
      >
        <option value="">All Assignees</option>
        {assignees.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>

      <select
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        className="border p-2 rounded text-black"
      >
        <option value="">All Tags</option>
        {tags.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </div>
  );
};
