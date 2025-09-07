"use client";
import React, { useMemo } from "react";
import { Task } from "@/types/task";
import { TASK_STATUS, TaskStatus } from "@/constants/taskStatus";
import { BoardColumn } from "@/components/BoardColumn";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";

interface KanbanBoardProps {
  tasks: Task[];
  onMoveTask: (taskId: string, newStatus: TaskStatus, newIndex: number) => void;
  onReorderTasks: (
    status: TaskStatus,
    fromIndex: number,
    toIndex: number
  ) => void;
  onOpenEditModal: (task: Task, mode: "edit" | "delete") => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onMoveTask,
  onReorderTasks,
  onOpenEditModal,
}) => {
  const { scheduled, inProgress, done } = useMemo(() => {
    return tasks.reduce(
      (acc, task) => {
        if (task.status === TASK_STATUS.SCHEDULED) acc.scheduled.push(task);
        else if (task.status === TASK_STATUS.IN_PROGRESS)
          acc.inProgress.push(task);
        else if (task.status === TASK_STATUS.DONE) acc.done.push(task);
        return acc;
      },
      { scheduled: [] as Task[], inProgress: [] as Task[], done: [] as Task[] }
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
      onReorderTasks(
        source.droppableId as TaskStatus,
        source.index,
        destination.index
      );
    } else {
      onMoveTask(
        draggableId,
        destination.droppableId as TaskStatus,
        destination.index
      );
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col md:flex-row gap-6">
        <BoardColumn
          status={TASK_STATUS.SCHEDULED}
          tasks={scheduled}
          onOpenModal={onOpenEditModal}
        />
        <BoardColumn
          status={TASK_STATUS.IN_PROGRESS}
          tasks={inProgress}
          onOpenModal={onOpenEditModal}
        />
        <BoardColumn
          status={TASK_STATUS.DONE}
          tasks={done}
          onOpenModal={onOpenEditModal}
        />
      </div>
    </DragDropContext>
  );
};
