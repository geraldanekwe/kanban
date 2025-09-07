import React from "react";
import { useRouter } from "next/navigation";
import { Task } from "@/types/task";
import { TaskCard } from "./TaskCard";
import { Droppable } from "@hello-pangea/dnd";
import { TaskStatus, TASK_STATUS } from "@/constants/taskStatus";
import {
  CalendarDaysIcon,
  BoltIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

interface BoardColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onOpenModal?: (task: Task, mode: "edit" | "delete") => void;
}

export const BoardColumn: React.FC<BoardColumnProps> = ({
  status,
  tasks,
  onOpenModal,
}) => {
  const router = useRouter();

  const columnConfig: Partial<
    Record<
      TaskStatus,
      {
        title: string;
        color: string;
        gradient: string;
        bgColor: string;
        borderColor: string;
        icon: React.ElementType;
      }
    >
  > = {
    [TASK_STATUS.SCHEDULED]: {
      title: "Scheduled",
      color: "blue",
      gradient: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      icon: CalendarDaysIcon,
    },
    [TASK_STATUS.IN_PROGRESS]: {
      title: "In Progress",
      color: "yellow",
      gradient: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      icon: BoltIcon,
    },
    [TASK_STATUS.DONE]: {
      title: "Done",
      color: "green",
      gradient: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      icon: CheckCircleIcon,
    },
  };

  const config = columnConfig[status];

  if (!config) {
    return null;
  }

  return (
    <Droppable droppableId={status}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`flex-1 rounded-2xl transition-all duration-300 min-h-[500px] ${
            snapshot.isDraggingOver
              ? `${config.bgColor} ${config.borderColor} border-2 border-dashed shadow-lg`
              : "bg-gray-50/50 border border-gray-200"
          }`}
        >
          <div
            className={`p-4 rounded-t-2xl bg-gradient-to-r ${config.gradient}`}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-white text-lg flex items-center gap-2">
                <config.icon className="h-5 w-5" />
                {config.title}
              </h2>
              <span className="bg-white/20 text-white text-sm px-2 py-1 rounded-full font-medium">
                {tasks.length}
              </span>
            </div>
          </div>

          <div className="p-4 space-y-3">
            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-2 opacity-50">📭</div>
                <p className="text-gray-500 font-medium">No tasks here</p>
                <p className="text-gray-400 text-sm">
                  Drag tasks here or create new ones
                </p>
              </div>
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
        </div>
      )}
    </Droppable>
  );
};
