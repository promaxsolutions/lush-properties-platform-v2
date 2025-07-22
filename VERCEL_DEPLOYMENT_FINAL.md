# Fresh Vercel Deployment Steps

## Step 1: Update vercel.json Locally First
Before creating the new project, update your configuration:

```bash
cd ~/Downloads/lush-properties-platform

# Update vercel.json with correct config
cat > vercel.json << 'EOF'
{
  "builds": [
    {
      "src": "package.json", 
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist/public"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
EOF

# Push the fixed config
git add vercel.json
git commit -m "Add correct Vercel static build configuration"
git push origin main
```

## Step 2: Create New Vercel Project
1. **Go to**: https://vercel.com/dashboard
2. **Click**: "Add New..." → "Project"
3. **Import Git Repository**: Connect to GitHub if needed
4. **Select**: `promaxsolutions/lush-properties-platform-v2`
5. **Configure Project**:
   - **Framework Preset**: Other
   - **Root Directory**: . (leave blank)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/public`
   - **Install Command**: `npm install`

## Step 3: Deploy
- Click **Deploy**
- Wait for build to complete
- Vercel will use your updated vercel.json configuration
- Site should be accessible at new .vercel.app URL

## Expected Result
✅ Build completes successfully
✅ React app loads properly
✅ Login page accessible
✅ All routes work correctly

The fresh project with updated configuration should deploy without issues.