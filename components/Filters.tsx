"use client";

import React, { useState, useEffect, useMemo } from "react";
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface FiltersProps {
  allAssignees: string[];
  allTags: string[];
  value: {
    text: string;
    assignee: string;
    tag: string;
  };
  onChange: (filters: { text: string; assignee: string; tag: string }) => void;
}

export const Filters: React.FC<FiltersProps> = ({
  allAssignees,
  allTags,
  value,
  onChange,
}) => {
  const [text, setText] = useState(value.text);
  const [assignee, setAssignee] = useState(value.assignee);
  const [tag, setTag] = useState(value.tag);

  const hasActiveFilters = useMemo(() => {
    return text.trim() !== "" || assignee !== "" || tag !== "";
  }, [text, assignee, tag]);

  const clearFilters = () => {
    setText("");
    setAssignee("");
    setTag("");
  };

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
            <MagnifyingGlassIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
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
            {allAssignees.map((a) => (
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
            {allTags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-3 text-gray-600 hover:text-gray-800 bg-gray-100/50 
                hover:bg-gray-200/50 rounded-xl transition-all duration-200 font-medium
                flex items-center gap-2 whitespace-nowrap"
            >
              <XMarkIcon className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
