"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useTasks } from "@/hooks/useTasks";
import { useParams, useRouter } from "next/navigation";
import { TaskModal } from "@/components/TaskModal";
import { useTaskActions } from "@/hooks/useTaskActions";
import { TrashIcon } from "@heroicons/react/24/outline";
import { TASK_STATUS, TaskStatus } from "@/constants/taskStatus";

export default function TaskDetailPage() {
  const { tasks, updateTask, deleteTask } = useTasks();

  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    tasks.forEach((t) => t.tags.forEach((tag) => tagsSet.add(tag)));
    return Array.from(tagsSet);
  }, [tasks]);

  const allAssignees = useMemo(
    () => Array.from(new Set(tasks.map((t) => t.assignee))),
    [tasks]
  );

  const params = useParams();
  const router = useRouter();

  const task = useMemo(() => {
    return tasks.find((t) => t.id === params.id) || null;
  }, [tasks, params.id]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>(TASK_STATUS.BACKLOG);
  const [assignee, setAssignee] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [createdAtStr, setCreatedAtStr] = useState("");

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

  const handleSave = useCallback(() => {
    updateTask({ ...task!, title, description, status, assignee, tags });
    const destination =
      task?.status === TASK_STATUS.BACKLOG ? `/${TASK_STATUS.BACKLOG}` : "/";
    router.push(destination);
  }, [task, title, description, status, assignee, tags, updateTask, router]);

  const handleCancel = useCallback(() => {
    const destination =
      task?.status === TASK_STATUS.BACKLOG ? `/${TASK_STATUS.BACKLOG}` : "/";
    router.push(destination);
  }, [task, router]);

  const { openEditModal, modalProps } = useTaskActions({
    onAddTask: () => {},
    onUpdateTask: updateTask,
    onDeleteTask: (id: string) => {
      try {
        deleteTask(id);
        const destination =
          task?.status === TASK_STATUS.BACKLOG ? "/backlog" : "/";
        router.push(destination);
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    },
    allTags,
    allAssignees,
  });

  const handleDelete = useCallback(() => {
    openEditModal(task!, "delete");
  }, [task, openEditModal]);

  const toggleTag = useCallback((tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, []);

  if (!task) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white p-6">
        <p className="text-gray-500 mb-4">Task not found.</p>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition shadow"
          onClick={() => router.push("/backlog")}
        >
          Back to Backlog
        </button>
      </div>
    );
  }

  if (!mounted) return <div className="p-6 text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 pt-20 px-6">
      <div
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8
        bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl"
      >
        <div>
          <h1
            className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600
            bg-clip-text text-transparent mb-2"
          >
            Task Details
          </h1>
        </div>

        <div className="mt-4 md:mt-0 flex gap-2 justify-end">
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded-xl font-semibold transition shadow bg-gray-200 text-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`px-4 py-2 rounded-xl font-semibold transition shadow ${
              hasChanges
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Save Changes
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-5xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value={TASK_STATUS.BACKLOG}>Backlog</option>
              <option value={TASK_STATUS.SCHEDULED}>Scheduled</option>
              <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
              <option value={TASK_STATUS.DONE}>Done</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assignee
            </label>
            <select
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              {allAssignees.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Tag
            </label>
            <select
              onChange={(e) => {
                if (e.target.value) toggleTag(e.target.value);
                e.target.value = "";
              }}
              value=""
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="" disabled>
                Select a tag
              </option>
              {allTags
                .filter((tag) => !tags.includes(tag))
                .map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selected Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className="px-3 py-1 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition text-sm"
              >
                {tag} ✕
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Created At
          </label>
          <p className="text-gray-700">{createdAtStr}</p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-600 hover:text-red-700 transition font-semibold shadow"
          >
            <TrashIcon className="h-5 w-5" />
            Delete Task
          </button>
        </div>
      </div>
      {modalProps.isOpen && <TaskModal {...modalProps} />}
    </div>
  );
}
