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

      <Filters tasks={tasks} value={filters} onChange={setFilters} />

      <KanbanBoard
        tasks={tasks}
        onMoveTask={moveTask}
        onReorderTasks={reorderTasks}
        onOpenEditModal={openEditModal}
      />

      {modalProps.isOpen && <TaskModal {...modalProps} />}
    </div>
  );
}
