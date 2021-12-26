const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.use(authController.protect);

//! USER CRUD

router.route('/:id').patch(userController.updateUser);

module.exports = router;
