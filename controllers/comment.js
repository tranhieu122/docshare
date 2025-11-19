// Get comments by document
exports.getCommentsByDocument = async (req, res) => {
    try {
        const { documentId } = req.params;
        const { getSchemaPool } = require('../config/database');
        const pool = await getSchemaPool();
        
        if (!pool) {
            return res.status(500).json({ message: 'Không thể kết nối database' });
        }

        const [rows] = await pool.query(
            `SELECT bl.*, u.email 
             FROM BinhLuan bl 
             LEFT JOIN User u ON bl.ma_nguoi_dung = u.ma_nguoi_dung
             WHERE bl.ma_tai_lieu = ?
             ORDER BY bl.ngay_binh_luan DESC`,
            [documentId]
        );

        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Get comments error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// Create comment
exports.createComment = async (req, res) => {
    try {
        const { noi_dung, ma_tai_lieu } = req.body;
        const userId = req.user.id;
        const { getSchemaPool } = require('../config/database');
        const pool = await getSchemaPool();
        
        if (!pool) {
            return res.status(500).json({ message: 'Không thể kết nối database' });
        }

        if (!noi_dung || !ma_tai_lieu) {
            return res.status(400).json({ message: 'Thiếu thông tin bình luận' });
        }

        await pool.query(
            'INSERT INTO BinhLuan (ma_tai_lieu, ma_nguoi_dung, noi_dung, ngay_binh_luan) VALUES (?, ?, ?, NOW())',
            [ma_tai_lieu, userId, noi_dung]
        );

        res.json({ success: true, message: 'Bình luận thành công' });
    } catch (error) {
        console.error('Create comment error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// Update comment
exports.updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { noi_dung } = req.body;
        const userId = req.user.id;
        const { getSchemaPool } = require('../config/database');
        const pool = await getSchemaPool();
        
        if (!pool) {
            return res.status(500).json({ message: 'Không thể kết nối database' });
        }

        // Check ownership
        const [comments] = await pool.query(
            'SELECT * FROM BinhLuan WHERE ma_binh_luan = ? AND ma_nguoi_dung = ?',
            [id, userId]
        );

        if (comments.length === 0) {
            return res.status(403).json({ message: 'Không có quyền chỉnh sửa bình luận này' });
        }

        await pool.query(
            'UPDATE BinhLuan SET noi_dung = ? WHERE ma_binh_luan = ?',
            [noi_dung, id]
        );

        res.json({ success: true, message: 'Cập nhật bình luận thành công' });
    } catch (error) {
        console.error('Update comment error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// Delete comment
exports.deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;
        const { getSchemaPool } = require('../config/database');
        const pool = await getSchemaPool();
        
        if (!pool) {
            return res.status(500).json({ message: 'Không thể kết nối database' });
        }

        // Admin can delete any comment, user can only delete their own
        if (userRole !== 'admin') {
            const [comments] = await pool.query(
                'SELECT * FROM BinhLuan WHERE ma_binh_luan = ? AND ma_nguoi_dung = ?',
                [id, userId]
            );

            if (comments.length === 0) {
                return res.status(403).json({ message: 'Không có quyền xóa bình luận này' });
            }
        }

        await pool.query('DELETE FROM BinhLuan WHERE ma_binh_luan = ?', [id]);

        res.json({ success: true, message: 'Xóa bình luận thành công' });
    } catch (error) {
        console.error('Delete comment error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};