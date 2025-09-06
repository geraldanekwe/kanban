import React, { useState } from "react";
import { Task } from "@/types/task";
import { Draggable } from "@hello-pangea/dnd";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

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
  const [isDragging, setIsDragging] = useState(false);

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => {
        const handleClick = () => {
          if (!snapshot.isDragging && !isDragging) {
            onClick?.();
          }
        };

        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={handleClick}
            onMouseDown={() => setIsDragging(false)}
            onMouseMove={() => setIsDragging(true)}
            className={`bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition relative cursor-pointer mb-4 border border-[#cbcbcb] ${
              snapshot.isDragging ? "ring-2 ring-blue-400" : ""
            }`}
          >
            <div className="absolute top-2 right-2 flex gap-2 mb-4">
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

            <h3 className="font-semibold text-lg text-gray-800 pt-2">
              {task.title}
            </h3>
            <p className="text-gray-600 text-sm mt-1">{task.description}</p>

            <div className="flex justify-between items-center mt-3">
              <span className="text-xs">
                <span className="text-black">Assigned to:</span>{" "}
                <span className="text-gray-500">{task.assignee}</span>
              </span>
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
          </div>
        );
      }}
    </Draggable>
  );
};
