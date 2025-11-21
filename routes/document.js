const express = require('express');
const router = express.Router();
const documentController = require('../controllers/document');
const commentController = require('../controllers/comment');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Static routes (must come BEFORE /:id to avoid conflict)
// Get all documents
router.get('/', documentController.getAllDocuments);

// Search documents
router.get('/search', documentController.searchDocuments);

// Get my documents (requires auth)
router.get('/my-documents', authenticate, documentController.getMyDocuments);

// Upload document (requires auth)
router.post('/', authenticate, upload.single('file'), documentController.uploadDocument);

// Dynamic routes (must come AFTER static routes)
// Get document by ID
router.get('/:id', documentController.getDocumentById);

// View document (optional auth - increments view count)
router.get('/:id/view', documentController.viewDocument);

// Download document (requires auth)
router.get('/:id/download', authenticate, documentController.downloadDocument);

// Rate document (requires auth)
router.post('/:id/rate', authenticate, documentController.rateDocument);

// Get document rating (số ít để match với frontend)
router.get('/:id/rating', documentController.getDocumentRating);

// Get comments for a document
router.get('/:id/comments', commentController.getCommentsByDocument);

// Create comment for a document (requires auth)
router.post('/:id/comments', authenticate, commentController.createComment);

// Delete document (requires auth)
router.delete('/:id', authenticate, documentController.deleteDocument);

module.exports = router;
