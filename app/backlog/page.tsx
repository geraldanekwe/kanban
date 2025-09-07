"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { TaskCard } from "@/components/TaskCard";
import { useTasks, TaskFilters } from "@/hooks/useTasks";
import { TaskModal } from "@/components/TaskModal";
import { PageHeader } from "@/components/PageHeader";
import { Filters } from "@/components/Filters";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { Task } from "@/types/task";
import { TASK_STATUS } from "@/constants/taskStatus";

export default function BacklogPage() {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    setFilters,
    filters,
    reorderTasks,
  } = useTasks();
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
    reorderTasks(TASK_STATUS.BACKLOG, source.index, destination.index);
  };

  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    tasks.forEach((t) => t.tags.forEach((tag) => tagsSet.add(tag)));
    return Array.from(tagsSet);
  }, [tasks]);

  const backlogTasks = tasks.filter(
    (task) => task.status === TASK_STATUS.BACKLOG
  );
  if (!mounted) {
    return <div className="p-6 text-gray-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <PageHeader
        title="Backlog"
        buttonText="Add Task"
        onButtonClick={() => openModal(null, "add")}
      />

      <Filters
        tasks={tasks}
        value={filters}
        onChange={(newFilters: TaskFilters) => setFilters(newFilters)}
      />

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={TASK_STATUS.BACKLOG}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`mt-8 grid gap-4 ${
                snapshot.isDraggingOver ? "bg-blue-50 p-2 rounded" : ""
              }`}
            >
              {backlogTasks.length === 0 ? (
                <p className="text-gray-500">Hurray! Nothing in the backlog.</p>
              ) : (
                backlogTasks.map((task, index) => (
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
