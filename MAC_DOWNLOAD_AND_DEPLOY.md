# 🍎 Mac Terminal: Download from Replit & Deploy to Vercel

## Step 1: Download from Replit (Mac)

### Option A: Direct Download (Easiest)
1. Open your Replit project in browser
2. Click the hamburger menu (☰) or three dots (⋯) in file explorer
3. Select "Download as ZIP" 
4. File downloads to ~/Downloads/replit-export.zip

### Option B: Use Mac Terminal to Download
```bash
# Navigate to your projects folder
cd ~/Desktop/projects

# Create backup of current version
cp -r lush-properties-platform lush-properties-backup-$(date +%Y%m%d)

# Download and extract (replace with your actual Replit download link)
curl -L "https://replit.com/data/repls/signed_urls/zip_download_url" -o replit-latest.zip
unzip replit-latest.zip -d lush-properties-latest/
```

## Step 2: Replace Local Files
```bash
# Navigate to your project directory
cd ~/Desktop/projects

# Option A: Replace entire directory
rm -rf lush-properties-platform
mv lush-properties-latest lush-properties-platform

# Option B: Merge files (safer)
cp -r lush-properties-latest/* lush-properties-platform/
cd lush-properties-platform
```

## Step 3: Install Dependencies
```bash
# Install packages
npm install

# Verify build works
npm run build

# Test locally
npm run dev
# Should open at http://localhost:5000
```

## Step 4: Deploy to Vercel (Mac Terminal)

### Install Vercel CLI (if needed)
```bash
npm install -g vercel
```

### Deploy Commands
```bash
# Login to Vercel
vercel login

# Link to existing project (or create new)
vercel link

# Deploy to production
vercel --prod

# Alternative: Deploy and create new project
vercel --prod --name lush-properties-v2
```

## Complete Mac Terminal Quote (Copy & Paste):

```bash
# ===== LUSH PROPERTIES REPLIT TO VERCEL DEPLOYMENT =====
# 1. Navigate to projects folder
cd ~/Desktop/projects || cd ~/Documents/projects

# 2. Backup current version
cp -r lush-properties-platform lush-properties-backup-$(date +%Y%m%d)

# 3. Download from Replit (manual download to ~/Downloads first)
# Then extract:
unzip ~/Downloads/replit-export.zip -d lush-properties-latest/

# 4. Replace files
cp -r lush-properties-latest/* lush-properties-platform/
cd lush-properties-platform

# 5. Install dependencies and test
npm install
npm run build

# 6. Deploy to Vercel
npm install -g vercel
vercel login
vercel --prod

# 7. Verify deployment
echo "Deployment complete! Check your Vercel dashboard for the live URL"
```

## Environment Variables Setup (Mac Terminal)

### Set via Vercel CLI:
```bash
# Set required environment variables
vercel env add DATABASE_URL production
vercel env add SESSION_SECRET production

# Optional: Add API keys for full functionality
vercel env add SENDGRID_API_KEY production
vercel env add OPENAI_API_KEY production
vercel env add TWILIO_ACCOUNT_SID production
vercel env add TWILIO_AUTH_TOKEN production
```

### Or use .env file method:
```bash
# Create production environment file
cat > .env.production << 'EOF'
DATABASE_URL=your_postgresql_url
SESSION_SECRET=your_session_secret
SENDGRID_API_KEY=your_sendgrid_key
OPENAI_API_KEY=your_openai_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
EOF

# Deploy with environment variables
vercel --prod
```

## Verification Commands:
```bash
# Test deployment endpoints
curl https://your-project.vercel.app/api/health-check
curl https://your-project.vercel.app/api/projects
curl https://your-project.vercel.app/api/stats

# Check deployment status
vercel ls
vercel inspect your-deployment-url
```

## Troubleshooting Common Mac Issues:

### If npm install fails:
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### If Vercel deployment fails:
```bash
# Check Vercel logs
vercel logs

# Redeploy specific version
vercel --prod --force
```

### If build fails:
```bash
# Check build output
npm run build 2>&1 | tee build.log
cat build.log
```

## What You'll Get After Deployment:
- ✅ Complete responsive UI across all devices
- ✅ Working authentication system with role-based access
- ✅ Database with 4 tables and demo data
- ✅ 15+ API endpoints with mock responses
- ✅ Mobile-optimized charts and layouts
- ✅ Production testing suite at `/production-tests`
- ✅ PWA installation capabilities

**Note:** For full functionality (real emails, AI processing, SMS), add the API keys we discussed earlier to your Vercel environment variables.