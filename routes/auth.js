const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

// Register
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Get current user (requires auth)
// Will be added when we integrate middleware

module.exports = router;
