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
}

const TaskModalComponent: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  selectedTask,
  mode,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    if (selectedTask) {
      setTitle(selectedTask.title);
      setDescription(selectedTask.description);
      setAssignee(selectedTask.assignee);
      setTags(selectedTask.tags.join(", "));
    } else {
      setTitle("");
      setDescription("");
      setAssignee("");
      setTags("");
    }
  }, [selectedTask]);

  const parsedTags = useMemo(
    () => tags.split(",").map((t) => t.trim()),
    [tags]
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
        status: selectedTask?.status || "to-do",
        assignee,
        tags: parsedTags,
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
      parsedTags,
      selectedTask,
      mode,
      onAddTask,
      onUpdateTask,
      onDeleteTask,
      onClose,
    ]
  );

  if (!isOpen) return null;

  const isEdit = mode === "edit";
  const isAdd = mode === "add";

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
              <input
                type="text"
                placeholder="Tags (comma-separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="border p-2 rounded placeholder-gray-500 text-black"
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className={`px-4 py-2 rounded border text-gray-600 hover:bg-gray-100 ${
                    mode === "delete" ? "hidden" : ""
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded text-white ${
                    isEdit || isAdd
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {isEdit ? "Save" : isAdd ? "Add" : "Delete"}
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
