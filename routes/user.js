const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { authenticate, isAdmin } = require('../middleware/auth');

// User's own routes (must come BEFORE /:id to avoid conflict)
// Get user stats
router.get('/me/stats', authenticate, userController.getUserStats);

// Get user profile
router.get('/me/profile', authenticate, userController.getProfile);

// Update profile
router.put('/me/profile', authenticate, userController.updateProfile);

// Change password
router.put('/me/password', authenticate, userController.changePassword);

// Admin routes
// Get all users (Admin only)
router.get('/', authenticate, isAdmin, userController.getAllUsers);

// Get user by ID (must come AFTER /me/* routes)
router.get('/:id', authenticate, userController.getUserById);

// Update user (Admin only)
router.put('/:id', authenticate, isAdmin, userController.updateUser);

// Delete user (Admin only)
router.delete('/:id', authenticate, isAdmin, userController.deleteUser);

// Change user role (Admin only)
router.put('/:id/role', authenticate, isAdmin, userController.changeUserRole);

module.exports = router;
