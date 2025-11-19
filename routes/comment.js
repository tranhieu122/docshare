const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment');
const { authenticate } = require('../middleware/auth');

// Get comments for a document
router.get('/document/:documentId', commentController.getCommentsByDocument);

// Create comment (requires auth)
router.post('/', authenticate, commentController.createComment);

// Update comment (requires auth)
router.put('/:id', authenticate, commentController.updateComment);

// Delete comment (requires auth)
router.delete('/:id', authenticate, commentController.deleteComment);

module.exports = router;
