"use client";

import React, { useState, useMemo, useCallback } from "react";
import { BoardColumn } from "@/components/BoardColumn";
import { useTasks } from "@/hooks/useTasks";
import { TaskModal } from "@/components/TaskModal";
import { Task } from "@/types/task";
import { Filters } from "@/components/Filters";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";

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

  const { toDo, inProgress, done } = useMemo(() => {
    return tasks.reduce(
      (acc, task) => {
        if (task.status === "to-do") acc.toDo.push(task);
        else if (task.status === "in-progress") acc.inProgress.push(task);
        else if (task.status === "done") acc.done.push(task);
        return acc;
      },
      { toDo: [] as Task[], inProgress: [] as Task[], done: [] as Task[] }
    );
  }, [tasks]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      reorderTasks(
        source.droppableId as Task["status"],
        source.index,
        destination.index
      );
    } else {
      moveTask(
        draggableId,
        destination.droppableId as Task["status"],
        destination.index
      );
    }
  };

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

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col md:flex-row gap-6">
          <BoardColumn
            status="to-do"
            tasks={toDo}
            onOpenModal={openEditModal}
          />
          <BoardColumn
            status="in-progress"
            tasks={inProgress}
            onOpenModal={openEditModal}
          />
          <BoardColumn status="done" tasks={done} onOpenModal={openEditModal} />
        </div>
      </DragDropContext>

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
