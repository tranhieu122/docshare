const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Middleware xác thực JWT token
 * Sử dụng: router.get('/protected-route', auth, controller)
 */
const auth = (req, res, next) => {
    try {
        // Lấy token từ header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy token xác thực'
            });
        }

        // Tách token từ "Bearer <token>"
        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Gán thông tin user vào request
        req.user = {
            id: decoded.id,
            ma_nguoi_dung: decoded.id,  // Add this for compatibility
            email: decoded.email,
            role: decoded.role,
            chuc_vu: decoded.role  // Add this for compatibility
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token đã hết hạn'
            });
        }
        
        return res.status(401).json({
            success: false,
            message: 'Token không hợp lệ'
        });
    }
};

/**
 * Middleware kiểm tra role admin
 * Sử dụng: router.delete('/admin-route', auth, isAdmin, controller)
 */
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Bạn không có quyền truy cập'
        });
    }
};

/**
 * Middleware optional authentication
 * Token hợp lệ thì set req.user, không hợp lệ vẫn cho qua
 */
const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET);
            
            req.user = {
                id: decoded.id,
                email: decoded.email,
                role: decoded.role
            };
        }
    } catch (error) {
        // Không làm gì, chỉ skip
    }
    
    next();
};

/**
 * Tạo JWT token cho user
 */
const generateToken = (user) => {
    const payload = {
        id: user.ma_nguoi_dung,
        email: user.email,
        role: user.chuc_vu || 'user'
    };

    // Token expires in 7 days
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

module.exports = { 
    auth, 
    authenticate: auth,  // Alias for compatibility
    isAdmin, 
    optionalAuth, 
    generateToken 
};