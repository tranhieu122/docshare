const mysql = require('mysql2/promise');

// Mock data for testing without MySQL
const MOCK_MODE = process.env.USE_MOCK_DB === 'true';

const mockData = {
    users: [
        { ma_nguoi_dung: 1, email: 'admin@test.com', mat_khau: '$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', ten: 'Admin User', chuc_vu: 'admin', ngay_lap: new Date('2025-01-01'), trang_thai: 'active' },
        { ma_nguoi_dung: 2, email: 'user@test.com', mat_khau: '$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', ten: 'Test User', chuc_vu: 'user', ngay_lap: new Date('2025-01-15'), trang_thai: 'active' },
        { ma_nguoi_dung: 3, email: 'student@test.com', mat_khau: '$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', ten: 'Student User', chuc_vu: 'user', ngay_lap: new Date('2025-02-01'), trang_thai: 'active' }
    ],
    documents: [
        { ma_tai_lieu: 1, tieu_de: 'Lập trình Web căn bản', mo_ta: 'Tài liệu học HTML, CSS, JavaScript', ma_nguoi_dung: 1, ma_danh_muc: 1, ma_mon_hoc: 1, ngay_tai: new Date('2025-01-10'), so_luot_xem: 150, so_luot_tai: 45, trang_thai: 'approved', duong_dan: 'uploads/doc1.pdf' },
        { ma_tai_lieu: 2, tieu_de: 'Cơ sở dữ liệu MySQL', mo_ta: 'Hướng dẫn MySQL từ cơ bản đến nâng cao', ma_nguoi_dung: 2, ma_danh_muc: 1, ma_mon_hoc: 2, ngay_tai: new Date('2025-01-15'), so_luot_xem: 200, so_luot_tai: 80, trang_thai: 'approved', duong_dan: 'uploads/doc2.pdf' },
        { ma_tai_lieu: 3, tieu_de: 'Node.js và Express', mo_ta: 'Xây dựng RESTful API với Node.js', ma_nguoi_dung: 1, ma_danh_muc: 1, ma_mon_hoc: 3, ngay_tai: new Date('2025-02-01'), so_luot_xem: 120, so_luot_tai: 35, trang_thai: 'pending', duong_dan: 'uploads/doc3.pdf' }
    ],
    categories: [
        { ma_danh_muc: 1, ten_danh_muc: 'Công nghệ thông tin', mo_ta: 'Các tài liệu về lập trình, mạng máy tính' },
        { ma_danh_muc: 2, ten_danh_muc: 'Kinh tế', mo_ta: 'Tài liệu về kinh tế học, quản trị' },
        { ma_danh_muc: 3, ten_danh_muc: 'Ngoại ngữ', mo_ta: 'Tài liệu học tiếng Anh, tiếng Nhật' }
    ],
    subjects: [
        { ma_mon_hoc: 1, ten_mon_hoc: 'Lập trình Web', ma_danh_muc: 1 },
        { ma_mon_hoc: 2, ten_mon_hoc: 'Cơ sở dữ liệu', ma_danh_muc: 1 },
        { ma_mon_hoc: 3, ten_mon_hoc: 'Lập trình ứng dụng', ma_danh_muc: 1 }
    ]
};

// Mock query function
function mockQuery(sql, params = []) {
    console.log('🔧 MOCK DB Query:', sql.substring(0, 80) + '...');
    
    const sqlLower = sql.toLowerCase();
    
    // User queries
    if (sqlLower.includes('from user') || sqlLower.includes('from `user`')) {
        if (sqlLower.includes('count(*)')) {
            return [[{ total: mockData.users.length, today: 1 }], []];
        }
        if (sqlLower.includes('where email')) {
            const email = params[0];
            const user = mockData.users.find(u => u.email === email);
            return [[user].filter(Boolean), []];
        }
        // Admin users endpoint needs wrapped response
        if (sqlLower.includes('order by') && sqlLower.includes('limit')) {
            return [mockData.users, []];
        }
        return [mockData.users, []];
    }
    
    // Document queries
    if (sqlLower.includes('from tailieu')) {
        if (sqlLower.includes('count(*)')) {
            return [[{ total: mockData.documents.length, today: 1 }], []];
        }
        if (sqlLower.includes('sum(so_luot_xem)')) {
            const totalViews = mockData.documents.reduce((sum, doc) => sum + doc.so_luot_xem, 0);
            return [[{ total: totalViews }], []];
        }
        if (sqlLower.includes('sum(so_luot_tai)')) {
            const totalDownloads = mockData.documents.reduce((sum, doc) => sum + doc.so_luot_tai, 0);
            return [[{ total: totalDownloads }], []];
        }
        return [mockData.documents, []];
    }
    
    // Category queries
    if (sqlLower.includes('from danhmuc')) {
        if (sqlLower.includes('count(*)')) {
            return [[{ total: mockData.categories.length }], []];
        }
        return [mockData.categories, []];
    }
    
    // Subject queries
    if (sqlLower.includes('from monhoc')) {
        if (sqlLower.includes('count(*)')) {
            return [[{ total: mockData.subjects.length }], []];
        }
        return [mockData.subjects, []];
    }
    
    // Comment/Rating queries
    if (sqlLower.includes('from binhluan')) {
        return [[{ total: 10 }], []];
    }
    if (sqlLower.includes('from danhgia')) {
        return [[{ total: 25 }], []];
    }
    
    // Default empty response
    return [[], []];
}

// Create mock pool object
const createMockPool = () => ({
    query: async (sql, params) => mockQuery(sql, params),
    execute: async (sql, params) => mockQuery(sql, params),
    getConnection: async () => ({
        query: async (sql, params) => mockQuery(sql, params),
        execute: async (sql, params) => mockQuery(sql, params),
        release: () => {},
        destroy: () => {}
    }),
    end: async () => {}
});

// Configuration for Schema Database
const schemaConfig = {
    host: process.env.DB_SCHEMA_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_SCHEMA_PORT) || 3306,
    user: process.env.DB_SCHEMA_USER || 'root',
    password: process.env.DB_SCHEMA_PASSWORD || '',
    database: process.env.DB_SCHEMA_DATABASE || 'documentsharing_schema',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 3000,  // 3 seconds
    charset: 'utf8mb4'
};

// Configuration for Storage Database
const storageConfig = {
    host: process.env.DB_STORAGE_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_STORAGE_PORT) || 3306,
    user: process.env.DB_STORAGE_USER || 'root',
    password: process.env.DB_STORAGE_PASSWORD || '',
    database: process.env.DB_STORAGE_DATABASE || 'documentsharing_storage',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 3000,  // 3 seconds
    charset: 'utf8mb4'
};

// Configuration for Analytics Database
const analyticsConfig = {
    host: process.env.DB_ANALYTICS_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_ANALYTICS_PORT) || 3306,
    user: process.env.DB_ANALYTICS_USER || 'root',
    password: process.env.DB_ANALYTICS_PASSWORD || '',
    database: process.env.DB_ANALYTICS_DATABASE || 'documentsharing_analytics',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 3000,  // 3 seconds
    charset: 'utf8mb4'
};

// Connection pools
let schemaPool = null;
let storagePool = null;
let analyticsPool = null;

// Connect to Schema Database
async function connectSchemaDB() {
    try {
        if (schemaPool) {
            return schemaPool;
        }
        
        // Use mock if enabled
        if (MOCK_MODE || process.env.FORCE_MOCK === 'true') {
            console.log('🔧 Using MOCK Schema Database');
            schemaPool = createMockPool();
            return schemaPool;
        }
        
        schemaPool = mysql.createPool(schemaConfig);
        
        // Test connection and set charset
        const connection = await schemaPool.getConnection();
        await connection.query('SET NAMES utf8mb4');
        console.log('✅ Connected to Schema Database (MySQL)');
        connection.release();
        
        return schemaPool;
    } catch (error) {
        console.error('❌ Schema DB Connection Error:', error.message);
        console.log('⚠️  Falling back to MOCK database...');
        schemaPool = createMockPool();
        return schemaPool;
    }
}

// Connect to Storage Database
async function connectStorageDB() {
    try {
        if (storagePool) {
            return storagePool;
        }
        
        // Use mock if enabled
        if (MOCK_MODE || process.env.FORCE_MOCK === 'true') {
            console.log('🔧 Using MOCK Storage Database');
            storagePool = createMockPool();
            return storagePool;
        }
        
        storagePool = mysql.createPool(storageConfig);
        
        // Test connection
        const connection = await storagePool.getConnection();
        
        // Set charset
        await connection.query('SET NAMES utf8mb4');
        
        // Try to set max_allowed_packet for this session
        try {
            await connection.query('SET SESSION max_allowed_packet=67108864'); // 64MB
            console.log('✅ Connected to Storage Database (MySQL) - max_allowed_packet set to 64MB');
        } catch (err) {
            console.log('✅ Connected to Storage Database (MySQL) - using default max_allowed_packet');
        }
        
        connection.release();
        
        return storagePool;
    } catch (error) {
        console.error('❌ Storage DB Connection Error:', error.message);
        console.log('⚠️  Falling back to MOCK database...');
        storagePool = createMockPool();
        return storagePool;
    }
}

// Connect to Analytics Database
async function connectAnalyticsDB() {
    try {
        if (analyticsPool) {
            return analyticsPool;
        }
        
        // Use mock if enabled
        if (MOCK_MODE || process.env.FORCE_MOCK === 'true') {
            console.log('🔧 Using MOCK Analytics Database');
            analyticsPool = createMockPool();
            return analyticsPool;
        }
        
        analyticsPool = mysql.createPool(analyticsConfig);
        
        // Test connection and set charset
        const connection = await analyticsPool.getConnection();
        await connection.query('SET NAMES utf8mb4');
        console.log('✅ Connected to Analytics Database (MySQL)');
        connection.release();
        
        return analyticsPool;
    } catch (error) {
        console.error('❌ Analytics DB Connection Error:', error.message);
        console.log('⚠️  Falling back to MOCK database...');
        analyticsPool = createMockPool();
        return analyticsPool;
    }
}

// Get Schema Pool
async function getSchemaPool() {
    if (!schemaPool) {
        return await connectSchemaDB();
    }
    return schemaPool;
}

// Get Storage Pool
async function getStoragePool() {
    if (!storagePool) {
        return await connectStorageDB();
    }
    return storagePool;
}

// Get Analytics Pool
async function getAnalyticsPool() {
    if (!analyticsPool) {
        return await connectAnalyticsDB();
    }
    return analyticsPool;
}

// Close all connections
async function closeConnections() {
    try {
        if (schemaPool && typeof schemaPool.end === 'function') {
            await schemaPool.end().catch(() => {});
            schemaPool = null;
            console.log('Schema DB connection closed');
        }
        if (storagePool && typeof storagePool.end === 'function') {
            await storagePool.end().catch(() => {});
            storagePool = null;
            console.log('Storage DB connection closed');
        }
        if (analyticsPool && typeof analyticsPool.end === 'function') {
            await analyticsPool.end().catch(() => {});
            analyticsPool = null;
            console.log('Analytics DB connection closed');
        }
    } catch (error) {
        // Ignore errors during shutdown
        console.log('Connections closed');
    }
}

// Initialize both connections
async function initializeConnections() {
    try {
        await connectSchemaDB();
        await connectStorageDB();
        await connectAnalyticsDB();
        console.log('✅ Database initialization completed');
    } catch (error) {
        console.error('❌ Database connection issues:', error.message);
        console.log('⚠️ Server will continue without database...');
    }
}

// Export the schema pool directly for backwards compatibility
const getDefaultPool = async () => {
    return await getSchemaPool();
};

// Create a proxy object that acts like a pool
const dbProxy = new Proxy({}, {
    get: function(target, prop) {
        if (prop === 'query' || prop === 'execute') {
            return async (...args) => {
                const pool = await getSchemaPool();
                if (!pool) {
                    throw new Error('Database connection not available');
                }
                return pool[prop](...args);
            };
        }
        if (prop === 'getConnection') {
            return async () => {
                const pool = await getSchemaPool();
                if (!pool) {
                    throw new Error('Database connection not available');
                }
                return pool.getConnection();
            };
        }
        return target[prop];
    }
});

module.exports = dbProxy;
module.exports.getSchemaPool = getSchemaPool;
module.exports.getStoragePool = getStoragePool;
module.exports.getAnalyticsPool = getAnalyticsPool;
module.exports.initializeConnections = initializeConnections;
module.exports.closeConnections = closeConnections;