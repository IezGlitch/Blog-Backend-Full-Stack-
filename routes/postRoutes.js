// Maps URLs + HTTP methods to controller functions (mounted at /posts).
const express = require('express');
const controller = require('../controllers/postController');
const { validateCreate, validateUpdate } = require('../middleware/validatePost');

const router = express.Router();

router.route('/')
  .get(controller.getPosts)
  .post(validateCreate, controller.createPost);

router.route('/:id')
  .get(controller.getPost)
  .put(validateUpdate, controller.updatePost)
  .delete(controller.deletePost);

module.exports = router;
