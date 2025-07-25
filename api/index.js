module.exports = (req, res) => {
  const { url } = req;

  if (url === "/api/health-check") {
    return res
      .writeHead(200, { "Content-Type": "application/json" })
      .end(JSON.stringify({ status: "healthy", timestamp: new Date().toISOString() }));
  }

  if (url === "/") {
    return res
      .writeHead(200, { "Content-Type": "text/html" })
      .end(\`<h1>Lush Properties Platform</h1><p>Welcome to the homepage!</p>\`);
  }

  return res
    .writeHead(200, { "Content-Type": "text/html" })
    .end(\`<h1>\${url.slice(1)} Page</h1><p>Welcome to the \${url.slice(1)} page</p>\`);
};
