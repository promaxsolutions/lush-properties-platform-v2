// Vercel serverless function handler
const express = require('express');
const path = require('path');

const app = express();

// Import your Express app
// Note: This is a simplified handler for Vercel deployment
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Lush Properties API is running' });
});

// Handle API routes
app.use('/api', (req, res) => {
  res.json({ message: 'API endpoint placeholder for Vercel deployment' });
});

// Export for Vercel
module.exports = app;