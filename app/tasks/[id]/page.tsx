"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useTasks } from "@/hooks/useTasks";
import { useParams, useRouter } from "next/navigation";
import { Task } from "@/types/task";
import { TrashIcon } from "@heroicons/react/24/outline";

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

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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

  const hasChanges = useMemo(() => {
    if (!task) return false;
    return (
      title !== task.title ||
      description !== task.description ||
      status !== task.status ||
      assignee !== task.assignee ||
      tags.join(",") !== task.tags.join(",")
    );
  }, [title, description, status, assignee, tags, task]);

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

  if (!mounted) {
    return <div className="p-6 text-gray-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-black">Task Details</h1>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => router.push("/backlog")}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className={`px-4 py-2 rounded transition ${
              hasChanges
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!hasChanges}
          >
            Save
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
            <label className="block font-semibold text-black mb-1">
              Add Tag
            </label>
            <select
              onChange={(e) => {
                if (e.target.value) toggleTag(e.target.value);
                e.target.value = "";
              }}
              value=""
              className="border rounded p-2 text-gray-700 w-full sm:w-auto"
            >
              <option value="" disabled>
                Select a tag
              </option>
              {allTagsArray
                .filter((tag) => !tags.includes(tag))
                .map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-black mb-1">
            Selected Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className="px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                {tag} ✕
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-semibold text-black mb-1">
            Created At
          </label>
          <p className="text-gray-700">{createdAtStr}</p>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 transition font-semibold"
          >
            <TrashIcon className="h-5 w-5" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
