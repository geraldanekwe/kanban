"use client";

import React, { useState, useMemo, useCallback } from "react";
import { BoardColumn } from "@/components/BoardColumn";
import { useTasks } from "@/hooks/useTasks";
import { TaskModal } from "@/components/TaskModal";
import { Task } from "@/types/task";
import { Filters } from "@/components/Filters";

export default function HomePage() {
  const {
    tasks,
    moveTask,
    updateTask,
    addTask,
    deleteTask,
    filters,
    setFilters,
  } = useTasks();

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

  const { scheduled, inProgress, done } = useMemo(() => {
    return tasks.reduce(
      (acc, task) => {
        if (task.status === "scheduled") acc.scheduled.push(task);
        else if (task.status === "in-progress") acc.inProgress.push(task);
        else if (task.status === "done") acc.done.push(task);
        return acc;
      },
      { scheduled: [] as Task[], inProgress: [] as Task[], done: [] as Task[] }
    );
  }, [tasks]);

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Kanban Board</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={openAddModal}
        >
          Add Task
        </button>
      </div>

      <Filters
        tasks={tasks}
        value={filters}
        onChange={(newFilters) => setFilters(newFilters)}
      />

      <div className="flex flex-col md:flex-row gap-6">
        <BoardColumn
          title="Scheduled"
          tasks={scheduled}
          onMoveTask={moveTask}
          onOpenModal={openEditModal}
        />
        <BoardColumn
          title="In Progress"
          tasks={inProgress}
          onMoveTask={moveTask}
          onOpenModal={openEditModal}
        />
        <BoardColumn
          title="Done"
          tasks={done}
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
