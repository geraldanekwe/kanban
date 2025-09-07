"use client";
import { useState, useCallback } from "react";
import { Task } from "@/types/task";

interface UseTaskActionsProps {
  onAddTask: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  allTags: string[];
}

export const useTaskActions = ({
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  allTags,
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
      onDeleteTask(task.id); // Convert Task to ID here
    },
    [onDeleteTask]
  );

  const modalProps = {
    isOpen: isModalOpen,
    onClose: closeModal,
    onAddTask,
    onUpdateTask,
    onDeleteTask: handleDeleteTask,
    selectedTask,
    allTags,
    mode: modalMode,
  };

  return {
    openAddModal,
    openEditModal,
    modalProps,
  };
};
