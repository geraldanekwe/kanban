import React from "react";
import { Task } from "@/types/task";
import { Draggable } from "@hello-pangea/dnd";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { TASK_STATUS } from "@/constants/taskStatus";

interface TaskCardProps {
  task: Task;
  index: number;
  onOpenModal?: (
    task: Task,
    mode: "edit" | "delete",
    e?: React.MouseEvent
  ) => void;
  onClick?: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  index,
  onOpenModal,
  onClick,
}) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => {
        const handleClick = (e: React.MouseEvent) => {
          if (snapshot.isDragging) {
            e.preventDefault();
            return;
          }
          onClick?.();
        };

        const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
          e.stopPropagation();
          if (snapshot.isDragging) {
            e.preventDefault();
            return;
          }
          action();
        };

        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={handleClick}
            className={`group relative bg-white rounded-xl shadow-sm border border-gray-100 
              hover:shadow-xl hover:border-blue-200 transition-all duration-300 cursor-pointer mb-4
              transform hover:-translate-y-1 ${
                snapshot.isDragging
                  ? "ring-2 ring-blue-400 shadow-2xl scale-105 rotate-3"
                  : ""
              }`}
            style={provided.draggableProps.style}
          >
            <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-xl" />

            <div className="p-5">
              <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) =>
                    handleButtonClick(e, () => onOpenModal?.(task, "edit"))
                  }
                  className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                  aria-label="Edit Task"
                  disabled={snapshot.isDragging}
                >
                  <PencilSquareIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) =>
                    handleButtonClick(e, () => onOpenModal?.(task, "delete"))
                  }
                  className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                  aria-label="Delete Task"
                  disabled={snapshot.isDragging}
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>

              <h3 className="font-semibold text-lg text-gray-900 mb-2 pr-20 line-clamp-2">
                {task.title}
              </h3>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                {task.description}
              </p>

              {task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {task.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full 
                    flex items-center justify-center text-white text-xs font-medium"
                  >
                    {task.assignee.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-600 font-medium">
                    {task.assignee}
                  </span>
                </div>

                <div
                  className={`w-3 h-3 rounded-full ${
                    task.status === TASK_STATUS.DONE
                      ? "bg-green-400"
                      : task.status === TASK_STATUS.IN_PROGRESS
                      ? "bg-yellow-400"
                      : task.status === TASK_STATUS.SCHEDULED
                      ? "bg-blue-400"
                      : "bg-gray-400"
                  }`}
                />
              </div>
            </div>
          </div>
        );
      }}
    </Draggable>
  );
};
