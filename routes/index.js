const express = require('express');
const router = express.Router();

// Import all route modules
const authRoutes = require('./auth');
const userRoutes = require('./user');
const documentRoutes = require('./document');
const categoryRoutes = require('./category');
const commentRoutes = require('./comment');
const adminRoutes = require('./admin');
const chatbotRoutes = require('./chatbot');

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/documents', documentRoutes);
router.use('/categories', categoryRoutes);
router.use('/comments', commentRoutes);
router.use('/admin', adminRoutes);
router.use('/chatbot', chatbotRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'DocShare API is running',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
