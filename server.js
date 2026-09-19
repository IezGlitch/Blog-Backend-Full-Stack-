// Entry point: reads the port and starts the HTTP server.
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Blog REST API running at http://localhost:${PORT}`);
});
