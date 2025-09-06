"use client";

import React, { useState, useMemo, useCallback } from "react";
import { BoardColumn } from "@/components/BoardColumn";
import { useTasks } from "@/hooks/useTasks";
import { TaskModal } from "@/components/TaskModal";
import { Task } from "@/types/task";

export default function HomePage() {
  const { tasks, moveTask, updateTask, addTask, deleteTask } = useTasks();

  const [modalMode, setModalMode] = useState<"add" | "edit" | "delete">("add");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openAddModal = useCallback(() => {
    setSelectedTask(null);
    setModalMode("add");
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((task: Task, mode: "edit" | "delete") => {
    setSelectedTask(task);
    setModalMode(mode);
    setIsModalOpen(true);
  }, []);

  const { scheduledTasks, inProgressTasks, doneTasks } = useMemo(() => {
    const scheduled: Task[] = [];
    const inProgress: Task[] = [];
    const done: Task[] = [];
    tasks.forEach((t) => {
      if (t.status === "scheduled") scheduled.push(t);
      else if (t.status === "in-progress") inProgress.push(t);
      else if (t.status === "done") done.push(t);
    });
    return {
      scheduledTasks: scheduled,
      inProgressTasks: inProgress,
      doneTasks: done,
    };
  }, [tasks]);

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Kanban Board</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={openAddModal}
        >
          Add Task
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <BoardColumn
          title="Scheduled"
          tasks={scheduledTasks}
          onMoveTask={moveTask}
          onOpenModal={openEditModal}
        />
        <BoardColumn
          title="In Progress"
          tasks={inProgressTasks}
          onMoveTask={moveTask}
          onOpenModal={openEditModal}
        />
        <BoardColumn
          title="Done"
          tasks={doneTasks}
          onMoveTask={moveTask}
          onOpenModal={openEditModal}
        />
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
