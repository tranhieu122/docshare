const bcrypt = require('bcryptjs');
const { getSchemaPool } = require('../config/database');

// Get profile
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.ma_nguoi_dung;
        const pool = await getSchemaPool();
        
        const [rows] = await pool.query(
            'SELECT ma_nguoi_dung, email, ngay_lap FROM User WHERE ma_nguoi_dung = ?',
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Update profile
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.ma_nguoi_dung;
        const { mat_khau } = req.body;
        
        const pool = await getSchemaPool();
        
        await pool.query(
            'UPDATE User SET mat_khau = ? WHERE ma_nguoi_dung = ?',
            [mat_khau, userId]
        );

        res.json({ message: 'Cập nhật thông tin thành công' });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Change password
exports.changePassword = async (req, res) => {
    try {
        const userId = req.user.ma_nguoi_dung;
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Thiếu thông tin' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
        }

        const pool = await getSchemaPool();
        
        // Get current password
        const [rows] = await pool.query(
            'SELECT mat_khau FROM User WHERE ma_nguoi_dung = ?',
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        const user = rows[0];
        
        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, user.mat_khau);
        if (!isValid) {
            return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update password
        await pool.query(
            'UPDATE User SET mat_khau = ? WHERE ma_nguoi_dung = ?',
            [hashedPassword, userId]
        );

        res.json({ message: 'Đổi mật khẩu thành công' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Get user stats
exports.getUserStats = async (req, res) => {
    try {
        const userId = req.user.ma_nguoi_dung;
        const pool = await getSchemaPool();
        
        // Get document count and stats
        const [docs] = await pool.query(
            `SELECT 
                COUNT(*) as total_documents,
                COALESCE(SUM(so_luot_xem), 0) as total_views,
                COALESCE(SUM(so_luot_tai), 0) as total_downloads
            FROM TaiLieu 
            WHERE ma_nguoi_dung = ?`,
            [userId]
        );

        // Get comment count
        const [comments] = await pool.query(
            'SELECT COUNT(*) as count FROM BinhLuan WHERE ma_nguoi_dung = ?',
            [userId]
        );

        // Get average rating from user's documents
        const [avgRating] = await pool.query(
            `SELECT COALESCE(AVG(dg.diem_so), 0) as avg_rating
            FROM DanhGia dg
            JOIN TaiLieu t ON dg.ma_tai_lieu = t.ma_tai_lieu
            WHERE t.ma_nguoi_dung = ?`,
            [userId]
        );

        res.json({
            documents: docs[0].total_documents || 0,
            views: docs[0].total_views || 0,
            downloads: docs[0].total_downloads || 0,
            comments: comments[0].count || 0,
            rating: parseFloat(avgRating[0].avg_rating || 0).toFixed(1)
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
    try {
        const pool = await getSchemaPool();
        const [rows] = await pool.query(
            'SELECT ma_nguoi_dung, email, chuc_vu, ngay_lap FROM `User` ORDER BY ngay_lap DESC'
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// Get user by ID
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await getSchemaPool();
        const [rows] = await pool.query(
            'SELECT ma_nguoi_dung, email, chuc_vu, ngay_lap FROM `User` WHERE ma_nguoi_dung = ?',
            [id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
        }
        
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// Update user (Admin only)
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, chuc_vu } = req.body;
        const pool = await getSchemaPool();
        
        await pool.query(
            'UPDATE `User` SET email = ?, chuc_vu = ? WHERE ma_nguoi_dung = ?',
            [email, chuc_vu, id]
        );
        
        res.json({ success: true, message: 'Cập nhật người dùng thành công' });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// Delete user (Admin only)
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await getSchemaPool();
        
        await pool.query('DELETE FROM `User` WHERE ma_nguoi_dung = ?', [id]);
        
        res.json({ success: true, message: 'Xóa người dùng thành công' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// Change user role (Admin only)
exports.changeUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { chuc_vu } = req.body;
        const pool = await getSchemaPool();
        
        await pool.query(
            'UPDATE `User` SET chuc_vu = ? WHERE ma_nguoi_dung = ?',
            [chuc_vu, id]
        );
        
        res.json({ success: true, message: 'Thay đổi vai trò thành công' });
    } catch (error) {
        console.error('Change role error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};