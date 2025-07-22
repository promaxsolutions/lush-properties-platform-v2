# Terminal Commands to Fix vercel.json

## Navigate to Project
```bash
cd ~/Downloads/lush-properties-platform
```

## Replace vercel.json with Correct Configuration
```bash
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
```

## Verify the Change
```bash
cat vercel.json
```

## Commit and Push
```bash
git add vercel.json
git commit -m "Fix Vercel static build configuration"
git push origin main
```

## Expected Result
- Vercel automatically detects the push
- Builds using @vercel/static-build system
- Runs complete npm run build process
- Deploys React app successfully
- Site accessible without 404 errors

Run these commands in sequence and your deployment should work.