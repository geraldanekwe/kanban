"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useTasks } from "@/hooks/useTasks";
import { Filters } from "@/components/Filters";
import { KanbanBoard } from "@/components/KanbanBoard";
import { TaskModal } from "@/components/TaskModal";
import { PageHeader } from "@/components/PageHeader";
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

  const allAssignees = useMemo(
    () => Array.from(new Set(tasks.map((t) => t.assignee))),
    [tasks]
  );

  const { openAddModal, openEditModal, modalProps } = useTaskActions({
    onAddTask: addTask,
    onUpdateTask: updateTask,
    onDeleteTask: deleteTask,
    allTags,
    allAssignees,
  });

  if (!mounted) {
    return <div className="p-6 text-gray-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 pt-20 px-6">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Kanban Board"
          subtitle="Organize and track your tasks efficiently"
          buttonText="+ Add Task"
          onButtonClick={openAddModal}
        />

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
