// =============================================
// CHATBOT ROUTES
// File: routes/chatbot.js
// =============================================

const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbot');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes (không cần đăng nhập)
router.post('/chat', chatbotController.chat);
router.get('/context', chatbotController.getContext);

// Protected routes (cần đăng nhập)
router.post('/upload', authMiddleware.authenticate, upload.single('file'), chatbotController.uploadFile);
router.get('/history', authMiddleware.authenticate, chatbotController.getHistory);

module.exports = router;