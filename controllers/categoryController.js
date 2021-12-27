const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Category = require('../models/categoryModel');

exports.createCategory = catchAsync(async (req, res, next) => {
  const category = await Category.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      category,
    },
  });
});

exports.getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find();

  res.status(200).json({
    status: 'success',
    data: {
      results: categories.length,
      categories,
    },
  });
});
