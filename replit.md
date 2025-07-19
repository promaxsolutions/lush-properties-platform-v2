# ProjectFlow - Project Management Dashboard

## Overview

ProjectFlow is a modern full-stack web application for project management and tracking. It features a React frontend with TypeScript, an Express.js backend, and comprehensive project tracking capabilities. The application includes an enhanced dashboard with progress tracking, charts, and real-time project stage management. The current implementation uses the existing TypeScript/Vite architecture with an upgraded dashboard component featuring progress bars, charts, and improved project management workflows.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React useState hooks for local state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Charts**: Recharts for data visualization and progress tracking
- **Form Handling**: Controlled components with React state

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: JavaScript with CommonJS modules
- **API Design**: RESTful API endpoints (to be implemented)
- **File Handling**: Multer for file uploads (to be configured)
- **Error Handling**: Basic Express error handling

### Data Storage
- **Database**: MongoDB (connection to be configured)
- **ODM**: Mongoose for object document mapping
- **Schema Management**: Mongoose schemas for data validation
- **Connection**: Standard MongoDB connection via mongoose
- **Models**: Company, Project, and Transaction schemas defined

## Key Components

### Database Schema
- **Company Model**: Company information and details
  - Fields: name, abn, email, bankAccount, parentCompany
- **Project Model**: Core project data with financial tracking
  - Fields: projectId, stage, amount, lenderTemplate, status
- **Transaction Model**: Financial transaction records
  - Fields: projectId, type, amount, paidVia, reference, receipt

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

## Recent Changes

- Deployed complete upgrade bundle with 5 new advanced components (July 19, 2025):
  * ContractUpload.tsx - PDF contract parser with auto data extraction
  * ProfitCalculator.tsx - Real-time profit analysis with charts and ROI tracking
  * BuilderPortal.tsx - Builder submission system with admin approval workflow
  * ClientUpgradePanel.tsx - Client upgrade request management with quoting
  * HeatmapVisualizer.tsx - Financial health dashboard with risk assessment
- Enhanced main dashboard with visible role switcher and smart alerts system
- Integrated all new components into App.tsx routing (/contracts, /profits, /builder, /client-upgrades, /heatmap)
- Added comprehensive role-based testing functionality (Admin, Builder, Client, Investor)
- Enhanced mobile optimization with comprehensive data sync capabilities and offline functionality
- Added real-time sync status indicators with online/offline detection and queue management
- Implemented offline-first architecture with automatic sync when connection returns
- Created mobile navigation helper with auto-hide functionality for touch devices
- Enhanced push notification system for sync status updates and offline mode alerts
- Added advanced mobile camera integration for receipt capture with environment camera access
- Implemented AI-powered OCR processing for mobile-captured receipt images
- Created real-time camera preview with auto-capture functionality and confidence scoring
- Enhanced mobile receipt workflow with capture, preview, and processing capabilities
- Added mobile-optimized notification system for camera operations and receipt processing
- Enhanced mobile optimization with responsive design and touch-friendly interfaces
- Added mobile-first UI with flexible text sizing and compressed layouts
- Implemented adaptive button text that shows icons on mobile and full text on desktop
- Created sticky header and footer for improved mobile navigation
- Added comprehensive mobile notifications for all user actions and system updates
- Added Google Maps integration with clickable project address links
- Implemented push notifications for milestone reminders and system updates
- Enhanced calendar with notification-triggered event reminders
- Added real-time map link generation for all project addresses
- Created notification system for upload confirmations and request submissions
- Enhanced UI with polished header design and improved mobile responsiveness
- Added builder upload tools for progress photos, quotes, and inspection reports
- Implemented client upgrade request system with detailed requirement tracking
- Created enhanced project status display with next milestone indicators and progress bars
- Added role-specific functionality for builders (uploads) and clients (upgrade requests)
- Added investor funding portal with AI fundability assessment and proposal submission
- Implemented builder/agent onboarding system with role-based invitation management
- Created AI-powered project analysis with location, budget, and market condition scoring
- Enhanced admin capabilities with comprehensive user invitation and onboarding workflows
- Added automated email invitation system with secure invite links and expiration tracking
- Added export functionality and investor portal capabilities with project pack downloads
- Implemented mobile PWA features with installation instructions and progressive web app support
- Enhanced role-based access control to include investor role with filtered project views
- Created PDF export system for comprehensive project reports with financial summaries
- Added mobile-optimized footer with PWA installation guidance and investor portal indicators
- Added scheduling and forecasting capabilities with interactive calendar
- Implemented inspection tracker with milestone management
- Created builder spend breakdown visualization with pie charts
- Enhanced calendar integration with event scheduling and notifications
- Added upcoming events display with project-specific scheduling
- Enhanced mobile camera support for receipt uploads with environment capture
- Fixed Chart.js filler plugin registration for timeline charts
- Added mobile-optimized receipt scanning with confidence metrics
- Implemented mobile-friendly file upload interface with camera integration
- Enhanced receipt processing with mobile scanning API endpoint
- Added client build tracker capabilities with role-based project filtering
- Implemented receipt management system with editable expense tracking
- Created client-specific dashboard views (clients see only their projects)
- Added comprehensive receipt history with inline editing capabilities
- Enhanced role-based access control for builders, clients, and administrators
- Added receipt upload functionality with AI-powered OCR parsing
- Implemented Xero financial integration for automated expense tracking
- Created comprehensive file upload system with progress indicators
- Added automated receipt processing with vendor and amount extraction
- Enhanced backend with receipt parsing and Xero sync API endpoints
- Added AI-powered "Next Step" recommendations with stage-specific guidance
- Enhanced UX with personalized welcome message and real-time clock display
- Implemented role-based project filtering and expanded user roles (builder, accountant)
- Added internal notification system for AI-generated project recommendations
- Created mobile-responsive design with flexible text sizing and layouts
- Enhanced authentication with role-based access control (admin, broker, solicitor, builder, accountant roles)
- Added AI-powered reminder system with automated email generation
- Implemented professional claims API with backend integration and tracking
- Created role-specific action buttons with conditional visibility
- Added email API endpoint for automated contractor notifications
- Enhanced AI chat to generate professional reminder emails and next step guidance
- Added interactive Chart.js visualizations with equity overview and progress timeline
- Implemented functional "Raise Claim" buttons with project-specific claim generation
- Enhanced dashboard with dual chart layout showing financial comparisons and progress trends
- Integrated Chart.js with responsive bar and line charts for comprehensive project analysis
- Enhanced project cards with role-based editing capabilities for admin users
- Added inline editing for project names and deposit amounts with save/cancel functionality
- Integrated AI profit analysis feature with contextual project data and auto-loading insights
- Implemented clickable Google Maps links for all project addresses
- Added user deposit tracking with updated net equity calculations
- Created visual AI tip display with green highlighting and lightbulb icons
- Added floating AI chat widget with intelligent project assistance
- Created expandable chat interface with example prompts and conversation history
- Integrated AI assistant for project management tasks (uploads, claims, summaries)
- Upgraded to premium billionaire-grade dashboard with comprehensive financial overview
- Added 6 key financial metrics including Total Deposits ($230K)
- Created modern sidebar navigation with role-based access control
- Added Settings page with role-specific tools (admin, broker, solicitor)
- Implemented comprehensive authentication system with mock Firebase
- Built document upload system and progress claims generation
- Integrated Xero financial system mockup with connection status

## Development Notes

The application uses a monorepo structure with shared TypeScript types between client and server. The development server includes error overlay and live reloading via Vite plugins. File uploads are restricted to common document and image formats with a 10MB size limit. The UI follows a neutral color scheme with dark mode support through CSS variables. Authentication is currently mocked for demo purposes but can be easily replaced with real Firebase configuration.