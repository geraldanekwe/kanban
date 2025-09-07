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
import { TaskModalProps } from "@/types/modal";
import { TASK_STATUS } from "@/constants/taskStatus";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

export default function BacklogPage() {
  const {
    tasks,
    rawTasks,
    addTask,
    updateTask,
    deleteTask,
    setFilters,
    filters,
    reorderTasks,
  } = useTasks("backlog");
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

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) return;
    reorderTasks(TASK_STATUS.BACKLOG, source.index, destination.index);
  };

  const allAssignees = useMemo(
    () => Array.from(new Set(rawTasks.map((t) => t.assignee))),
    [rawTasks]
  );

  const allTags = useMemo(
    () => [...new Set(rawTasks.flatMap((t) => t.tags))],
    [rawTasks]
  );

  const handleDeleteTask = useCallback(
    (task: Task) => {
      deleteTask(task.id);
    },
    [deleteTask]
  );

  const modalProps: TaskModalProps | null = useMemo(() => {
    if (!isModalOpen) return null;

    const baseProps = {
      isOpen: isModalOpen,
      onClose: closeModal,
    };

    if (modalMode === "add") {
      return {
        ...baseProps,
        mode: modalMode,
        onAddTask: addTask,
        allTags,
        allAssignees,
      };
    }

    if (modalMode === "edit" && selectedTask) {
      return {
        ...baseProps,
        mode: modalMode,
        onUpdateTask: updateTask,
        selectedTask,
        allTags,
        allAssignees,
      };
    }

    if (modalMode === "delete" && selectedTask) {
      return {
        ...baseProps,
        mode: modalMode,
        onDeleteTask: handleDeleteTask,
        selectedTask,
      };
    }

    return null;
  }, [
    isModalOpen,
    closeModal,
    modalMode,
    selectedTask,
    addTask,
    updateTask,
    handleDeleteTask,
    allTags,
    allAssignees,
  ]);

  const backlogTasks = tasks.filter(
    (task) => task.status === TASK_STATUS.BACKLOG
  );

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <PageHeader
        title="Backlog"
        buttonText="Add Task"
        onButtonClick={() => openModal(null, "add")}
      />

      <Filters
        allAssignees={allAssignees}
        allTags={allTags}
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
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircleIcon className="w-12 h-12 text-green-600" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    All caught up!
                  </h3>

                  <p className="text-gray-500 text-center max-w-md mb-8">
                    Your backlog is empty. You&apos;ve either completed all your
                    tasks or haven&apos;t created any yet. Add tasks to populate
                    the backlog.
                  </p>
                </div>
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

      {modalProps && <TaskModal {...modalProps} />}
    </div>
  );
}
