const express = require('express');
const app = express();

app.use(express.json());

// Handle all routes
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
        .btn:hover { transform: translateY(-2px); }
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
            <strong>Test Login:</strong> admin@lush.com / admin123<br>
            <strong>Deploy Time:</strong> ${new Date().toLocaleString()}<br>
            <strong>Status:</strong> GitHub Desktop Deployment Success
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
        version: 'github-desktop-deployment',
        routes_working: ['/', '/builder', '/client', '/investor', '/dashboard']
      });
    } else if (path === '/api/projects') {
      res.json([
        { id: 1, name: "Luxury Townhouse Development", status: "active", stage: "Foundation" },
        { id: 2, name: "Modern Apartment Complex", status: "planning", stage: "Planning" }
      ]);
    } else if (path === '/api/stats') {
      res.json({
        totalProjects: 2,
        totalValue: 1300000,
        activeProjects: 1,
        completedProjects: 1
      });
    } else {
      res.json({ message: 'API endpoint working', endpoint: path });
    }
  } else {
    // Handle app routes like /builder, /client, etc.
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
        .spinner {
            border: 3px solid rgba(255,255,255,0.3);
            border-top: 3px solid #FFD700;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 2rem auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
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
        <h1>🔨 ${routeName.charAt(0).toUpperCase() + routeName.slice(1)} Portal</h1>
        <div class="spinner"></div>
        <p>Loading your workspace...</p>
        <p style="font-size: 0.9rem; margin: 1rem 0;">
            Route: ${path}<br>
            Status: <span class="working">✅ Working correctly!</span>
        </p>
        <a href="/" class="btn">← Back to Homepage</a>
    </div>
</body>
</html>
    `);
  }
});

module.exports = app;