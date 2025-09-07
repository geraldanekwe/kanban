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
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        <div className="flex-1 max-w-md w-full">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tasks..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl
              placeholder-gray-500 text-gray-900 bg-white/50 backdrop-blur-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-all duration-200"
            />
            <svg
              className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <select
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            className="w-full sm:w-36 md:w-40 px-4 py-3 border border-gray-200 rounded-xl
              text-gray-900 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2
              focus:ring-blue-500 focus:border-transparent transition-all duration-200 truncate"
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
            className="w-full sm:w-36 md:w-40 px-4 py-3 border border-gray-200 rounded-xl
              text-gray-900 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2
              focus:ring-blue-500 focus:border-transparent transition-all duration-200 truncate"
          >
            <option value="">All Tags</option>
            {tags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
