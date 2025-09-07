// __tests__/HomePage.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HomePage from "@/app/page";
import { useTasks } from "@/hooks/useTasks";
import { TaskModal } from "@/components/TaskModal";
import { ToastProvider } from "@/components/ToastProvider";
import { useRouter } from "next/navigation";
import { mockTasks, mockTaskFunctions } from "../__mocks__/taskMocks";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({ push: mockPush });

jest.mock("@/hooks/useTasks");
const mockedUseTasks = useTasks as jest.MockedFunction<typeof useTasks>;

jest.mock("@/components/TaskModal", () => ({
  TaskModal: jest.fn((props: Record<string, unknown>) => (
    <div data-testid="task-modal">{props.isOpen ? "open" : "closed"}</div>
  )),
}));

describe("HomePage", () => {
  beforeEach(() => {
    mockedUseTasks.mockReturnValue({
      tasks: mockTasks,
      filters: { text: "", assignee: "", tag: "" },
      ...mockTaskFunctions,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders column headers and Add Task button", () => {
    render(
      <ToastProvider>
        <HomePage />
      </ToastProvider>
    );

    expect(screen.getByText("Kanban Board")).toBeInTheDocument();
    expect(screen.getByText("Add Task")).toBeInTheDocument();
    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.getByText("Done")).toBeInTheDocument();
  });

  it("opens Add Task modal when clicking Add Task", async () => {
    render(
      <ToastProvider>
        <HomePage />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText("Add Task"));

    await waitFor(() => {
      expect(TaskModal).toHaveBeenCalledWith(
        expect.objectContaining({ mode: "add", isOpen: true }),
        expect.anything()
      );
    });
  });
});
