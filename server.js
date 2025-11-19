require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://127.0.0.1:5500',
        'http://127.0.0.1:5501',
        'http://localhost:5500',
        'http://localhost:5501'
    ],
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use(express.static(path.join(__dirname)));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const sendHtmlPage = (filePath) => (req, res) => {
    res.sendFile(filePath, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
};

// API Routes
try {
    const apiRoutes = require('./routes');
    app.use('/api', apiRoutes);
    console.log('✅ All routes loaded successfully');
} catch (error) {
    console.error('❌ Failed to load routes:', error.message);
    console.error(error);
}

// Serve HTML pages
app.get('/', sendHtmlPage(path.join(__dirname, 'index.html')));

app.get('/login', sendHtmlPage(path.join(__dirname, 'login.html')));

app.get('/register', sendHtmlPage(path.join(__dirname, 'register.html')));

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'API endpoint not found' 
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File quá lớn. Kích thước tối đa là 20MB'
            });
        }
        return res.status(400).json({
            success: false,
            message: 'Lỗi upload file: ' + err.message
        });
    }
    
    res.status(500).json({ 
        success: false, 
        message: err.message || 'Internal Server Error' 
    });
});

// Initialize database and start server
async function startServer() {
    try {
        // Initialize database connections
        await db.initializeConnections();
        
        // Start server
        app.listen(PORT, () => {
            console.log('='.repeat(50));
            console.log('📚 DocShare - Document Sharing Platform');
            console.log('='.repeat(50));
            console.log(`✅ Server is running on port ${PORT}`);
            console.log(`🌐 http://localhost:${PORT}`);
            console.log('='.repeat(50));
        });
    } catch (error) {
        console.log('⚠️  WARNING: Database connection failed');
        console.log('⚠️  Starting server with limited functionality...');
        
        // Start server anyway
        app.listen(PORT, () => {
            console.log('='.repeat(50));
            console.log('📚 DocShare - Document Sharing Platform');
            console.log('⚠️  RUNNING IN FALLBACK MODE (No Database)');
            console.log('='.repeat(50));
            console.log(`✅ Server is running on port ${PORT}`);
            console.log(`🌐 http://localhost:${PORT}`);
            console.log('='.repeat(50));
        });
    }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n⚠️ Shutting down server...');
    await db.closeConnections();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n⚠️ Shutting down server...');
    await db.closeConnections();
    process.exit(0);
});

// Start the server
startServer();
