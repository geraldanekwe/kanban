import React from "react";
import { Task } from "@/types/task";

interface TaskCardProps {
  task: Task;
  onMove?: (taskId: string, newStatus: Task["status"]) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onMove }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4 hover:shadow-lg transition-shadow">
      <h3 className="font-semibold text-lg text-gray-800">{task.title}</h3>
      <p className="text-gray-600 text-sm mt-1">{task.description}</p>
      <div className="flex justify-between items-center mt-3">
        <span className="text-xs text-gray-500">{task.assignee}</span>
        <div className="flex gap-1 flex-wrap">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-black bg-gray-200 rounded-full px-2 py-0.5"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {onMove && (
        <div className="flex justify-between mt-3 flex-wrap gap-2">
          {task.status !== "scheduled" && (
            <button
              className="text-sm text-blue-600 hover:underline"
              onClick={() => onMove(task.id, "scheduled")}
            >
              Move to Scheduled
            </button>
          )}
          {task.status !== "in-progress" && (
            <button
              className="text-sm text-yellow-600 hover:underline"
              onClick={() => onMove(task.id, "in-progress")}
            >
              Move to In Progress
            </button>
          )}
          {task.status !== "done" && (
            <button
              className="text-sm text-green-600 hover:underline"
              onClick={() => onMove(task.id, "done")}
            >
              Move to Done
            </button>
          )}
        </div>
      )}
    </div>
  );
};
