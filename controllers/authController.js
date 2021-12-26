const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

//! COOOKIE AND JWT
const signToken = id =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarderd-proto'] === 'https',
  });

  // Remove the password from the output
  user.password = undefined;
  user.role = undefined;
  user.__v = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.registerUser = catchAsync(async (req, res) => {
  const user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    profilePic: req.body.profilePic,
  });

  res.status(201).json({
    status: 'success',
    data: {
      user,
    },
  });
});

//! LOGIN
exports.loginUser = catchAsync(async (req, res, next) => {
  // 1) Check if email and password exist
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please enter email and password', 400));
  }

  // 2) Find user
  const user = await User.findOne({ email }).select('+password');
  if (!user) return next(new AppError('Please enter correct email and password', 401));

  // 3) Check if password is valid, if not inc log attempts
  if (!(await user.validatePassword(password, user.password))) {
    return next(new AppError('Please enter correct email and password', 401));
  }

  // 4) If everything is ok, send token to client and reset login attempts
  await User.findById(user.id);

  createSendToken(user, 200, req, res);
});

//! PROTECT
exports.protect = catchAsync(async (req, res, next) => {
  // Checking if user is logged in via google
  // if (req.isAuthenticated()) {
  //   return next();
  // }

  // 1) Getting token and check of it's there
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new AppError('The user belonging to this token does no longer exist.', 401));
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role))
      return next(new AppError('You do not have permission to perform this action', 403));
    next();
  };
