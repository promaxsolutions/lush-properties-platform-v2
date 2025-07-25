const express = require('express');

// Create Express app
const app = express();

// Homepage route
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lush Properties Pty Ltd</title>
    <style>
        body { 
            margin: 0;
            padding: 50px;
            background: #007144; 
            color: white; 
            text-align: center; 
            font-family: Arial, sans-serif;
        }
        h1 { 
            color: #FFD700; 
            font-size: 2.5rem;
            margin-bottom: 20px;
        }
        p { 
            font-size: 1.2rem;
            margin: 20px 0;
        }
        .portals {
            margin: 40px 0;
        }
        .portal-btn { 
            display: inline-block;
            color: #FFD700; 
            text-decoration: none;
            margin: 10px; 
            padding: 15px 30px; 
            border: 2px solid #FFD700; 
            border-radius: 8px; 
            font-weight: bold;
            transition: all 0.3s ease;
        }
        .portal-btn:hover { 
            background: #FFD700; 
            color: #007144; 
            transform: translateY(-2px);
        }
        .status {
            margin-top: 40px;
            color: #90EE90;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <h1>🏘️ Lush Properties Pty Ltd</h1>
    <p>Premium Property Investment Management Platform</p>
    
    <div class="portals">
        <a href="/builder" class="portal-btn">Builder Portal</a>
        <a href="/client" class="portal-btn">Client Dashboard</a>
        <a href="/admin" class="portal-btn">Admin Panel</a>
        <a href="/investor" class="portal-btn">Investor Portal</a>
    </div>
    
    <div class="status">✅ DEPLOYMENT SUCCESSFUL</div>
    <p style="font-size: 14px; opacity: 0.8;">
        API Status: Active | Platform: Vercel | Version: 2.0
    </p>
</body>
</html>`);
});

// Health check
app.get('/api/health-check', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    platform: 'vercel'
  });
});

// Portal pages
app.get('*', (req, res) => {
  const path = req.path;
  const pageName = path.slice(1) || 'home';
  const pageTitle = pageName.charAt(0).toUpperCase() + pageName.slice(1);
  
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`<!DOCTYPE html>
<html>
<head>
    <title>${pageTitle} Portal - Lush Properties</title>
    <style>
        body { 
            margin: 0;
            padding: 50px;
            background: #007144; 
            color: white; 
            text-align: center; 
            font-family: Arial, sans-serif;
        }
        h1 { color: #FFD700; }
        a { 
            color: #FFD700; 
            text-decoration: none;
            padding: 12px 24px;
            border: 2px solid #FFD700;
            border-radius: 8px;
            display: inline-block;
            margin-top: 20px;
        }
        a:hover { background: #FFD700; color: #007144; }
    </style>
</head>
<body>
    <h1>🏢 ${pageTitle} Portal</h1>
    <p>Welcome to your ${pageName} dashboard</p>
    <p>Portal is active and ready for use.</p>
    <a href="/">← Back to Home</a>
</body>
</html>`);
});

// Export for Vercel
module.exports = app;
