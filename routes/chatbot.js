const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbot');
const authMiddleware = require('../middleware/auth');

// Simple chatbot routes - No AI needed
router.post('/chat', chatbotController.chat);
router.get('/history', authMiddleware.authenticate, chatbotController.getHistory);
router.get('/search', chatbotController.searchDocuments);

module.exports = router;
