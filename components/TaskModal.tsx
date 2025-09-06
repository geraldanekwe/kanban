"use client";

import { useState, useEffect } from "react";
import { Task } from "@/types/task";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Task) => void;
  onUpdateTask?: (task: Task) => void;
  taskToEdit?: Task;
}

export function TaskModal({
  isOpen,
  onClose,
  onAddTask,
  onUpdateTask,
  taskToEdit,
}: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setAssignee(taskToEdit.assignee);
      setTags(taskToEdit.tags.join(", "));
    } else {
      setTitle("");
      setDescription("");
      setAssignee("");
      setTags("");
    }
  }, [taskToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const task: Task = {
      id: taskToEdit?.id || Date.now().toString(),
      title,
      description,
      status: taskToEdit?.status || "scheduled",
      assignee,
      tags: tags.split(",").map((t) => t.trim()),
      createdAt: taskToEdit?.createdAt || new Date().toISOString(),
    };

    if (taskToEdit && onUpdateTask) {
      onUpdateTask(task);
    } else {
      onAddTask(task);
    }

    onClose();
  };

  if (!isOpen) return null;

  const isEditing = Boolean(taskToEdit);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative bg-white p-6 rounded-lg w-full max-w-md
                   shadow-[0_30px_120px_rgba(0,0,0,0.6)]
                   transition-transform duration-200 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4 text-black">
          {isEditing ? "Edit Task" : "Add Task"}
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
              className="px-4 py-2 rounded border text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
            >
              {isEditing ? "Save" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
