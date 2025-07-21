# Vercel Deployment Guide for Lush Properties Platform

## Prerequisites
1. Your code must be pushed to GitHub first
2. You'll need a Vercel account (free at vercel.com)
3. PostgreSQL database (Neon recommended for serverless)

## Step 1: Push to GitHub
Follow the commands in `GITHUB_PUSH_COMMANDS.md` to upload your code to GitHub first.

## Step 2: Deploy to Vercel

### Option A: Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project" 
3. Import your GitHub repository: `lush-properties-platform`
4. Vercel will auto-detect it as a Vite project
5. Configure environment variables (see below)
6. Click "Deploy"

### Option B: Vercel CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

## Step 3: Environment Variables
In Vercel dashboard, add these environment variables:

### Required Database Variables
```
DATABASE_URL=your_neon_database_url
PGHOST=your_db_host
PGDATABASE=your_db_name
PGUSER=your_db_user
PGPASSWORD=your_db_password
PGPORT=5432
```

### Authentication & Security
```
SESSION_SECRET=your_random_32_char_string
REPL_ID=your_repl_id
ISSUER_URL=https://replit.com/oidc
REPLIT_DOMAINS=your-app-domain.vercel.app
```

### Optional API Keys (for full functionality)
```
OPENAI_API_KEY=your_openai_key
SENDGRID_API_KEY=your_sendgrid_key
```

## Step 4: Database Setup
1. Create a Neon database at [neon.tech](https://neon.tech)
2. Copy the connection string to `DATABASE_URL`
3. Run database migrations:
   ```bash
   npm run db:push
   ```

## Step 5: Domain Configuration
1. Your app will be deployed to: `https://your-repo-name.vercel.app`
2. Update `REPLIT_DOMAINS` environment variable with your Vercel domain
3. Configure any custom domains in Vercel settings

## Project Structure for Vercel
```
├── api/              # Serverless functions
├── client/           # React frontend
├── server/           # Backend logic
├── shared/           # Shared types
├── public/           # Static assets
├── vercel.json       # Vercel configuration
└── package.json      # Dependencies
```

## Features Included in Deployment
✅ Role-based authentication system
✅ AI-powered project insights
✅ Mobile PWA capabilities
✅ Smart receipt OCR processing
✅ Progress claim automation
✅ Comprehensive security suite
✅ Enhanced route fallback system
✅ Real-time notifications

## Troubleshooting
- **Build fails**: Check that all dependencies are in package.json
- **Database errors**: Verify DATABASE_URL is correct
- **Auth issues**: Ensure REPLIT_DOMAINS matches your Vercel domain
- **API errors**: Check environment variables are set correctly

## Post-Deployment
1. Test all role-based logins (Admin, Builder, Client, etc.)
2. Verify database connectivity
3. Test file upload functionality
4. Check mobile PWA installation
5. Validate AI features and workflows

Your Lush Properties platform will be live at your Vercel URL once deployed!