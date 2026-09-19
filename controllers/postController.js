// Request handlers: take the request, call the model, send the response.
const Post = require('../models/postModel');
const ApiError = require('../utils/ApiError');

// Lets us use async/await in handlers without try/catch everywhere.
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// POST /posts
exports.createPost = wrap(async (req, res) => {
  const post = await Post.create(req.body);
  res.status(201).json({ success: true, message: 'Post created', data: post });
});

// GET /posts?search=&category=&author=&sort=&page=&limit=
exports.getPosts = wrap(async (req, res) => {
  const { search, category, author, sort = 'newest' } = req.query;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);

  let posts = await Post.findAll();

  if (search) {
    const q = search.toLowerCase();
    posts = posts.filter((p) => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q));
  }
  if (category) posts = posts.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  if (author) posts = posts.filter((p) => p.author.toLowerCase().includes(author.toLowerCase()));

  posts.sort((a, b) =>
    sort === 'oldest'
      ? new Date(a.createdAt) - new Date(b.createdAt)
      : new Date(b.createdAt) - new Date(a.createdAt)
  );

  const total = posts.length;
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  const data = posts.slice((page - 1) * limit, page * limit);

  res.json({
    success: true,
    message: 'Posts retrieved',
    meta: { total, count: data.length, page, limit, totalPages },
    data
  });
});

// GET /posts/:id
exports.getPost = wrap(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new ApiError(404, `No post found with id '${req.params.id}'`);
  res.json({ success: true, message: 'Post retrieved', data: post });
});

// PUT /posts/:id
exports.updatePost = wrap(async (req, res) => {
  const post = await Post.update(req.params.id, req.body);
  if (!post) throw new ApiError(404, `No post found with id '${req.params.id}'`);
  res.json({ success: true, message: 'Post updated', data: post });
});

// DELETE /posts/:id
exports.deletePost = wrap(async (req, res) => {
  const post = await Post.remove(req.params.id);
  if (!post) throw new ApiError(404, `No post found with id '${req.params.id}'`);
  res.json({ success: true, message: 'Post deleted', data: post });
});
