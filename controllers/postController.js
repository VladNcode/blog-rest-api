const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Post = require('../models/postModel');

//! Create post
exports.createPost = catchAsync(async (req, res, next) => {
  const newPost = await Post.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      post: newPost,
    },
  });
});

//! Update post
exports.updatePost = catchAsync(async (req, res, next) => {
  let post = await Post.findById(req.params.id);

  if (!post) return next(new AppError('No post found with that ID', 404));
  if (post.username !== req.user.username)
    return next(new AppError('This post does not belong to the current user', 401));

  post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      post,
    },
  });
});

//! Delete post
exports.deletePost = catchAsync(async (req, res, next) => {
  let post = await Post.findById(req.params.id);
  if (!post) return next(new AppError('No post found with that ID', 404));
  if (post.username !== req.user.username)
    return next(new AppError('This post does not belong to the current user', 401));

  post = await Post.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: {
      post,
    },
  });
});

//! Get post
exports.getPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(new AppError('No post found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: {
      post,
    },
  });
});

//! Get all posts
exports.getAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find();
  // if (posts.length < 1) return next(new AppError('No posts found', 404));

  res.status(200).json({
    status: 'success',
    data: {
      results: posts.length,
      posts,
    },
  });
});
