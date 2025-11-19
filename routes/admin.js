const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const { authenticate, isAdmin } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(authenticate, isAdmin);

// Dashboard stats
router.get('/stats', adminController.getStats);
router.get('/dashboard', adminController.getDashboardStats);

// Get all users
router.get('/users', adminController.getAllUsers);

// Update user role
router.put('/users/:id/role', adminController.updateUserRole);

// Delete user
router.delete('/users/:id', adminController.deleteUser);

// Get all documents
router.get('/documents', adminController.getAllDocuments);

// Get recent documents
router.get('/recent-documents', adminController.getRecentDocuments);

// Get recent users
router.get('/recent-users', adminController.getRecentUsers);

// Update document status
router.put('/documents/:id/status', adminController.updateDocumentStatus);

module.exports = router;
