import React from "react";
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
            className={`bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition relative cursor-pointer mb-4 border border-[#cbcbcb] ${
              snapshot.isDragging ? "ring-2 ring-blue-400 shadow-2xl" : ""
            }`}
            style={{
              ...provided.draggableProps.style,
              transform: snapshot.isDragging
                ? `${provided.draggableProps.style?.transform} rotate(5deg)`
                : provided.draggableProps.style?.transform,
            }}
          >
            <div className="absolute top-2 right-2 flex gap-2 mb-4">
              <button
                onClick={(e) =>
                  handleButtonClick(e, () => onOpenModal?.(task, "edit"))
                }
                className="text-gray-400 hover:text-purple-600 transition"
                aria-label="Edit Task"
                disabled={snapshot.isDragging}
              >
                <PencilSquareIcon className="h-5 w-5" />
              </button>

              <button
                onClick={(e) =>
                  handleButtonClick(e, () => onOpenModal?.(task, "delete"))
                }
                className="text-gray-400 hover:text-red-500 transition"
                aria-label="Delete Task"
                disabled={snapshot.isDragging}
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
