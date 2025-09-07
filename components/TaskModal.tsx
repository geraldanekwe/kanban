"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Task } from "@/types/task";
import { TaskStatus, TASK_STATUS } from "@/constants/taskStatus";
import { TrashIcon } from "@heroicons/react/24/outline";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Task) => void;
  onUpdateTask?: (task: Task) => void;
  onDeleteTask?: (task: Task) => void;
  selectedTask?: Task | null;
  mode: "add" | "edit" | "delete";
  allTags: string[];
}

const TaskModalComponent: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  selectedTask,
  mode,
  allTags,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState("");
  const [status, setStatus] = useState<TaskStatus>(TASK_STATUS.BACKLOG);

  useEffect(() => {
    if (selectedTask) {
      setTitle(selectedTask.title);
      setDescription(selectedTask.description);
      setAssignee(selectedTask.assignee);
      setTags(selectedTask.tags);
      setStatus(selectedTask.status);
      setAvailableTags(allTags.filter((t) => !selectedTask.tags.includes(t)));
    } else {
      setTitle("");
      setDescription("");
      setAssignee("");
      setTags([]);
      setStatus(TASK_STATUS.BACKLOG);
      setAvailableTags(allTags);
    }
    setNewTagInput("");
  }, [selectedTask, allTags]);

  const addTag = useCallback(
    (tag: string) => {
      if (!tag.trim()) return;
      if (!tags.includes(tag)) setTags([...tags, tag]);
      setAvailableTags((prev) => prev.filter((t) => t !== tag));
      setNewTagInput("");
    },
    [tags]
  );

  const removeTag = useCallback(
    (tag: string) => {
      setTags((prev) => prev.filter((t) => t !== tag));
      if (!allTags.includes(tag)) return;
      setAvailableTags((prev) => [...prev, tag]);
    },
    [allTags]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (mode === "delete" && selectedTask && onDeleteTask) {
        onDeleteTask(selectedTask);
        onClose();
        return;
      }

      const task: Task = {
        id: selectedTask?.id || Date.now().toString(),
        title,
        description,
        status,
        assignee,
        tags,
        createdAt: selectedTask?.createdAt || new Date().toISOString(),
      };

      if (selectedTask && onUpdateTask) {
        onUpdateTask(task);
      } else {
        onAddTask(task);
      }

      onClose();
    },
    [
      title,
      description,
      assignee,
      tags,
      status,
      selectedTask,
      mode,
      onAddTask,
      onUpdateTask,
      onDeleteTask,
      onClose,
    ]
  );

  const isUnchanged = useMemo(() => {
    if (!selectedTask) return false;
    return (
      title === selectedTask.title &&
      description === selectedTask.description &&
      assignee === selectedTask.assignee &&
      tags.join(",") === selectedTask.tags.join(",") &&
      status === selectedTask.status
    );
  }, [title, description, assignee, tags, status, selectedTask]);

  if (!isOpen) return null;

  const isEdit = mode === "edit";

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4
      bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl w-full max-w-lg
        shadow-2xl border border-gray-200 transform transition-all duration-300
        animate-in zoom-in-95 fade-in-0"
        onClick={(e) => e.stopPropagation()}
      >
        {mode === "delete" && selectedTask ? (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <TrashIcon className="h-5 w-5 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Delete Task
              </h2>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                {selectedTask.title}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200
                rounded-lg transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white
                rounded-lg transition-colors duration-200 font-medium"
              >
                Delete Task
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {isEdit ? "Edit Task" : "Create New Task"}
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title
                </label>
                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl
                  placeholder-gray-500 text-gray-900 bg-white
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl
                  placeholder-gray-500 text-gray-900 bg-white resize-none
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignee
                </label>
                <input
                  type="text"
                  placeholder="Assignee"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl
                  placeholder-gray-500 text-gray-900 bg-white
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl
                  text-gray-900 bg-white
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  transition-all duration-200"
                >
                  <option value={TASK_STATUS.BACKLOG}>Backlog</option>
                  <option value={TASK_STATUS.SCHEDULED}>Scheduled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm
                      bg-blue-100 text-blue-700 border border-blue-200"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-blue-500 hover:text-blue-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add tag"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl
                    placeholder-gray-500 text-gray-900 bg-white
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-all duration-200"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag(newTagInput.trim());
                      }
                    }}
                  />
                  <select
                    value=""
                    onChange={(e) => addTag(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-xl
                    text-gray-900 bg-white
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-all duration-200"
                  >
                    <option value="">Select tag</option>
                    {availableTags.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200
                  rounded-lg transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEdit && isUnchanged}
                  className={`px-4 py-2 rounded-lg font-medium text-white transition-colors duration-200 ${
                    isEdit
                      ? isUnchanged
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isEdit ? "Save Changes" : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export const TaskModal = React.memo(TaskModalComponent);
TaskModal.displayName = "TaskModal";
