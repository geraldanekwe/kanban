"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { TaskCard } from "@/components/TaskCard";
import { useTasks, TaskFilters } from "@/hooks/useTasks";
import { TaskModal } from "@/components/TaskModal";
import { Filters } from "@/components/Filters";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { Task } from "@/types/task";

export default function BacklogPage() {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    setFilters,
    filters,
    reorderTasks,
  } = useTasks("backlogTasks");
  const router = useRouter();

  const [modalMode, setModalMode] = useState<"add" | "edit" | "delete">("add");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const openModal = useCallback(
    (task: Task | null, mode: "add" | "edit" | "delete") => {
      setSelectedTask(task);
      setModalMode(mode);
      setIsModalOpen(true);
    },
    []
  );

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) return;
    reorderTasks("all", source.index, destination.index);
  };

  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    tasks.forEach((t) => t.tags.forEach((tag) => tagsSet.add(tag)));
    return Array.from(tagsSet);
  }, [tasks]);

  if (!mounted) {
    return <div className="p-6 text-gray-500">Loading...</div>;
  }

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

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="backlog">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`grid gap-4 ${
                snapshot.isDraggingOver ? "bg-blue-50 p-2 rounded" : ""
              }`}
            >
              {tasks.length === 0 ? (
                <p className="text-gray-500">
                  No tasks match the current filters.
                </p>
              ) : (
                tasks.map((task, index) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    index={index}
                    onOpenModal={(task, mode, e) => {
                      e?.stopPropagation();
                      openModal(task, mode);
                    }}
                    onClick={() => router.push(`/tasks/${task.id}`)}
                  />
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {isModalOpen && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddTask={addTask}
          onUpdateTask={updateTask}
          onDeleteTask={(task: Task) => deleteTask(task.id)}
          selectedTask={selectedTask}
          allTags={allTags}
          mode={modalMode}
        />
      )}
    </div>
  );
}
