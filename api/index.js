const express = require("express");
const app = express();

app.get("/api/health-check", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.get("*", (req, res) => {
  if (req.path === "/") {
    res.send(`
      <h1>Lush Properties Platform</h1>
      <p>Welcome to the homepage!</p>
    `);
  } else {
    res.send(`
      <h1>${req.path.slice(1)} Page</h1>
      <p>Welcome to the ${req.path.slice(1)} page</p>
    `);
  }
});

// 💥 Vercel expects this:
module.exports = (req, res) => {
  app(req, res);
};
