const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html>
<head>
  <title>Lush Properties Pty Ltd</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { 
      background: #007144; 
      color: white; 
      text-align: center; 
      padding: 50px; 
      font-family: Arial, sans-serif; 
      margin: 0;
    }
    h1 { 
      color: #FFD700; 
      font-size: 2.5em; 
      margin: 30px 0; 
    }
    a { 
      color: #FFD700; 
      margin: 10px; 
      padding: 15px 30px; 
      border: 2px solid #FFD700; 
      border-radius: 8px; 
      text-decoration: none; 
      display: inline-block;
      font-weight: bold;
    }
    a:hover { 
      background: #FFD700; 
      color: #007144; 
    }
    .status { 
      margin-top: 40px; 
      color: #90EE90; 
      font-size: 1.3em; 
      font-weight: bold; 
    }
  </style>
</head>
<body>
  <h1>🏘️ Lush Properties Pty Ltd</h1>
  <p>Premium Property Investment Management Platform</p>
  <div>
    <a href="/builder">Builder Portal</a>
    <a href="/client">Client Dashboard</a>
    <a href="/admin">Admin Panel</a>
    <a href="/investor">Investor Portal</a>
  </div>
  <div class="status">✅ HOMEPAGE WORKING!</div>
</body>
</html>`);
});

app.get('/builder', (req, res) => {
  res.send('<!DOCTYPE html><html><head><title>Builder Portal</title><style>body{background:#007144;color:white;text-align:center;padding:50px;font-family:Arial}h1{color:#FFD700}a{color:#FFD700;padding:15px 30px;border:2px solid #FFD700;border-radius:8px;text-decoration:none}a:hover{background:#FFD700;color:#007144}</style></head><body><h1>🔨 Builder Portal</h1><a href="/">← Home</a></body></html>');
});

app.get('/client', (req, res) => {
  res.send('<!DOCTYPE html><html><head><title>Client Portal</title><style>body{background:#007144;color:white;text-align:center;padding:50px;font-family:Arial}h1{color:#FFD700}a{color:#FFD700;padding:15px 30px;border:2px solid #FFD700;border-radius:8px;text-decoration:none}a:hover{background:#FFD700;color:#007144}</style></head><body><h1>👥 Client Portal</h1><a href="/">← Home! Since you have both folders, let's use the complete `lush-properties-platform` folder and create a working deployment. Please run this command to create a properly functioning homepage:

```bash
cd ~/Desktop/lush-properties-platform

cat > api/index.js << 'EOF'
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html>
<head>
  <title>Lush Properties Pty Ltd</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { 
      background: #007144; 
      color: white; 
      text-align: center; 
      padding: 50px; 
      font-family: Arial, sans-serif; 
      margin: 0;
    }
    h1 { 
      color: #FFD700; 
      font-size: 2.5em; 
      margin: 30px 0; 
    }
    a { 
      color: #FFD700; 
      margin: 10px; 
      padding: 15px 30px; 
      border: 2px solid #FFD700; 
      border-radius: 8px; 
      text-decoration: none; 
      display: inline-block;
      font-weight: bold;
    }
    a:hover { 
      background: #FFD700; 
      color: #007144; 
    }
    .status { 
      margin-top: 40px; 
      color: #90EE90; 
      font-size: 1.3em; 
      font-weight: bold; 
    }
  </style>
</head>
<body>
  <h1>🏘️ Lush Properties Pty Ltd</h1>
  <p>Premium Property Investment Management Platform</p>
  <div>
    <a href="/builder">Builder Portal</a>
    <a href="/client">Client Dashboard</a>
    <a href="/admin">Admin Panel</a>
    <a href="/investor">Investor Portal</a>
  </div>
  <div class="status">✅ HOMEPAGE WORKING!</div>
</body>
</html>`);
});

app.get('/builder', (req, res) => {
  res.send('<!DOCTYPE html><html><head><title>Builder Portal</title><style>body{background:#007144;color:white;text-align:center;padding:50px;font-family:Arial}h1{color:#FFD700}a{color:#FFD700;padding:15px 30px;border:2px solid #FFD700;border-radius:8px;text-decoration:none}a:hover{background:#FFD700;color:#007144}</style></head><body><h1>🔨 Builder Portal</h1><a href="/">← Home</a></body></html>');
});

app.get('/client', (req, res) => {
  res.send('<!DOCTYPE html><html><head><title>Client Portal</title><style>body{background:#007144;color:white;text-align:center;padding:50px;font-family:Arial}h1{color:#FFD700}a{color:#FFD700;padding:15px 30px;border:2px solid #FFD700;border-radius:8px;text-decoration:none}a:hover{background:#FFD700;color:#007144}</style></head><body><h1>👥 Client Portal</h1><a href="/">← Home</a></body></html>');
});

app.get('/admin', (req, res) => {
  res.send('<!DOCTYPE html><html><head><title>Admin Panel</title><style>body{background:#007144;color:white;text-align:center;padding:50px;font-family:Arial}h1{color:#FFD700}a{color:#FFD700;padding:15px 30px;border:2px solid #FFD700;border-radius:8px;text-decoration:none}a:hover{background:#FFD700;color:#007144}</style></head><body><h1>⚙️ Admin Panel</h1><a href="/">← Home</a></body></html>');
});

app.get('/investor', (req, res) => {
  res.send('<!DOCTYPE html><html><head><title>Investor Portal</title><style>body{background:#007144;color:white;text-align:center;padding:50px;font-family:Arial}h1{color:#FFD700}a{color:#FFD700;padding:15px 30px;border:2px solid #FFD700;border-radius:8px;text-decoration:none}a:hover{background:#FFD700;color:#007144}</style></head><body><h1>📈 Investor Portal</h1><a href="/">← Home</a></body></html>');
});

app.get('/api/health-check', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString(), version: 'working-deployment' });
});

module.exports = app;
