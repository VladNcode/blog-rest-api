const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

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
