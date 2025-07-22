# Fix: Sync Changes from Replit to Local MacBook

## Problem
- You're working in Replit environment 
- Local MacBook has old version of files
- Vercel needs the updated configuration files

## Solution 1: Update Local Files Manually

Copy these exact files to your local `~/Downloads/lush-properties-platform` directory:

### 1. Update vercel.json
Replace your local `vercel.json` with:
```json
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
```

### 2. Add netlify.toml (optional backup)
Create new file `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist/public"

[build.environment]
  NODE_ENV = "production"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[dev]
  command = "npm run dev"
  port = 5000
```

## Solution 2: Download Updated Files from Replit

1. **Download** the updated project files from Replit
2. **Replace** your local directory
3. **Push** to GitHub

## After Making Changes Locally

```bash
cd ~/Downloads/lush-properties-platform
git add .
git commit -m "Update Vercel config from Replit environment"
git push origin main
```

This will trigger a fresh Vercel deployment with the correct configuration.