import React from "react";
import { useRouter } from "next/navigation";
import { Task } from "@/types/task";
import { TaskCard } from "./TaskCard";
import { Droppable } from "@hello-pangea/dnd";

interface BoardColumnProps {
  status: Task["status"];
  tasks: Task[];
  onOpenModal?: (task: Task, mode: "edit" | "delete") => void;
}

const BoardColumnComponent: React.FC<BoardColumnProps> = ({
  status,
  tasks,
  onOpenModal,
}) => {
  const router = useRouter();
  const displayTitle = status
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <Droppable droppableId={status}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`flex-1 p-4 rounded shadow min-h-[300px] transition ${
            snapshot.isDraggingOver ? "bg-blue-50" : "bg-gray-100"
          }`}
        >
          <h2 className="font-semibold text-xl text-black mb-4">
            {displayTitle}
          </h2>
          {tasks.length === 0 ? (
            <p className="text-gray-400 text-sm">No tasks here</p>
          ) : (
            tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onOpenModal={onOpenModal}
                onClick={() => router.push(`/tasks/${task.id}`)}
              />
            ))
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export const BoardColumn = React.memo(BoardColumnComponent);
BoardColumn.displayName = "BoardColumn";
