const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');

exports.registerUser = catchAsync(async (req, res) => {
  const user = await User.create({
    username: req.body.name,
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
