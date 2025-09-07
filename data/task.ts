import { Task } from "../types/task";
import { TASK_STATUS } from "@/constants/taskStatus";

export const sampleTasks: Task[] = [
  {
    id: "1",
    title: "Design Homepage Mockup",
    description:
      "Create initial wireframes and high-fidelity mockups for the new landing page.",
    status: TASK_STATUS.SCHEDULED,
    assignee: "Alice Monroe",
    tags: ["design", "ui"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Implement Authentication",
    description:
      "Set up JWT-based login and registration endpoints with proper validation.",
    status: TASK_STATUS.SCHEDULED,
    assignee: "Brian Chen",
    tags: ["backend", "security"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Integrate Payment Gateway",
    description:
      "Connect Stripe API and test payment flows for subscription plans.",
    status: TASK_STATUS.SCHEDULED,
    assignee: "Carla Reyes",
    tags: ["backend", "payment"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Write Blog Post: React Tips",
    description:
      "Draft an article covering advanced React hooks and performance optimizations.",
    status: TASK_STATUS.SCHEDULED,
    assignee: "David Kim",
    tags: ["content", "react"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Optimize Landing Page Images",
    description: "Compress and lazy-load images to improve page load speed.",
    status: TASK_STATUS.IN_PROGRESS,
    assignee: "Emma Johnson",
    tags: ["frontend", "performance"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "6",
    title: "Set Up CI/CD Pipeline",
    description:
      "Configure GitHub Actions to run tests and deploy to staging automatically.",
    status: TASK_STATUS.IN_PROGRESS,
    assignee: "Felix Zhang",
    tags: ["devops", "automation"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "7",
    title: "Create API Documentation",
    description:
      "Document all REST endpoints with Swagger and example responses.",
    status: TASK_STATUS.IN_PROGRESS,
    assignee: "Gabriela Torres",
    tags: ["documentation", "backend"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "8",
    title: "User Feedback Survey",
    description:
      "Design and send out a survey to gather user feedback on the beta app.",
    status: TASK_STATUS.DONE,
    assignee: "Hector Ramirez",
    tags: ["research", "ux"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "9",
    title: "Fix Responsive Navbar",
    description:
      "Ensure the top navigation adapts correctly across all mobile devices.",
    status: TASK_STATUS.DONE,
    assignee: "Isabella Lee",
    tags: ["frontend", "bugfix"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "10",
    title: "Update Terms of Service",
    description: "Revise legal terms and include new privacy policy clauses.",
    status: TASK_STATUS.DONE,
    assignee: "Jackie Wong",
    tags: ["legal", "compliance"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "11",
    title: "Prepare Investor Presentation",
    description:
      "Create slides and visuals for upcoming investor pitch meeting.",
    status: TASK_STATUS.SCHEDULED,
    assignee: "Kevin Patel",
    tags: ["presentation", "business"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "12",
    title: "Research Competitor Pricing",
    description:
      "Analyze competitors' subscription tiers and prepare a report.",
    status: TASK_STATUS.IN_PROGRESS,
    assignee: "Luna Garcia",
    tags: ["research", "strategy"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "13",
    title: "Brainstorm New Features",
    description: "Collect ideas for upcoming app versions and improvements.",
    status: TASK_STATUS.BACKLOG,
    assignee: "Maya Singh",
    tags: ["planning", "brainstorm"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "14",
    title: "Research UI Trends",
    description: "Look into current design trends to inform UI decisions.",
    status: TASK_STATUS.BACKLOG,
    assignee: "Noah Kim",
    tags: ["design", "research"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "15",
    title: "Organize Team Workshop",
    description: "Plan and schedule a workshop to improve team collaboration.",
    status: TASK_STATUS.BACKLOG,
    assignee: "Olivia Martinez",
    tags: ["team", "planning"],
    createdAt: new Date().toISOString(),
  },
];
