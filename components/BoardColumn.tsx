import React from "react";
import { Task } from "@/types/task";
import { TaskCard } from "./TaskCard";

interface BoardColumnProps {
  title: string;
  tasks: Task[];
  onMoveTask?: (taskId: string, newStatus: Task["status"]) => void;
}

export const BoardColumn: React.FC<BoardColumnProps> = ({
  title,
  tasks,
  onMoveTask,
}) => {
  return (
    <div className="flex-1 p-4 rounded shadow min-h-[300px] bg-gray-100">
      <h2 className="font-semibold text-xl text-black mb-4">{title}</h2>
      {tasks.length === 0 ? (
        <p className="text-gray-400 text-sm">No tasks here</p>
      ) : (
        tasks.map((task) => (
          <TaskCard key={task.id} task={task} onMove={onMoveTask} />
        ))
      )}
    </div>
  );
};
