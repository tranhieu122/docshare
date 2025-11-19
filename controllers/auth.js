const bcrypt = require('bcryptjs');
const { getSchemaPool } = require('../config/database');
const { generateToken } = require('../middleware/auth');

// Register
exports.register = async (req, res) => {
    try {
        const { email, mat_khau } = req.body;

        // Validate
        if (!email || !mat_khau) {
            return res.status(400).json({ message: 'Email và mật khẩu là bắt buộc' });
        }

        if (mat_khau.length < 6) {
            return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự' });
        }

        const pool = await getSchemaPool();
        if (!pool) {
            return res.status(500).json({ message: 'Không thể kết nối database' });
        }

        // Check if email exists
        const [existing] = await pool.query('SELECT * FROM `User` WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Email đã được sử dụng' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(mat_khau, 10);

        // Add new user
        await pool.query(
            'INSERT INTO `User` (email, mat_khau, chuc_vu) VALUES (?, ?, ?)',
            [email, hashedPassword, 'user']
        );

        res.status(201).json({ message: 'Đăng ký thành công!' });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, mat_khau } = req.body;

        // Validate
        if (!email || !mat_khau) {
            return res.status(400).json({ message: 'Email và mật khẩu là bắt buộc' });
        }

        const pool = await getSchemaPool();
        if (!pool) {
            return res.status(500).json({ message: 'Không thể kết nối database' });
        }

        // Find user
        const [users] = await pool.query('SELECT * FROM `User` WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        const user = users[0];

        // Check password
        const isValidPassword = await bcrypt.compare(mat_khau, user.mat_khau);
        
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        // Generate token
        const token = generateToken(user);

        // Return user info (without password)
        const userInfo = {
            ma_nguoi_dung: user.ma_nguoi_dung,
            email: user.email,
            chuc_vu: user.chuc_vu || 'user',
            ngay_lap: user.ngay_lap
        };

        res.json({
            message: 'Đăng nhập thành công!',
            token,
            user: userInfo
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Logout
exports.logout = async (req, res) => {
    try {
        res.json({ message: 'Đăng xuất thành công' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};