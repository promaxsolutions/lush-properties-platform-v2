# Lush Properties Pty Ltd - Property Project Management Platform

A sophisticated full-stack web application for premium property development and construction project management with AI-powered insights and comprehensive role-based access control.

## Features

### Core Functionality
- **Role-Based Access Control**: Admin, Builder, Client, Accountant, Investor, Superadmin roles
- **AI-Powered Insights**: Smart workflow automation and project recommendations
- **Mobile-First PWA**: Progressive Web App with offline capabilities
- **Real-Time Sync**: Live project updates and progress tracking
- **Secure Authentication**: Magic link authentication with session management

### Advanced Capabilities
- **Smart Receipt Processing**: OCR with AI-powered data extraction
- **Progress Claim Automation**: Automated lender communication and follow-up
- **Investor Project Alerts**: Automated funding opportunity notifications
- **Construction Timeline Tracking**: AI-powered milestone detection
- **Comprehensive Security Suite**: E-signatures, audit logging, fraud detection

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Vite** for development and building
- **Wouter** for routing
- **TanStack Query** for data fetching

### Backend
- **Node.js** with Express
- **PostgreSQL** with Drizzle ORM
- **Replit Authentication** (OpenID Connect)
- **File Upload** with Multer
- **AI Integration** with OpenAI

### Infrastructure
- **PostgreSQL Database** (Neon)
- **Session Storage** with connect-pg-simple
- **PWA Support** with service workers
- **Mobile Camera Integration**

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Environment variables configured

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd lush-properties

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Configure your DATABASE_URL and other secrets

# Push database schema
npm run db:push

# Start development server
npm run dev
```

### Environment Variables Required

```env
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=your_session_secret
REPL_ID=your_replit_app_id
REPLIT_DOMAINS=your_deployment_domains
ISSUER_URL=https://replit.com/oidc
```

## Project Structure

```
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utilities and helpers
│   │   └── pages/        # Page components
├── server/               # Express backend
│   ├── routes/           # API route handlers
│   ├── middleware/       # Express middleware
│   └── storage.ts        # Database operations
├── shared/               # Shared TypeScript types
│   └── schema.ts         # Database schema definitions
└── uploads/              # File upload storage
```

## Role-Based Access

### User Roles
- **Admin**: Full system access, user management, all dashboards
- **Superadmin**: Admin access plus impersonation capabilities
- **Builder**: Construction progress, uploads, timeline management
- **Client**: Project view, upgrade requests, document access
- **Accountant**: Financial management, receipt processing, claims
- **Investor**: Portfolio view, funding opportunities, ROI tracking

### Route Security
- Role-based route validation with automatic fallback
- Invalid routes redirect to appropriate dashboards
- Comprehensive access control testing utilities

## Key Features

### AI-Powered Workflows
- Smart receipt OCR with vendor/amount extraction
- Budget matching and utilization tracking
- Progress claim automation with lender integration
- Construction milestone detection and validation

### Security & Compliance
- E-signature workflow with OTP verification
- Comprehensive audit logging for all actions
- Fraud detection for uploaded receipts
- Secure file handling with hash verification

### Mobile Experience
- PWA installation prompts
- Camera integration for receipt capture
- Touch-friendly responsive design
- Offline sync capabilities

### Testing Infrastructure
- Comprehensive role testing suite
- Route fallback validation
- Authentication flow testing
- Security boundary verification

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push schema changes to database
- `npm run preview` - Preview production build

### Testing Routes
- `/comprehensive-test` - Role workflow testing (Admin only)
- `/route-test` - Route fallback validation (Admin only)
- `/nav-test` - Navigation testing utilities

## Deployment

### Replit Deployment
The application is configured for Replit deployment with:
- Automatic database provisioning
- Environment variable management
- Session storage configuration
- PWA manifest and service workers

### Production Considerations
- Configure secure session secrets
- Set up proper domain configuration
- Enable HTTPS for production
- Configure database connection pooling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly using provided testing utilities
5. Submit a pull request

## Security

- All user actions are logged with IP and timestamp
- Role-based access control prevents unauthorized access
- Secure file uploads with fraud detection
- E-signature workflows with OTP verification

## License

© 2025 Lush Properties Pty Ltd. All rights reserved.

## Support

For technical support or questions about the platform, please contact the development team.