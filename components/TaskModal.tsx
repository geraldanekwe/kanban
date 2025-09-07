"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Task } from "@/types/task";

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
  const [status, setStatus] = useState<Task["status"]>("backlog");

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
      setStatus("backlog");
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
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white p-6 rounded-lg w-full max-w-md shadow-[0_30px_120px_rgba(0,0,0,0.6)] transition-transform duration-200 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {mode === "delete" && selectedTask ? (
          <>
            <h2 className="text-xl font-semibold text-red-600 mb-4">
              Delete Task
            </h2>
            <p className="mb-6 text-black">
              Are you sure you want to delete{" "}
              <span className="font-bold">{selectedTask.title}</span>? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4 text-black">
              {isEdit ? "Edit Task" : "Add Task"}
            </h2>
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border p-2 rounded placeholder-gray-500 text-black"
                required
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border p-2 rounded placeholder-gray-500 text-black"
                required
              />
              <input
                type="text"
                placeholder="Assignee"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="border p-2 rounded placeholder-gray-500 text-black"
                required
              />

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Task["status"])}
                className="border p-2 rounded placeholder-gray-500 text-black"
              >
                <option value="backlog">Backlog</option>
                <option value="scheduled">Scheduled</option>
              </select>

              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="px-2 py-1 rounded bg-blue-600 text-white border border-blue-600"
                  >
                    {tag} ×
                  </button>
                ))}
              </div>

              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Add tag"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  className="border p-2 rounded w-full placeholder-gray-500 text-black"
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
                  className="border p-2 rounded placeholder-gray-500 text-black"
                >
                  <option value="">Select tag</option>
                  {availableTags.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded border text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEdit && isUnchanged}
                  className={`px-4 py-2 rounded text-white ${
                    isEdit
                      ? isUnchanged
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isEdit ? "Save" : "Add"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export const TaskModal = React.memo(TaskModalComponent);
TaskModal.displayName = "TaskModal";
