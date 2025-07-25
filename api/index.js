const express = require("express");
const app = express();

app.get("/api/health-check", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.get("*", (req, res) => {
  res.send(\`
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"><title>Lush Properties</title></head>
    <body style="font-family:sans-serif;text-align:center;padding:50px">
      <h1>🌿 Lush Properties Pty Ltd</h1>
      <p>Welcome to the platform.</p>
    </body>
    </html>
  \`);
});

module.exports = app;
