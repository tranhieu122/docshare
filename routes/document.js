const express = require('express');
const router = express.Router();
const documentController = require('../controllers/document');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get all documents
router.get('/', documentController.getAllDocuments);

// Search documents
router.get('/search', documentController.searchDocuments);

// Get document by ID
router.get('/:id', documentController.getDocumentById);

// Upload document (requires auth)
router.post('/', authenticate, upload.single('file'), documentController.uploadDocument);

// Download document (requires auth)
router.get('/:id/download', authenticate, documentController.downloadDocument);

// Rate document (requires auth)
router.post('/:id/rate', authenticate, documentController.rateDocument);

// Get document ratings
router.get('/:id/ratings', documentController.getDocumentRatings);

// Xoá tài liệu (yêu cầu đăng nhập)
router.delete('/:id', authenticate, documentController.deleteDocument);

module.exports = router;
