"use client";

import { useState, useCallback, useMemo } from "react";
import { Task } from "@/types/task";
import { TaskModalProps } from "@/types/modal";

interface UseTaskActionsProps {
  onAddTask: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  allTags: string[];
  allAssignees: string[];
}

export const useTaskActions = ({
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  allTags,
  allAssignees,
}: UseTaskActionsProps) => {
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

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleDeleteTask = useCallback(
    (task: Task) => {
      onDeleteTask(task.id);
    },
    [onDeleteTask]
  );

  const modalProps: TaskModalProps = useMemo(() => {
    const baseProps = {
      isOpen: isModalOpen,
      onClose: closeModal,
    };

    if (modalMode === "add") {
      return {
        ...baseProps,
        mode: modalMode,
        onAddTask,
        allTags,
        allAssignees,
      };
    }

    if (modalMode === "edit" && selectedTask) {
      return {
        ...baseProps,
        mode: modalMode,
        onUpdateTask,
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

    return {
      ...baseProps,
      mode: "add",
      onAddTask,
      allTags,
      allAssignees,
    };
  }, [
    isModalOpen,
    closeModal,
    modalMode,
    selectedTask,
    onAddTask,
    onUpdateTask,
    handleDeleteTask,
    allTags,
    allAssignees,
  ]);

  return {
    openAddModal,
    openEditModal,
    modalProps,
  };
};
