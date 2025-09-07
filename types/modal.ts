import { Task } from "@/types/task";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AddTaskModalProps extends BaseModalProps {
  mode: "add";
  onAddTask: (task: Task) => void;
  allTags: string[];
  allAssignees: string[];
}

interface EditTaskModalProps extends BaseModalProps {
  mode: "edit";
  onUpdateTask: (task: Task) => void;
  selectedTask: Task;
  allTags: string[];
  allAssignees: string[];
}

interface DeleteTaskModalProps extends BaseModalProps {
  mode: "delete";
  onDeleteTask: (task: Task) => void;
  selectedTask: Task;
}

export type TaskModalProps =
  | AddTaskModalProps
  | EditTaskModalProps
  | DeleteTaskModalProps;

export type {
  BaseModalProps,
  AddTaskModalProps,
  EditTaskModalProps,
  DeleteTaskModalProps,
};
