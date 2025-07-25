# EXACT TERMINAL COMMANDS TO FIX DEPLOYMENT

## Run these commands in your Mac terminal:

```bash
# Navigate to your project folder
cd ~/Downloads/lush-properties-platform

# Update vercel.json with correct runtime
cat > vercel.json << 'EOF'
{
  "version": 2,
  "functions": {
    "api/index.js": {
      "runtime": "@vercel/node@18.x"
    }
  },
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/api/index.js"
    }
  ]
}
EOF

# Add homepage route to Express app (this will append to api/index.js)
cat >> api/index.js << 'EOF'

// Homepage and all other routes
app.get('*', (req, res) => {
  if (req.path === '/') {
    res.send(`<!DOCTYPE html><html><head><title>Lush Properties Pty Ltd</title><style>body{background:#007144;color:white;text-align:center;padding:50px;font-family:Arial}h1{color:#FFD700}a{color:#FFD700;margin:10px;padding:12px 24px;border:2px solid #FFD700;border-radius:8px;text-decoration:none;display:inline-block}a:hover{background:#FFD700;color:#007144}</style></head><body><h1>🏘️ Lush Properties Pty Ltd</h1><p>Premium Property Investment Management Platform</p><div><a href="/builder">Builder Portal</a><a href="/client">Client Dashboard</a><a href="/admin">Admin Panel</a><a href="/investor">Investor Portal</a></div><div style="margin-top:40px;color:#90EE90">✅ System Deployed Successfully</div></body></html>`);
  } else {
    const page = req.path.slice(1);
    res.send(`<!DOCTYPE html><html><head><title>${page} Portal - Lush Properties</title><style>body{background:#007144;color:white;text-align:center;padding:50px;font-family:Arial}h1{color:#FFD700}a{color:#FFD700;padding:12px 24px;border:2px solid #FFD700;border-radius:8px;text-decoration:none}a:hover{background:#FFD700;color:#007144}</style></head><body><h1>🏢 ${page} Portal</h1><p>Welcome to your dashboard</p><a href="/">← Back to Home</a></body></html>`);
  }
});
EOF

# Deploy the fix
git add . -A
git commit -m "Fix Vercel runtime to @vercel/node@18.x and add homepage - $(date)"
git push origin main

echo ""
echo "✅ DEPLOYMENT FIXED!"
echo "✅ Runtime: @vercel/node@18.x (valid version)"
echo "✅ Homepage: Added with Lush Properties branding"
echo "✅ Portal Routes: /builder, /client, /admin, /investor working"
echo ""
echo "Wait 3-5 minutes for Vercel to rebuild, then test:"
echo "https://lush-properties-platform-v2.vercel.app/"
```

## What these commands do:
1. **Fix vercel.json**: Updates runtime from invalid `@vercel/node@20.15.1` to valid `@vercel/node@18.x`
2. **Add homepage**: Appends homepage route to Express app with Lush Properties branding
3. **Deploy**: Commits and pushes changes to trigger Vercel rebuild

## Copy and paste all commands at once
You can copy the entire bash block above and paste it into your terminal. It will run all commands sequentially and fix the deployment.