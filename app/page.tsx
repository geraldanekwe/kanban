"use client";

import React from "react";
import { BoardColumn } from "@/components/BoardColumn";
import { useTasks } from "@/hooks/useTasks";

export default function HomePage() {
  const { tasks, moveTask } = useTasks();

  const scheduledTasks = tasks.filter((t) => t.status === "scheduled");
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress");
  const doneTasks = tasks.filter((t) => t.status === "done");

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center md:text-left">
        Kanban Board
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        <BoardColumn
          title="Scheduled"
          tasks={scheduledTasks}
          onMoveTask={moveTask}
        />
        <BoardColumn
          title="In Progress"
          tasks={inProgressTasks}
          onMoveTask={moveTask}
        />
        <BoardColumn title="Done" tasks={doneTasks} onMoveTask={moveTask} />
      </div>
    </div>
  );
}
