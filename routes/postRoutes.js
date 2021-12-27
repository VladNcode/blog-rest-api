const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');

const router = express.Router();

router.use(authController.protect);

router.route('/').get(postController.getAllPosts).post(postController.createPost);
router
  .route('/:id')
  .get(postController.getPost)
  .patch(postController.updatePost)
  .delete(postController.deletePost);

module.exports = router;
