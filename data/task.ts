import { Task } from "../types/task";

export const sampleTasks: Task[] = [
  {
    id: "1",
    title: "Design Homepage Mockup",
    description:
      "Create initial wireframes and high-fidelity mockups for the new landing page.",
    status: "to-do",
    assignee: "Alice Monroe",
    tags: ["design", "ui"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Implement Authentication",
    description:
      "Set up JWT-based login and registration endpoints with proper validation.",
    status: "to-do",
    assignee: "Brian Chen",
    tags: ["backend", "security"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Integrate Payment Gateway",
    description:
      "Connect Stripe API and test payment flows for subscription plans.",
    status: "to-do",
    assignee: "Carla Reyes",
    tags: ["backend", "payment"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Write Blog Post: React Tips",
    description:
      "Draft an article covering advanced React hooks and performance optimizations.",
    status: "to-do",
    assignee: "David Kim",
    tags: ["content", "react"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Optimize Landing Page Images",
    description: "Compress and lazy-load images to improve page load speed.",
    status: "in-progress",
    assignee: "Emma Johnson",
    tags: ["frontend", "performance"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "6",
    title: "Set Up CI/CD Pipeline",
    description:
      "Configure GitHub Actions to run tests and deploy to staging automatically.",
    status: "in-progress",
    assignee: "Felix Zhang",
    tags: ["devops", "automation"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "7",
    title: "Create API Documentation",
    description:
      "Document all REST endpoints with Swagger and example responses.",
    status: "in-progress",
    assignee: "Gabriela Torres",
    tags: ["documentation", "backend"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "8",
    title: "User Feedback Survey",
    description:
      "Design and send out a survey to gather user feedback on the beta app.",
    status: "done",
    assignee: "Hector Ramirez",
    tags: ["research", "ux"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "9",
    title: "Fix Responsive Navbar",
    description:
      "Ensure the top navigation adapts correctly across all mobile devices.",
    status: "done",
    assignee: "Isabella Lee",
    tags: ["frontend", "bugfix"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "10",
    title: "Update Terms of Service",
    description: "Revise legal terms and include new privacy policy clauses.",
    status: "done",
    assignee: "Jackie Wong",
    tags: ["legal", "compliance"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "11",
    title: "Prepare Investor Presentation",
    description:
      "Create slides and visuals for upcoming investor pitch meeting.",
    status: "to-do",
    assignee: "Kevin Patel",
    tags: ["presentation", "business"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "12",
    title: "Research Competitor Pricing",
    description:
      "Analyze competitors' subscription tiers and prepare a report.",
    status: "in-progress",
    assignee: "Luna Garcia",
    tags: ["research", "strategy"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "13",
    title: "Brainstorm New Features",
    description: "Collect ideas for upcoming app versions and improvements.",
    status: "backlog",
    assignee: "Maya Singh",
    tags: ["planning", "brainstorm"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "14",
    title: "Research UI Trends",
    description: "Look into current design trends to inform UI decisions.",
    status: "backlog",
    assignee: "Noah Kim",
    tags: ["design", "research"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "15",
    title: "Organize Team Workshop",
    description: "Plan and schedule a workshop to improve team collaboration.",
    status: "backlog",
    assignee: "Olivia Martinez",
    tags: ["team", "planning"],
    createdAt: new Date().toISOString(),
  },
];
