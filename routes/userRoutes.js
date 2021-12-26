const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/:id')

  .patch(userController.updateUser);

//! Only admin able to perform this actions
router.use(authController.restrictTo('admin'));

//! USER CRUD

router.route('/').get(userController.getAllUsers);

router.route('/:id').get(userController.getUser).delete(userController.deleteUser);

module.exports = router;
