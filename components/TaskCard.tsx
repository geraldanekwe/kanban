import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import React from "react";
import { Task } from "@/types/task";

interface TaskCardProps {
  task: Task;
  onMove?: (taskId: string, newStatus: Task["status"]) => void;
  onOpenModal?: (
    task: Task,
    mode: "edit" | "delete",
    e?: React.MouseEvent
  ) => void;
  onClick?: () => void;
}

const TaskCardComponent: React.FC<TaskCardProps> = ({
  task,
  onMove,
  onOpenModal,
  onClick,
}) => {
  const { id, title, description, status, assignee, tags } = task;

  return (
    <div
      onClick={onClick}
      className="bg-white p-4 rounded-lg shadow-md mb-4 hover:shadow-lg transition-shadow relative cursor-pointer"
    >
      <div className="absolute top-2 right-2 flex gap-2">
        <button
          onClick={(e) => onOpenModal?.(task, "edit", e)}
          className="text-gray-400 hover:text-purple-600 transition"
          aria-label="Edit Task"
        >
          <PencilSquareIcon className="h-5 w-5" />
        </button>

        <button
          onClick={(e) => onOpenModal?.(task, "delete", e)}
          className="text-gray-400 hover:text-red-500 transition"
          aria-label="Delete Task"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>

      <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
      <p className="text-gray-600 text-sm mt-1">{description}</p>

      <div className="flex justify-between items-center mt-3">
        <span className="text-xs">
          <span className="text-black">Assigned to:</span>{" "}
          <span className="text-gray-500">{assignee}</span>
        </span>
        <div className="flex gap-1 flex-wrap">
          {tags.map((tag) => (
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
          {status !== "scheduled" && (
            <button
              className="text-sm text-blue-600 hover:underline cursor-pointer"
              onClick={() => onMove(id, "scheduled")}
            >
              Move to Scheduled
            </button>
          )}
          {status !== "in-progress" && (
            <button
              className="text-sm text-yellow-600 hover:underline cursor-pointer"
              onClick={() => onMove(id, "in-progress")}
            >
              Move to In Progress
            </button>
          )}
          {status !== "done" && (
            <button
              className="text-sm text-green-600 hover:underline cursor-pointer"
              onClick={() => onMove(id, "done")}
            >
              Move to Done
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export const TaskCard = React.memo(TaskCardComponent);
TaskCard.displayName = "TaskCard";
