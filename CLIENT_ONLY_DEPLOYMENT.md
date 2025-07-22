# Client-Only Deployment Fix for MIME Errors

## The Core Problem
Your build script (`npm run build`) includes both:
1. Frontend build: `vite build` 
2. Backend build: `esbuild server/index.ts...`

But Vercel static deployment only needs the frontend.

## Solution: Build Client Directory Directly

**Updated vercel.json** (builds only React app):
```json
{
  "buildCommand": "cd client && npm install && npx vite build",
  "outputDirectory": "client/dist",
  "installCommand": "npm install", 
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## Terminal Commands:
```bash
cd ~/Downloads/lush-properties-platform

# Replace with client-only build config
cat > vercel.json << 'EOF'
{
  "buildCommand": "cd client && npm install && npx vite build",
  "outputDirectory": "client/dist",
  "installCommand": "npm install",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
EOF

# Push the fix
git add vercel.json
git commit -m "Switch to client-only deployment to fix MIME errors"  
git push origin main
```

## Why This Works
- Builds only the React frontend (no server confusion)
- Uses `client/dist` where Vite actually outputs files
- Proper SPA routing with HTML fallback
- Eliminates MIME type conflicts from mixed builds

This should resolve the JavaScript module loading errors.