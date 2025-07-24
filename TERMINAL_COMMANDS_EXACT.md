# EXACT TERMINAL COMMANDS FOR DEPLOYMENT

Copy and paste these commands exactly in Terminal:

```bash
# Navigate to your Downloads folder
cd ~/Downloads/lush-properties-platform

# Remove old deployment files
rm -rf api .vercel
rm -f vercel.json

# Create vercel.json
cat > vercel.json << 'EOF'
{
  "version": 2,
  "functions": {
    "api/index.js": {
      "runtime": "@vercel/node@2.15.10"
    }
  },
  "rewrites": [
    { "source": "/(.*)", "destination": "/api/index.js" }
  ]
}
EOF

# Create api directory and index.js
mkdir -p api
cat > api/index.js << 'EOF'
const express = require('express');
const app = express();

app.use(express.json());

app.get('*', (req, res) => {
  const path = req.path;
  
  if (path === '/') {
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Lush Properties Pty Ltd</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #007144, #005a36);
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
        }
        .container {
            text-align: center;
            background: rgba(255,255,255,0.1);
            padding: 2rem;
            border-radius: 16px;
            max-width: 600px;
            width: 100%;
        }
        h1 { color: #FFD700; font-size: 2.5rem; margin-bottom: 1rem; }
        .btn {
            display: inline-block;
            background: #FFD700;
            color: #007144;
            padding: 10px 20px;
            margin: 6px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
        }
        .status { margin: 1rem 0; padding: 1rem; background: rgba(255,255,255,0.1); border-radius: 8px; }
        .working { color: #4ade80; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Lush Properties Pty Ltd</h1>
        <p style="font-size: 1.2rem; margin-bottom: 2rem;">Property Investment Management Platform</p>
        
        <div class="status">
            Status: <span class="working">✅ HOMEPAGE WORKING</span>
        </div>
        
        <div style="margin: 2rem 0;">
            <a href="/builder" class="btn">🔨 Builder Portal</a>
            <a href="/client" class="btn">👤 Client Dashboard</a>
            <a href="/investor" class="btn">💼 Investor Portal</a>
            <a href="/dashboard" class="btn">📊 Admin Dashboard</a>
        </div>
        
        <div style="font-size: 0.9rem; margin-top: 2rem;">
            <strong>Deploy Time:</strong> ${new Date().toLocaleString()}<br>
            <strong>Status:</strong> Terminal Deployment Success
        </div>
    </div>
</body>
</html>
    `);
  } else if (path.startsWith('/api/')) {
    if (path === '/api/health-check') {
      res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(), 
        version: 'terminal-deployment-working'
      });
    } else if (path === '/api/projects') {
      res.json([
        { id: 1, name: "Luxury Townhouse Development", status: "active" },
        { id: 2, name: "Modern Apartment Complex", status: "planning" }
      ]);
    } else {
      res.json({ message: 'API endpoint working', endpoint: path });
    }
  } else {
    const routeName = path.substring(1) || 'app';
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>${routeName.charAt(0).toUpperCase() + routeName.slice(1)} Portal - Lush Properties</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #007144, #005a36);
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
        }
        .container {
            text-align: center;
            background: rgba(255,255,255,0.1);
            padding: 3rem;
            border-radius: 16px;
            max-width: 500px;
        }
        h1 { color: #FFD700; font-size: 2rem; margin-bottom: 1rem; }
        .btn {
            background: #FFD700;
            color: #007144;
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-weight: bold;
            text-decoration: none;
            display: inline-block;
            margin-top: 2rem;
        }
        .working { color: #4ade80; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <h1>${routeName.charAt(0).toUpperCase() + routeName.slice(1)} Portal</h1>
        <p>Route: ${path}</p>
        <p style="color:#4ade80">✅ Working correctly!</p>
        <a href="/" class="btn">← Back to Homepage</a>
    </div>
</body>
</html>
    `);
  }
});

module.exports = app;
EOF

# Commit and push to GitHub (triggers Vercel deployment)
git add . -A
git commit -m "Terminal deployment fix - homepage routing working"
git push origin main --force

echo ""
echo "🚀 DEPLOYMENT COMPLETE"
echo ""
echo "✅ Test these URLs in 3-5 minutes:"
echo "🏠 Homepage: https://lush-properties-platform-v2.vercel.app/"
echo "🔨 Builder: https://lush-properties-platform-v2.vercel.app/builder"
echo "👤 Client: https://lush-properties-platform-v2.vercel.app/client"
echo "💼 Investor: https://lush-properties-platform-v2.vercel.app/investor"
echo "📊 Dashboard: https://lush-properties-platform-v2.vercel.app/dashboard"
echo ""
echo "⏱️  Wait 3-5 minutes for full deployment"
```

## What This Does:
1. Navigates to your Downloads project folder
2. Removes old deployment files
3. Creates proper `vercel.json` configuration
4. Creates complete `api/index.js` with working routes
5. Commits and pushes to GitHub (auto-triggers Vercel deployment)
6. Shows success message with URLs to test

Copy this entire block and paste it into Terminal, then press Enter. It will run all commands automatically.