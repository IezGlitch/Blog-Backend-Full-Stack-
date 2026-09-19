// Express app configuration: middleware + routes + error handling.
const express = require('express');
const logger = require('./middleware/logger');
const postRoutes = require('./routes/postRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(express.json()); // parse JSON request bodies
app.use(logger);         // log every request

// Simple index so opening the URL in a browser shows something useful
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Blog REST API is running',
    endpoints: {
      'POST   /posts': 'Create a post',
      'GET    /posts': 'List posts (search, category, author, sort, page, limit)',
      'GET    /posts/:id': 'Get one post',
      'PUT    /posts/:id': 'Update a post',
      'DELETE /posts/:id': 'Delete a post'
    }
  });
});

app.get('/health', (req, res) => res.json({ success: true, status: 'ok' }));

app.use('/posts', postRoutes);

app.use(notFound);      // unknown routes -> 404
app.use(errorHandler);  // every error -> consistent JSON

module.exports = app;
