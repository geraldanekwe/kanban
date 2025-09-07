"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useTasks } from "@/hooks/useTasks";
import { Filters } from "@/components/Filters";
import { KanbanBoard } from "@/components/KanbanBoard";
import { TaskModal } from "@/components/TaskModal";
import { useTaskActions } from "@/hooks/useTaskActions";

export default function HomePage() {
  const {
    tasks,
    moveTask,
    reorderTasks,
    updateTask,
    addTask,
    deleteTask,
    filters,
    setFilters,
  } = useTasks();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    tasks.forEach((t) => t.tags.forEach((tag) => tagsSet.add(tag)));
    return Array.from(tagsSet);
  }, [tasks]);

  const { openAddModal, openEditModal, modalProps } = useTaskActions({
    onAddTask: addTask,
    onUpdateTask: updateTask,
    onDeleteTask: deleteTask,
    allTags,
  });

  if (!mounted) {
    return <div className="p-6 text-gray-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 pt-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8
        bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl"
        >
          <div>
            <h1
              className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600
            bg-clip-text text-transparent mb-2"
            >
              Kanban Board
            </h1>
            <p className="text-gray-600">
              Organize and track your tasks efficiently
            </p>
          </div>
          <button
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3
            rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200
            shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
            onClick={openAddModal}
          >
            + Add Task
          </button>
        </div>

        <div className="mb-8">
          <Filters tasks={tasks} value={filters} onChange={setFilters} />
        </div>

        <KanbanBoard
          tasks={tasks}
          onMoveTask={moveTask}
          onReorderTasks={reorderTasks}
          onOpenEditModal={openEditModal}
        />

        {modalProps.isOpen && <TaskModal {...modalProps} />}
      </div>
    </div>
  );
}
