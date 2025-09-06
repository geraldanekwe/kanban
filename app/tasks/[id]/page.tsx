"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useTasks } from "@/hooks/useTasks";
import { useParams, useRouter } from "next/navigation";
import { Task } from "@/types/task";

export default function TaskDetailPage() {
  const { tasks, updateTask, deleteTask } = useTasks();
  const params = useParams();
  const router = useRouter();

  const { task, assigneesArray, allTagsArray } = useMemo(() => {
    const acc = tasks.reduce(
      (acc, t) => {
        if (t.id === params.id) acc.task = t;
        acc.assigneesSet.add(t.assignee);
        t.tags.forEach((tag) => acc.tagsSet.add(tag));
        return acc;
      },
      {
        task: null as Task | null,
        assigneesSet: new Set<string>(),
        tagsSet: new Set<string>(),
      }
    );

    return {
      task: acc.task,
      assigneesArray: Array.from(acc.assigneesSet),
      allTagsArray: Array.from(acc.tagsSet),
    };
  }, [tasks, params.id]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Task["status"]>("to-do");
  const [assignee, setAssignee] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [createdAtStr, setCreatedAtStr] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setAssignee(task.assignee);
      setTags(task.tags);
      setCreatedAtStr(new Date(task.createdAt).toLocaleString());
    }
  }, [task]);

  if (!task) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white p-6">
        <p className="text-gray-500 mb-4">Task not found.</p>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={() => router.push("/backlog")}
        >
          Back to Backlog
        </button>
      </div>
    );
  }

  const handleSave = () => {
    updateTask({
      ...task,
      title,
      description,
      status,
      assignee,
      tags,
    });
    router.push("/backlog");
  };

  const handleDelete = () => {
    deleteTask(task.id);
    router.push("/backlog");
  };

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-black">Task Details</h1>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Delete
          </button>
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Save
          </button>
          <button
            onClick={() => router.push("/backlog")}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md w-full max-w-5xl mx-auto">
        <div className="mb-4">
          <label className="block font-semibold text-black mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded text-gray-700 placeholder-gray-400"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-black mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full border p-2 rounded text-gray-700 placeholder-gray-400"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block font-semibold text-black mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Task["status"])}
              className="w-full border p-2 rounded text-gray-700"
            >
              <option value="to-do">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-black mb-1">
              Assignee
            </label>
            <select
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="w-full border p-2 rounded text-gray-700"
            >
              {assigneesArray.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-black mb-1">Tags</label>
            <div className="flex flex-wrap gap-2">
              {allTagsArray.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-2 py-1 rounded border ${
                    tags.includes(tag)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-100 text-gray-700 border-gray-300"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block font-semibold text-black mb-1">
            Created At
          </label>
          <p className="text-gray-700">{createdAtStr}</p>
        </div>
      </div>
    </div>
  );
}
