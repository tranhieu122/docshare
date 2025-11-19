const db = require('../config/database');

// ===================================
// DASHBOARD & STATISTICS
// ===================================

// Alias for getDashboardStats
exports.getDashboardStats = async (req, res) => {
    return exports.getStats(req, res);
};

exports.getStats = async (req, res) => {
    try {
        const [userStats] = await db.query(
            'SELECT COUNT(*) as total, SUM(CASE WHEN DATE(ngay_lap) = CURDATE() THEN 1 ELSE 0 END) as today FROM User'
        );
        
        const [docStats] = await db.query(
            'SELECT COUNT(*) as total, SUM(CASE WHEN DATE(ngay_tai) = CURDATE() THEN 1 ELSE 0 END) as today FROM TaiLieu'
        );
        
        const [viewStats] = await db.query(
            'SELECT SUM(so_luot_xem) as total FROM TaiLieu'
        );
        
        const [downloadStats] = await db.query(
            'SELECT SUM(so_luot_tai) as total FROM TaiLieu'
        );

        // Thêm thống kê categories, subjects, comments, ratings
        const [categoryStats] = await db.query('SELECT COUNT(*) as total FROM DanhMuc');
        const [subjectStats] = await db.query('SELECT COUNT(*) as total FROM MonHoc');
        const [commentStats] = await db.query('SELECT COUNT(*) as total FROM BinhLuan');
        const [ratingStats] = await db.query('SELECT COUNT(*) as total FROM DanhGia');

        res.json({
            users: {
                total: userStats[0].total,
                today: userStats[0].today
            },
            documents: {
                total: docStats[0].total,
                today: docStats[0].today
            },
            views: viewStats[0].total || 0,
            downloads: downloadStats[0].total || 0,
            categories: categoryStats[0].total || 0,
            subjects: subjectStats[0].total || 0,
            comments: commentStats[0].total || 0,
            ratings: ratingStats[0].total || 0
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.getDetailedStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        const query = `
            SELECT 
                DATE(ngay_tai) as date,
                COUNT(*) as documents,
                SUM(so_luot_xem) as views,
                SUM(so_luot_tai) as downloads
            FROM TaiLieu
            WHERE ngay_tai BETWEEN ? AND ?
            GROUP BY DATE(ngay_tai)
            ORDER BY date DESC
        `;
        
        const [stats] = await db.query(query, [startDate || '2020-01-01', endDate || new Date()]);
        
        res.json(stats);
    } catch (error) {
        console.error('Get detailed stats error:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.getChartData = async (req, res) => {
    try {
        const [monthlyData] = await db.query(`
            SELECT 
                DATE_FORMAT(ngay_tai, '%Y-%m') as month,
                COUNT(*) as documents,
                SUM(so_luot_xem) as views,
                SUM(so_luot_tai) as downloads
            FROM TaiLieu
            WHERE ngay_tai >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
            GROUP BY DATE_FORMAT(ngay_tai, '%Y-%m')
            ORDER BY month
        `);

        const [categoryData] = await db.query(`
            SELECT 
                dm.ten_danh_muc as category,
                COUNT(tl.ma_tai_lieu) as count
            FROM DanhMuc dm
            LEFT JOIN TaiLieu tl ON dm.ma_danh_muc = tl.ma_danh_muc
            GROUP BY dm.ma_danh_muc, dm.ten_danh_muc
            ORDER BY count DESC
        `);

        res.json({
            monthly: monthlyData,
            categories: categoryData
        });
    } catch (error) {
        console.error('Get chart data error:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// ===================================
// USERS MANAGEMENT
// ===================================

exports.getAllUsers = async (req, res) => {
    try {
        const { page, limit, search = '', role = '' } = req.query;

        let query = 'SELECT ma_nguoi_dung, ten, email, vai_tro, ngay_tao FROM User WHERE 1=1';
        const params = [];

        if (search) {
            query += ' AND (ten LIKE ? OR email LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        if (role) {
            query += ' AND vai_tro = ?';
            params.push(role);
        }

        query += ' ORDER BY ngay_tao DESC';

        // If pagination requested
        if (page && limit) {
            const offset = (page - 1) * limit;
            query += ' LIMIT ? OFFSET ?';
            params.push(parseInt(limit), offset);
        }

        const [users] = await db.query(query, params);
        
        res.json(users);
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.getUserDetails = async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT * FROM User WHERE ma_nguoi_dung = ?',
            [req.params.id]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        const [documents] = await db.query(
            'SELECT COUNT(*) as total FROM TaiLieu WHERE ma_nguoi_dung = ?',
            [req.params.id]
        );

        res.json({
            user: users[0],
            documents: documents[0].total
        });
    } catch (error) {
        console.error('Get user details error:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.getRecentUsers = async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT * FROM User ORDER BY ngay_lap DESC LIMIT 10'
        );
        res.json(users);
    } catch (error) {
        console.error('Get recent users error:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        
        if (!['admin', 'user'].includes(role)) {
            return res.status(400).json({ message: 'Vai trò không hợp lệ' });
        }

        await db.query(
            'UPDATE `User` SET chuc_vu = ? WHERE ma_nguoi_dung = ?',
            [role, req.params.id]
        );

        res.json({ message: 'Cập nhật vai trò thành công' });
    } catch (error) {
        console.error('Update user role error:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.updateUserStatus = async (req, res) => {
    try {
        const { status } = req.body;

        await db.query(
            'UPDATE `User` SET trang_thai = ? WHERE ma_nguoi_dung = ?',
            [status, req.params.id]
        );

        res.json({ message: 'Cập nhật trạng thái thành công' });
    } catch (error) {
        console.error('Update user status error:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        // Check if user has documents
        const [documents] = await db.query(
            'SELECT COUNT(*) as total FROM TaiLieu WHERE ma_nguoi_dung = ?',
            [req.params.id]
        );

        if (documents[0].total > 0) {
            return res.status(400).json({ 
                message: 'Không thể xóa người dùng có tài liệu. Vui lòng xóa tài liệu trước.' 
            });
        }

        await db.query('DELETE FROM User WHERE ma_nguoi_dung = ?', [req.params.id]);
        
        res.json({ message: 'Xóa người dùng thành công' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.banUser = async (req, res) => {
    try {
        const { banned } = req.body;
        const status = banned ? 'banned' : 'active';

        await db.query(
            'UPDATE `User` SET trang_thai = ? WHERE ma_nguoi_dung = ?',
            [status, req.params.id]
        );

        res.json({ message: banned ? 'Đã cấm người dùng' : 'Đã bỏ cấm người dùng' });
    } catch (error) {
        console.error('Ban user error:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.getUserActivity = async (req, res) => {
    try {
        const [activity] = await db.query(`
            SELECT 
                'document' as type,
                tieu_de as title,
                ngay_tai as date
            FROM TaiLieu
            WHERE ma_nguoi_dung = ?
            ORDER BY ngay_tai DESC
            LIMIT 20
        `, [req.params.id]);

        res.json(activity);
    } catch (error) {
        console.error('Get user activity error:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// ===================================
// DOCUMENTS MANAGEMENT
// ===================================

exports.getAllDocuments = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', status = '' } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT tl.*, nd.email, mh.ten_mon_hoc, dm.ten_danh_muc
            FROM TaiLieu tl
            LEFT JOIN User nd ON tl.ma_nguoi_dung = nd.ma_nguoi_dung
            LEFT JOIN MonHoc mh ON tl.ma_mon_hoc = mh.ma_mon_hoc
            LEFT JOIN DanhMuc dm ON tl.ma_danh_muc = dm.ma_danh_muc
            WHERE 1=1
        `;
        const params = [];

        if (search) {
            query += ' AND tl.tieu_de LIKE ?';
            params.push(`%${search}%`);
        }

        if (status) {
            query += ' AND tl.trang_thai = ?';
            params.push(status);
        }

        query += ' ORDER BY tl.ngay_tai DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), offset);

        const [documents] = await db.query(query, params);
        
        const [countResult] = await db.query(
            'SELECT COUNT(*) as total FROM TaiLieu WHERE 1=1' + 
            (search ? ' AND tieu_de LIKE ?' : '') +
            (status ? ' AND trang_thai = ?' : ''),
            params.slice(0, -2)
        );

        res.json({
            documents,
            total: countResult[0].total,
            page: parseInt(page),
            totalPages: Math.ceil(countResult[0].total / limit)
        });
    } catch (error) {
        console.error('Get all documents error:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.getDocumentDetails = async (req, res) => {
    try {
        const [documents] = await db.query(`
            SELECT tl.*, nd.email, mh.ten_mon_hoc, dm.ten_danh_muc
            FROM TaiLieu tl
            LEFT JOIN User nd ON tl.ma_nguoi_dung = nd.ma_nguoi_dung
            LEFT JOIN MonHoc mh ON tl.ma_mon_hoc = mh.ma_mon_hoc
            LEFT JOIN DanhMuc dm ON tl.ma_danh_muc = dm.ma_danh_muc
            WHERE tl.ma_tai_lieu = ?
        `, [req.params.id]);

        if (documents.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
        }

        res.json(documents[0]);
    } catch (error) {
        console.error('Get document details error:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.getRecentDocuments = async (req, res) => {
    try {
        const [documents] = await db.query(`
            SELECT tl.*, nd.email, mh.ten_mon_hoc, dm.ten_danh_muc
            FROM TaiLieu tl
            LEFT JOIN User nd ON tl.ma_nguoi_dung = nd.ma_nguoi_dung
            LEFT JOIN MonHoc mh ON tl.ma_mon_hoc = mh.ma_mon_hoc
            LEFT JOIN DanhMuc dm ON tl.ma_danh_muc = dm.ma_danh_muc
            ORDER BY tl.ngay_tai DESC
            LIMIT 10
        `);
        res.json(documents);
    } catch (error) {
        console.error('Get recent documents error:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.approveDocument = async (req, res) => {
    try {
        await db.query(
            'UPDATE TaiLieu SET trang_thai = ? WHERE ma_tai_lieu = ?',
            ['approved', req.params.id]
        );

        res.json({ message: 'Đã duyệt tài liệu' });
    } catch (error) {
        console.error('Approve document error:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.rejectDocument = async (req, res) => {
    try {
        const { reason } = req.body;
        const status = 'rejected';

        await db.query(
            'UPDATE TaiLieu SET trang_thai = ?, ly_do_tu_choi = ? WHERE ma_tai_lieu = ?',
            [status, reason, req.params.id]
        );

        res.json({ message: 'Đã từ chối tài liệu' });
    } catch (error) {
        console.error('Reject document error:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.deleteDocument = async (req, res) => {
    try {
        await db.query('DELETE FROM TaiLieu WHERE ma_tai_lieu = ?', [req.params.id]);
        res.json({ message: 'Xóa tài liệu thành công' });
    } catch (error) {
        console.error('Delete document error:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.updateDocumentVisibility = async (req, res) => {
    try {
        const { visible } = req.body;
        // Schema mới dùng trang_thai thay vì hien_thi
        // visible true = 'approved', false = 'rejected'
        const status = visible ? 'approved' : 'rejected';

        await db.query(
            'UPDATE TaiLieu SET trang_thai = ? WHERE ma_tai_lieu = ?',
            [status, req.params.id]
        );

        res.json({ message: 'Cập nhật hiển thị thành công' });
    } catch (error) {
        console.error('Update document visibility error:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.getPendingDocuments = async (req, res) => {
    try {
        const [documents] = await db.query(`
            SELECT tl.*, nd.email, mh.ten_mon_hoc
            FROM TaiLieu tl
            LEFT JOIN User nd ON tl.ma_nguoi_dung = nd.ma_nguoi_dung
            LEFT JOIN MonHoc mh ON tl.ma_mon_hoc = mh.ma_mon_hoc
            WHERE tl.trang_thai = 'pending'
            ORDER BY tl.ngay_tai DESC
        `);
        
        res.json(documents);
    } catch (error) {
        console.error('Get pending documents error:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// ===================================
// CATEGORIES & SUBJECTS MANAGEMENT
// ===================================

exports.getAllCategories = async (req, res) => {
    try {
        const [categories] = await db.query('SELECT * FROM DanhMuc ORDER BY ten_danh_muc');
        res.json(categories);
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const { ten_danh_muc, mo_ta } = req.body;

        const [result] = await db.query(
            'INSERT INTO DanhMuc (ten_danh_muc, mo_ta) VALUES (?, ?)',
            [ten_danh_muc, mo_ta]
        );

        res.status(201).json({ 
            message: 'Tạo danh mục thành công',
            id: result.insertId 
        });
    } catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { ten_danh_muc, mo_ta } = req.body;

        await db.query(
            'UPDATE DanhMuc SET ten_danh_muc = ?, mo_ta = ? WHERE ma_danh_muc = ?',
            [ten_danh_muc, mo_ta, req.params.id]
        );

        res.json({ message: 'Cập nhật danh mục thành công' });
    } catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        await db.query('DELETE FROM DanhMuc WHERE ma_danh_muc = ?', [req.params.id]);
        res.json({ message: 'Xóa danh mục thành công' });
    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.getAllSubjects = async (req, res) => {
    try {
        const [subjects] = await db.query('SELECT * FROM MonHoc ORDER BY ten_mon_hoc');
        res.json(subjects);
    } catch (error) {
        console.error('Get subjects error:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.createSubject = async (req, res) => {
    try {
        const { ten_mon_hoc, mo_ta } = req.body;

        const [result] = await db.query(
            'INSERT INTO MonHoc (ten_mon_hoc, mo_ta) VALUES (?, ?)',
            [ten_mon_hoc, mo_ta]
        );

        res.status(201).json({ 
            message: 'Tạo môn học thành công',
            id: result.insertId 
        });
    } catch (error) {
        console.error('Create subject error:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.updateSubject = async (req, res) => {
    try {
        const { ten_mon_hoc, mo_ta } = req.body;

        await db.query(
            'UPDATE MonHoc SET ten_mon_hoc = ?, mo_ta = ? WHERE ma_mon_hoc = ?',
            [ten_mon_hoc, mo_ta, req.params.id]
        );

        res.json({ message: 'Cập nhật môn học thành công' });
    } catch (error) {
        console.error('Update subject error:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.deleteSubject = async (req, res) => {
    try {
        await db.query('DELETE FROM MonHoc WHERE ma_mon_hoc = ?', [req.params.id]);
        res.json({ message: 'Xóa môn học thành công' });
    } catch (error) {
        console.error('Delete subject error:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// ===================================
// ADDITIONAL MANAGEMENT FUNCTIONS
// ===================================

exports.getAllReports = async (req, res) => {
    try {
        // Implement based on your reports table structure
        res.json({ message: 'Feature coming soon' });
    } catch (error) {
        console.error('Get reports error:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.getReportDetails = async (req, res) => {
    try {
        res.json({ message: 'Feature coming soon' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.handleReport = async (req, res) => {
    try {
        res.json({ message: 'Feature coming soon' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.deleteReport = async (req, res) => {
    try {
        res.json({ message: 'Feature coming soon' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.getAllComments = async (req, res) => {
    try {
        res.json({ message: 'Feature coming soon' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        res.json({ message: 'Feature coming soon' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.getFlaggedComments = async (req, res) => {
    try {
        res.json({ message: 'Feature coming soon' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.getActivityLogs = async (req, res) => {
    try {
        res.json({ message: 'Feature coming soon' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.getAdminActionLogs = async (req, res) => {
    try {
        res.json({ message: 'Feature coming soon' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.getSystemSettings = async (req, res) => {
    try {
        res.json({ message: 'Feature coming soon' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.updateSystemSettings = async (req, res) => {
    try {
        res.json({ message: 'Feature coming soon' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.createBackup = async (req, res) => {
    try {
        res.json({ message: 'Feature coming soon' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.getBackupList = async (req, res) => {
    try {
        res.json({ message: 'Feature coming soon' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.restoreBackup = async (req, res) => {
    try {
        res.json({ message: 'Feature coming soon' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.exportUsers = async (req, res) => {
    try {
        const [users] = await db.query('SELECT * FROM User');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.exportDocuments = async (req, res) => {
    try {
        const [documents] = await db.query('SELECT * FROM TaiLieu');
        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.getAnalyticsReport = async (req, res) => {
    try {
        res.json({ message: 'Feature coming soon' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Update document status (approve/reject)
exports.updateDocumentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { trang_thai } = req.body;
        
        await db.query(
            'UPDATE TaiLieu SET trang_thai = ? WHERE ma_tai_lieu = ?',
            [trang_thai, id]
        );
        
        res.json({ success: true, message: 'Cập nhật trạng thái thành công' });
    } catch (error) {
        console.error('Update document status error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};
