# Lush Properties Pty Ltd - Property Project Management Platform

## Overview

Lush Properties Pty Ltd is a sophisticated full-stack web application designed for premium property development and construction project management. It features a React frontend with TypeScript, an Express.js backend, and comprehensive project tracking capabilities with AI-powered insights. The application provides automated claims processing, intelligent workflow automation, secure file management, and real-time project stage management. Built with premium design and mobile-first architecture for construction teams, builders, clients, and investors.

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

- **Complete Application Rebranding (July 21, 2025)**: Successfully rebranded entire application from "Lush OS" to "Lush Properties Pty Ltd" across all components, references, and branding elements:
  * Updated login page title and logo branding with responsive design
  * Modified sidebar header and navigation branding throughout application
  * Updated HTML page title, meta description, and PWA manifest with new brand identity
  * Changed theme color from blue (#007bff) to Lush brand green (#007144) in PWA configuration
  * Updated all email notification templates and reminder system branding
  * Modified WhatsApp notification templates with new Pty Ltd branding
  * Updated service worker cache naming and mobile status bar references
  * Modified footer text and layout component branding across all views
  * Updated replit.md documentation with new brand name and description
  * Maintained all existing functionality, UI/UX polish, and mobile-first design while applying consistent "Lush Properties Pty Ltd" branding
  * Preserved premium brand theme with deep green primary (#007144) and gold accent (#FFD700) colors
  * Enhanced PWA installable app label and favicon references for mobile deployment

- Deployed complete upgrade bundle with 8 new advanced components (July 19, 2025):
  * ContractUpload.tsx - PDF contract parser with auto data extraction
  * ProfitCalculator.tsx - Real-time profit analysis with charts and ROI tracking
  * BuilderPortal.tsx - Builder submission system with admin approval workflow
  * ClientUpgradePanel.tsx - Client upgrade request management with quoting
  * HeatmapVisualizer.tsx - Financial health dashboard with risk assessment
  * AIWorkflowEngine.tsx - Comprehensive AI workflow automation with intelligent recommendations
  * RoleBasedDashboard.tsx - Clean, decluttered role-specific dashboard views
  * AdminRoleManager.tsx - Comprehensive user management and role administration system
- Enhanced main dashboard with visible role switcher, smart alerts, and AI workflow insights
- Integrated all new components into App.tsx routing (/contracts, /profits, /builder, /client-upgrades, /heatmap, /ai-workflows)
- Added AI Workflows to sidebar navigation with dedicated Brain icon
- Added comprehensive role-based testing functionality (Admin, Builder, Client, Investor)
- Implemented AI-powered workflow engine with 5 active workflows including loan optimization, builder analysis, and cost alerts
- Added decluttered role-based dashboard with focused views for each user type (admin, builder, client, investor)
- Created clean UI with collapsible AI insights and role-specific action cards
- Enhanced navigation with dedicated role dashboard accessible via sidebar
- Added comprehensive AdminRoleManager with user creation, role editing, status management, and team oversight
- Implemented admin-only role manager with user statistics, filtering, and secure access controls
- Created complete user lifecycle management from invitation to role assignment and status tracking
- Implemented magic link authentication system replacing password-based signup with one-click access
- Added 72-hour secure token system with email/WhatsApp notifications for seamless team onboarding
- Created role-based auto-routing (client→project-view, builder→builder portal, investor→heatmap)
- Enhanced mobile-first PWA architecture with installation prompts and swipeable card interfaces
- Added camera integration for mobile receipt capture and file uploads with environment camera access
- Implemented smart receipt OCR system with Tesseract.js for automatic data extraction
- Created construction milestone detection system with confidence scoring
- Added WhatsApp reminder integration for missing receipt notifications
- Built comprehensive mobile notification system with push notifications and real-time alerts
- Enhanced receipt processing with vendor, amount, date, and category extraction
- Added milestone validation for construction phases (foundation, frame, lockup, roofing, etc.)
- Integrated smart nudges and reminder system for project milestone tracking
- Created AI Budget Matching system with intelligent receipt-to-budget-line correlation
- Implemented automated claim drafting with confidence scoring and budget utilization tracking  
- Added weekly reminder system with WhatsApp integration for construction teams
- Built comprehensive budget overview dashboard with real-time utilization metrics
- Enhanced OCR system to extract and match financial data against project budget lines
- Implemented Progress Claim Automation Engine with email submission to lenders
- Added automated follow-up system for pending claims with 24-hour reminder cycles  
- Created comprehensive claim management with file attachments and status tracking
- Built lender communication automation with email templates and follow-up sequences

## Latest Security Implementation (July 21, 2025)
- **Comprehensive Security Suite**: Implemented full role-based authentication system with token verification and permission checking
- **Secure File Uploads**: Added file hashing with SHA256, uploader ID tracking, and timestamp verification for all uploads
- **E-signature with OTP**: Built secure e-signature workflow with 6-digit OTP verification and 24-hour auto-expiry
- **Complete Audit Logging**: Every user action is logged with IP address, timestamp, user agent, and detailed activity tracking
- **AI Fraud Detection**: Implemented receipt scanning with fraud scoring, risk flag detection, and automatic blocking for high-risk uploads
- **Auto-expiring Invites**: All invitation links automatically expire after 24 hours with cleanup processes
- **Builder Timeline with AI**: Added AI-powered construction stage detection with confidence scoring and milestone predictions
- **Claim Dashboard**: Full e-signature management dashboard with OTP workflow and status tracking
- **Security API Suite**: 15+ new security endpoints covering authentication, audit logs, fraud detection, and invite management
- **Project AI Analytics**: Advanced photo analysis, progress tracking, and intelligent recommendations for construction projects

## Final UI/UX Polish Implementation (July 21, 2025)
- **Clean Login Page**: Streamlined authentication interface with Lush Properties Pty Ltd brand logo, "Premium Projects. Powerful Returns." tagline, password visibility toggle, and error handling
- **Polished Dashboard**: Added personalized greeting with real-time clock, animated project cards with hover effects, mobile burger menu, and role-based audit log access
- **Enhanced Receipt Upload**: Image preview functionality, category selection dropdown, AI-powered OCR processing, and fraud detection integration
- **Automated Milestone Reminders**: Email and WhatsApp notifications triggered after 7 days of project inactivity with detailed project information and action links
- **PWA Capabilities**: "Install App" button for mobile users, service worker registration, and progressive web app features
- **Lush Properties Pty Ltd Brand Colors**: Deep green primary (#007144), gold accent (#FFD700), modern Inter font family with enhanced typography
- **Mobile-First Design**: Responsive padding, soft shadows, rounded-xl styling, swipeable dashboard cards, and collapsible navigation
- **Advanced Animations**: Framer Motion page transitions, staggered card animations, hover effects, and smooth role switching without page reload
- **Role-Based Views**: Instant view updates for Admin, Builder, Client, and Investor roles with filtered content and specialized dashboards
- **Comprehensive Notifications**: Toast notifications, upload confirmations, milestone alerts, and security audit logging for admin users

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