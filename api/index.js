const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html>
<head>
  <title>Lush Properties Pty Ltd</title>
  <style>
    body { 
      background: #007144; 
      color: white; 
      text-align: center; 
      padding: 50px; 
      font-family: Arial, sans-serif;
    }
    h1 { 
      color: #FFD700; 
      font-size: 2.5em;
    }
    .portal-btn { 
      color: #FFD700; 
      margin: 10px; 
      padding: 15px 30px; 
      border: 2px solid #FFD700; 
      border-radius: 8px; 
      text-decoration: none; 
      display: inline-block;
      font-weight: bold;
    }
    .portal-btn:hover { 
      background: #FFD700; 
      color: #007144; 
    }
  </style>
</head>
<body>
  <h1>🏘️ Lush Properties Pty Ltd</h1>
  <p>Premium Property Investment Management Platform</p>
  <div>
    <a href="/builder" class="portal-btn">Builder Portal</a>
    <a href="/client" class="portal-btn">Client Dashboard</a>
    <a href="/admin" class="portal-btn">Admin Panel</a>
    <a href="/investor" class="portal-btn">Investor Portal</a>
  </div>
  <p style="color: #90EE90; margin-top: 40px;">✅ DEPLOYMENT SUCCESSFUL</p>
</body>
</html>`);
});

app.get('/api/health-check', (req, res) => {
  res.json({ status: 'healthy' });
});

app.get('*', (req, res) => {
  res.send('Portal page: ' + req.path);
});

module.exports = app;
