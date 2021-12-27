const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
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
  // console.log(req.query.user);
  // const username = req.query.user;
  // const catName = req.query.cat;
  // let posts;

  // if (username) posts = await Post.find({ username });
  // if (catName)
  //   posts = await Post.find({
  //     categories: {
  //       $in: [catName],
  //     },
  //   });

  // posts = await Post.find();

  const features = new APIFeatures(Post.find(), req.query).filter().sort().limitFields().paginate();
  const posts = await features.query;

  res.status(200).json({
    status: 'success',
    data: {
      results: posts.length,
      posts,
    },
  });
});
