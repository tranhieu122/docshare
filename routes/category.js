const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category');
const { authenticate, isAdmin } = require('../middleware/auth');

// Get all categories
router.get('/', categoryController.getAllCategories);
router.get('/danhmuc', categoryController.getAllCategories); // Alias

// Get all subjects (prioritize before /:id to avoid conflict)
router.get('/monhoc', categoryController.getAllSubjects);
router.get('/subjects', categoryController.getAllSubjects); // Alias for frontend compatibility

// Get category by ID
router.get('/:id', categoryController.getCategoryById);

// Create category (Admin only)
router.post('/', authenticate, isAdmin, categoryController.createCategory);

// Update category (Admin only)
router.put('/:id', authenticate, isAdmin, categoryController.updateCategory);

// Delete category (Admin only)
router.delete('/:id', authenticate, isAdmin, categoryController.deleteCategory);

// Create subject (Admin only)
router.post('/monhoc', authenticate, isAdmin, categoryController.createSubject);

// Update subject (Admin only)
router.put('/monhoc/:id', authenticate, isAdmin, categoryController.updateSubject);

// Delete subject (Admin only)
router.delete('/monhoc/:id', authenticate, isAdmin, categoryController.deleteSubject);

module.exports = router;
