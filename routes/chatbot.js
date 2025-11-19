const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbot');

// Chat with bot
router.post('/chat', chatbotController.chat);

// Query documents via chatbot
router.post('/document-query', chatbotController.documentQuery);

module.exports = router;
