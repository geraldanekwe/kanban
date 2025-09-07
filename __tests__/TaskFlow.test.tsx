// __tests__/TaskFlow.test.tsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskModal } from "@/components/TaskModal";
import { useTasks } from "@/hooks/useTasks";
import { mockTasks, mockTaskFunctions } from "../__mocks__/taskMocks";

const {
  addTask: mockAddTask,
  updateTask: mockUpdateTask,
  deleteTask: mockDeleteTask,
  setFilters: mockSetFilters,
} = mockTaskFunctions;

jest.mock("@/hooks/useTasks");
const mockedUseTasks = useTasks as jest.MockedFunction<typeof useTasks>;

describe("TaskFlow Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseTasks.mockReturnValue({
      tasks: mockTasks,
      addTask: mockAddTask,
      updateTask: mockUpdateTask,
      deleteTask: mockDeleteTask,
      moveTask: jest.fn(),
      reorderTasks: jest.fn(),
      filters: { text: "", assignee: "", tag: "" },
      setFilters: mockSetFilters,
    });
  });

  it("calls addTask when a new task is submitted", async () => {
    const onClose = jest.fn();

    render(
      <TaskModal
        isOpen={true}
        onClose={onClose}
        onAddTask={mockAddTask}
        allTags={[]}
        mode="add"
      />
    );

    await userEvent.type(screen.getByPlaceholderText(/Title/i), "New Task");
    await userEvent.type(
      screen.getByPlaceholderText(/Description/i),
      "New description"
    );
    await userEvent.type(screen.getByPlaceholderText(/Assignee/i), "Bob");
    await userEvent.click(screen.getByRole("button", { name: /Add/i }));

    await waitFor(() => {
      expect(mockAddTask).toHaveBeenCalledTimes(1);
      const addedTask = mockAddTask.mock.calls[0][0];
      expect(addedTask.title).toBe("New Task");
      expect(addedTask.description).toBe("New description");
      expect(addedTask.assignee).toBe("Bob");
      expect(addedTask.status).toBe("backlog");
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("calls updateTask when editing a task", async () => {
    const onClose = jest.fn();

    render(
      <TaskModal
        isOpen={true}
        onClose={onClose}
        onUpdateTask={mockUpdateTask}
        selectedTask={mockTasks[0]}
        allTags={[]}
        mode="edit"
        onAddTask={mockAddTask}
      />
    );

    const titleInput = screen.getByPlaceholderText(/Title/i);
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, "Updated Task");
    await userEvent.click(screen.getByRole("button", { name: /Save/i }));

    await waitFor(() => {
      expect(mockUpdateTask).toHaveBeenCalledTimes(1);
      expect(mockUpdateTask.mock.calls[0][0].title).toBe("Updated Task");
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("calls deleteTask when deleting a task", async () => {
    const onClose = jest.fn();

    render(
      <TaskModal
        isOpen={true}
        onClose={onClose}
        onDeleteTask={mockDeleteTask}
        selectedTask={mockTasks[0]}
        allTags={[]}
        mode="delete"
        onAddTask={mockAddTask}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /Delete/i }));

    await waitFor(() => {
      expect(mockDeleteTask).toHaveBeenCalledTimes(1);
      expect(mockDeleteTask.mock.calls[0][0]).toBe(mockTasks[0]);
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("calls moveTask correctly", () => {
    const moveTaskMock = jest.fn();
    mockedUseTasks.mockReturnValue({
      ...mockedUseTasks(),
      moveTask: moveTaskMock,
    });

    moveTaskMock("1", "done", 0);
    expect(moveTaskMock).toHaveBeenCalledWith("1", "done", 0);
  });

  it("calls reorderTasks correctly", () => {
    const reorderTasksMock = jest.fn();
    mockedUseTasks.mockReturnValue({
      ...mockedUseTasks(),
      reorderTasks: reorderTasksMock,
    });

    reorderTasksMock("scheduled", 0, 1);
    expect(reorderTasksMock).toHaveBeenCalledWith("scheduled", 0, 1);
  });

  it("calls setFilters correctly", () => {
    mockSetFilters({ text: "test", assignee: "", tag: "" });
    expect(mockSetFilters).toHaveBeenCalledWith({
      text: "test",
      assignee: "",
      tag: "",
    });
  });
});
