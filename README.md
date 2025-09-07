# Kanban Task Management System

A modern, responsive task management application built with **Next.js 15.5.2**, featuring drag-and-drop functionality (`@hello-pangea/dnd`), real-time filtering, and persistent local storage.

---

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone [your-repo-url]
cd kanban

# Install dependencies
npm install
# or
yarn install

# Run the development server with Turbopack
npm run dev
# or
yarn dev

# Open http://localhost:3000 in your browser
```

### Build for Production

```bash
npm run build
npm run start
```

---

## Architecture Overview

### Routing Strategy

- **App Router (Next.js 15.5.2)**
- **Main routes:**
  - `/` - Main Kanban board with columns (Scheduled, In Progress, Done)
  - `/backlog` - List view of backlog tasks
  - `/tasks/[id]` - Dynamic route for individual task detail/edit pages

### State Management

- Local state with custom hooks (`useTasks()`) provides centralized task operations
- `localStorage` persistence - Tasks and filter preferences persist across sessions
- No external state library; using React's built-in state management

### Data Flow

```
Components → useTasks() → useLocalStorage() → localStorage
     ↑                                              ↓
UI Updates ←---- Task Operations ←---- Data Loading
```

### Component Architecture

- **Custom hooks:** `useTasks`, `useTaskActions`, `useLocalStorage` for logic separation
- **Presentational components:** `TaskCard`, `BoardColumn`, `Filters` focus purely on UI
- **Container components:** Pages orchestrate data and user interactions
- **Performance optimization:** `React.memo` on frequently re-rendered components

---

## Key Decisions & Tradeoffs

### State Management

- **Local Storage over External Database**
  - Requirement specified local storage
  - Simpler setup for assessment purposes
  - Real-world apps would use a proper backend
- **Custom State Management**
  - Scope didn't require complex state management
  - Custom hooks provide better type safety
  - Easier to understand and maintain at this scale

### UX/UI Decisions

- **Drag-and-drop with `@hello-pangea/dnd`**
  - Polished, accessible interactions
  - Handles escape key, touch devices, and edge cases
- **Modal confirmations for destructive actions**
  - Prevents accidental deletions

### Performance Optimizations

- `React.memo` on frequently updated components (`TaskCard`, `BoardColumn`, `TaskModal`)
- `useCallback` for stable event handler references
- `useMemo` for expensive computations (filtering, grouping)

### Accessibility & Performance Notes

**Performance Features:**

- Debounced search (300ms)

**Would Improve With More Time:**

- Ensure filter options for assignees and tags are always populated correctly
- Add Priority/Due Date on Tasks along with filtering for those fields
- Add error boundaries
- Bulk operations
- Export/Import
- Additional test coverage
- Smoother transition when deleting from Task Detail page

---

## Testing Approach

This application uses **React Testing Library** and **Jest** to ensure core functionality works as expected. The focus is on **manual testing supplemented by unit and integration tests for key flows**, prioritizing task operations and UI interactions.

**What Was Tested and Why:**

- **Task CRUD Operations** – Verified tasks can be created, edited, and deleted correctly via the `TaskModal`, ensuring the corresponding hooks (`addTask`, `updateTask`, `deleteTask`) are called with correct data.
- **Drag-and-Drop Behavior** – Ensured `moveTask` and `reorderTasks` functions are called correctly when tasks are moved between columns or reordered within a column.
- **Filtering** – Confirmed `setFilters` updates filters correctly to maintain expected filtering behavior.
- **Home Page Rendering** – Checked that column headers and the "Add Task" button render properly and that clicking "Add Task" opens the modal.
- **Modal Behavior** – Tested that the `TaskModal` opens and closes as expected, and that `onClose` callbacks are triggered after actions.

**Would Add With More Time:**

- **Unit Tests for Custom Hooks** – Deep tests for `useTasks`, `useTaskActions`, and `useLocalStorage` to cover edge cases, error handling, and persistence.
- **Integration Tests for User Flows** – Simulate full user flows across multiple components, including drag-and-drop between columns, bulk task actions, and filter combinations.
- **Component Tests for Complex Interactions** – Verify that `TaskCard` and `BoardColumn` handle drag state, click blocking during drags, and accessibility features correctly.
- **Accessibility & Keyboard Testing** – Ensure proper focus management, ARIA attributes, and keyboard navigation across all interactive elements.
- **Error Handling Tests** – Test scenarios such as localStorage failures, invalid task data, and network errors (if backend were added) to ensure graceful recovery.

---

## Time Spent

**Estimated:** 8 hours

**Breakdown:**

- Setup & Routing (0.5 hour)
- Core Components (2 hours)
- Drag & Drop Integration (0.5 hour)
- State Management (2 hours)
- Styling & Polish (2 hours)
- Testing & Refinement (1 hour)

---

## If I Had More Time…

### High Priority Features

- Search highlighting
- Task due dates
- Bulk operations
- Keyboard shortcuts
- Undo/redo

### Technical Improvements

- Comprehensive test suite
- Optimistic updates with rollback
- Performance monitoring

### UX Enhancements

- Advanced filtering (date ranges, multiple tags)
- Activity history
- Export functionality (CSV/JSON)
- Dark mode support

### Scaling Considerations

- Database integration
- User authentication
- API layer (REST/GraphQL)
- Caching strategy
