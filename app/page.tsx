"use client";

import React, { useState } from "react";
import { BoardColumn } from "@/components/BoardColumn";
import { useTasks } from "@/hooks/useTasks";
import { TaskModal } from "@/components/TaskModal";
import { Task } from "@/types/task";

export default function HomePage() {
  const { tasks, moveTask, updateTask, addTask } = useTasks();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openAddModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const scheduledTasks = tasks.filter((t) => t.status === "scheduled");
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress");
  const doneTasks = tasks.filter((t) => t.status === "done");

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Kanban Board</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={() => openAddModal()}
        >
          Add Task
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <BoardColumn
          title="Scheduled"
          tasks={scheduledTasks}
          onMoveTask={moveTask}
          onEditTask={openEditModal}
        />
        <BoardColumn
          title="In Progress"
          tasks={inProgressTasks}
          onMoveTask={moveTask}
          onEditTask={openEditModal}
        />
        <BoardColumn
          title="Done"
          tasks={doneTasks}
          onMoveTask={moveTask}
          onEditTask={openEditModal}
        />
      </div>

      {isModalOpen && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddTask={addTask}
          onUpdateTask={updateTask}
          taskToEdit={editingTask || undefined}
        />
      )}
    </div>
  );
}
