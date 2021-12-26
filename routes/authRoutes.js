const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

//! REGISTER

router.route('/register').post(authController.registerUser);

module.exports = router;
