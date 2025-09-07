"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useTasks } from "@/hooks/useTasks";
import { useParams, useRouter } from "next/navigation";
import { TaskModal } from "@/components/TaskModal";
import { useTaskActions } from "@/hooks/useTaskActions";
import { TrashIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
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

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 pt-20">
      <div className="max-w-4xl mx-auto px-6">
        <nav className="mb-6">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to{" "}
            {task?.status === TASK_STATUS.BACKLOG ? "Backlog" : "Kanban Board"}
          </button>
        </nav>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Task Details
              </h1>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-xl font-medium transition-all border border-gray-200
                text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges}
                className={`px-6 py-2 rounded-xl font-medium transition-all ${
                  hasChanges
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Basic Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg
                  text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg
                  text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your task"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Assignment & Status
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg
                  text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg
                  text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {allAssignees.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Tags
                </label>
                <div className="flex flex-wrap gap-2 min-h-[2.5rem] items-center">
                  {tags.length === 0 ? (
                    <span className="text-gray-400 text-sm">
                      No tags assigned
                    </span>
                  ) : (
                    tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm
                        bg-blue-50 text-blue-700 border border-blue-200"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className="ml-2 text-blue-500 hover:text-blue-700"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Tags
                </label>
                <select
                  onChange={(e) => {
                    if (e.target.value) toggleTag(e.target.value);
                    e.target.value = "";
                  }}
                  value=""
                  className="w-full md:w-auto px-4 py-3 border border-gray-200 rounded-lg
                  text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="" disabled>
                    Select a tag to add
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
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Task Information
                </h2>
                <p className="text-sm text-gray-500">Created: {createdAtStr}</p>
              </div>

              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 rounded-lg
                text-red-600 hover:text-red-700 hover:bg-red-50 transition-all font-medium"
              >
                <TrashIcon className="h-4 w-4" />
                Delete Task
              </button>
            </div>
          </div>
        </div>
      </div>

      {modalProps.isOpen && <TaskModal {...modalProps} />}
    </div>
  );
}
