# CLAUDE.md - Agent Reference Guide

## Build/Lint/Test Commands
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Code Style Guidelines
- **TypeScript**: Use strict typing with explicit interfaces for props and types
- **Components**: Functional components with Pascal case naming (TaskItem, TaskList)
- **Variables/Functions**: Camel case for all variables and functions
- **Hooks**: Follow React naming convention (useTasks)
- **Styling**: TailwindCSS for all styling needs
- **Formatting**: Consistent indentation (2 spaces) and line breaks
- **Imports**: Group React imports first, followed by components, hooks, then utilities
- **Error Handling**: Use try/catch for async operations, provide user-friendly error messages
- **Component Structure**: Clear separation of concerns between components
- **Props**: Define interfaces for component props with descriptive naming

This project uses Next.js 15 with React 19 and follows modern React best practices.
