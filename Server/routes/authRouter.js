const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.route('/')
    .post(authController.handleLogin)

router.route('/changepassword')
    .post(authController.changePassword)

module.exports = router;