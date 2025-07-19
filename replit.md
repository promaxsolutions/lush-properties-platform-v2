# ProjectFlow - Project Management Dashboard

## Overview

ProjectFlow is a modern full-stack web application for project management and tracking. It features a React frontend with TypeScript, an Express.js backend, PostgreSQL database with Drizzle ORM, and a comprehensive UI built with shadcn/ui components. The application allows users to manage projects with financial tracking, file uploads, and real-time dashboard analytics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints under `/api/*`
- **File Handling**: Multer for multipart file uploads
- **Error Handling**: Centralized error middleware with proper HTTP status codes

### Data Storage
- **Database**: PostgreSQL (configured for Neon Database)
- **ORM**: Drizzle ORM with type-safe queries
- **Schema Management**: Drizzle Kit for migrations
- **Connection**: @neondatabase/serverless for serverless PostgreSQL connections
- **Fallback Storage**: In-memory storage implementation for development

## Key Components

### Database Schema
- **Users Table**: Authentication and user management
  - Fields: id, username, password
- **Projects Table**: Core project data with financial tracking
  - Fields: id, name, stage, loanApproved, drawn, cashSpent, outstanding, entityId, files

### API Endpoints
- `GET /api/projects` - Retrieve all projects
- `POST /api/projects` - Create new project with file upload support
- `PUT /api/projects/:id` - Update existing project
- `DELETE /api/projects/:id` - Remove project
- `GET /api/stats` - Dashboard statistics aggregation

### Frontend Pages
- **Dashboard**: Main project overview with statistics cards and project table
- **Project Management**: CRUD operations with modal forms
- **File Management**: Upload and associate files with projects

### UI Components
- **Sidebar**: Navigation with modern design
- **StatsCards**: Financial overview with formatted currency
- **ProjectsTable**: Searchable and filterable project list
- **ProjectModal**: Form-based project creation/editing with file upload

## Data Flow

1. **Client Requests**: React components use TanStack Query for API calls
2. **API Layer**: Express routes handle HTTP requests and validation
3. **Business Logic**: Controllers process data and interact with storage
4. **Data Persistence**: Drizzle ORM manages database operations
5. **Response**: JSON responses sent back to client
6. **UI Updates**: React Query automatically updates UI with fresh data

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Headless UI components
- **react-hook-form**: Form state management
- **zod**: Schema validation
- **multer**: File upload handling

### Development Tools
- **Vite**: Development server and build tool
- **TypeScript**: Type checking and compilation
- **Tailwind CSS**: Utility-first styling
- **ESLint/Prettier**: Code formatting and linting

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite compiles React app to static assets
2. **Backend Build**: esbuild bundles server code for production
3. **Assets**: Static files served from `dist/public`
4. **Database**: Drizzle migrations applied via `db:push`

### Environment Configuration
- **Development**: `npm run dev` with hot reload
- **Production**: `npm run build && npm start`
- **Database**: Requires `DATABASE_URL` environment variable
- **File Storage**: Local uploads directory with configurable limits

### Hosting Considerations
- **Static Assets**: Frontend served via Express static middleware
- **Database**: Configured for Neon Database (serverless PostgreSQL)
- **File Uploads**: Local file system storage (uploads/ directory)
- **Session Management**: connect-pg-simple for PostgreSQL session storage

## Development Notes

The application uses a monorepo structure with shared TypeScript types between client and server. The development server includes error overlay and live reloading via Vite plugins. File uploads are restricted to common document and image formats with a 10MB size limit. The UI follows a neutral color scheme with dark mode support through CSS variables.