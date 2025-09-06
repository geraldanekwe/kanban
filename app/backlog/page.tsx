"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { TaskCard } from "@/components/TaskCard";
import { useTasks, TaskFilters } from "@/hooks/useTasks";
import { TaskModal } from "@/components/TaskModal";
import { Filters } from "@/components/Filters";
import { Task } from "@/types/task";

export default function BacklogPage() {
  const { tasks, addTask, updateTask, deleteTask, setFilters, filters } =
    useTasks();

  const [modalMode, setModalMode] = useState<"add" | "edit" | "delete">("add");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback(
    (task: Task | null, mode: "add" | "edit" | "delete") => {
      setSelectedTask(task);
      setModalMode(mode);
      setIsModalOpen(true);
    },
    []
  );

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Backlog</h1>
        <button
          onClick={() => openModal(null, "add")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add Task
        </button>
      </div>

      <Filters
        tasks={tasks}
        value={filters}
        onChange={(newFilters: TaskFilters) => setFilters(newFilters)}
      />

      <div className="grid gap-4">
        {tasks.length === 0 ? (
          <p className="text-gray-500">No tasks match the current filters.</p>
        ) : (
          tasks.map((task) => (
            <Link key={task.id} href={`/tasks/${task.id}`} className="block">
              <TaskCard
                task={task}
                onOpenModal={(task, mode) => openModal(task, mode)}
              />
            </Link>
          ))
        )}
      </div>

      {isModalOpen && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddTask={addTask}
          onUpdateTask={updateTask}
          onDeleteTask={(task: Task) => deleteTask(task.id)}
          selectedTask={selectedTask}
          mode={modalMode}
        />
      )}
    </div>
  );
}
