exports.getAllCategories = async (req, res) => {
    try {
        const { getSchemaPool } = require('../config/database');
        const pool = await getSchemaPool();
        
        if (!pool) {
            return res.status(500).json({ message: 'Không thể kết nối database' });
        }

        const [categories] = await pool.query('SELECT * FROM DanhMuc ORDER BY ten_danh_muc');
        res.json(categories);
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ message: 'Lỗi khi lấy danh mục' });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const { getSchemaPool } = require('../config/database');
        const pool = await getSchemaPool();
        
        if (!pool) {
            return res.status(500).json({ message: 'Không thể kết nối database' });
        }

        const [rows] = await pool.query('SELECT * FROM DanhMuc WHERE ma_danh_muc = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy danh mục' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error('Get category error:', error);
        res.status(500).json({ message: 'Lỗi khi lấy danh mục' });
    }
};

exports.getAllSubjects = async (req, res) => {
    try {
        const { getSchemaPool } = require('../config/database');
        const pool = await getSchemaPool();
        
        if (!pool) {
            return res.status(500).json({ message: 'Không thể kết nối database' });
        }

        const [subjects] = await pool.query('SELECT * FROM MonHoc ORDER BY ten_mon_hoc');
        res.json(subjects);
    } catch (error) {
        console.error('Get subjects error:', error);
        res.status(500).json({ message: 'Lỗi khi lấy môn học' });
    }
};

exports.getSubjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const { getSchemaPool } = require('../config/database');
        const pool = await getSchemaPool();
        
        if (!pool) {
            return res.status(500).json({ message: 'Không thể kết nối database' });
        }

        const [rows] = await pool.query('SELECT * FROM MonHoc WHERE ma_mon_hoc = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy môn học' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error('Get subject error:', error);
        res.status(500).json({ message: 'Lỗi khi lấy môn học' });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const { ten_danh_muc, mo_ta } = req.body;
        const { getSchemaPool } = require('../config/database');
        const pool = await getSchemaPool();
        
        if (!pool) {
            return res.status(500).json({ message: 'Không thể kết nối database' });
        }

        await pool.query(
            'INSERT INTO DanhMuc (ten_danh_muc, mo_ta) VALUES (?, ?)',
            [ten_danh_muc, mo_ta]
        );
        
        res.json({ success: true, message: 'Tạo danh mục thành công' });
    } catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi tạo danh mục' });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { ten_danh_muc, mo_ta } = req.body;
        const { getSchemaPool } = require('../config/database');
        const pool = await getSchemaPool();
        
        if (!pool) {
            return res.status(500).json({ message: 'Không thể kết nối database' });
        }

        await pool.query(
            'UPDATE DanhMuc SET ten_danh_muc = ?, mo_ta = ? WHERE ma_danh_muc = ?',
            [ten_danh_muc, mo_ta, id]
        );
        
        res.json({ success: true, message: 'Cập nhật danh mục thành công' });
    } catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi cập nhật danh mục' });
    }
};

exports.createSubject = async (req, res) => {
    try {
        const { ten_mon_hoc, mo_ta } = req.body;
        const { getSchemaPool } = require('../config/database');
        const pool = await getSchemaPool();
        
        if (!pool) {
            return res.status(500).json({ message: 'Không thể kết nối database' });
        }

        await pool.query(
            'INSERT INTO MonHoc (ten_mon_hoc, mo_ta) VALUES (?, ?)',
            [ten_mon_hoc, mo_ta]
        );
        
        res.json({ success: true, message: 'Tạo môn học thành công' });
    } catch (error) {
        console.error('Create subject error:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi tạo môn học' });
    }
};

exports.updateSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const { ten_mon_hoc, mo_ta } = req.body;
        const { getSchemaPool } = require('../config/database');
        const pool = await getSchemaPool();
        
        if (!pool) {
            return res.status(500).json({ message: 'Không thể kết nối database' });
        }

        await pool.query(
            'UPDATE MonHoc SET ten_mon_hoc = ?, mo_ta = ? WHERE ma_mon_hoc = ?',
            [ten_mon_hoc, mo_ta, id]
        );
        
        res.json({ success: true, message: 'Cập nhật môn học thành công' });
    } catch (error) {
        console.error('Update subject error:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi cập nhật môn học' });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { getSchemaPool } = require('../config/database');
        const pool = await getSchemaPool();
        
        if (!pool) {
            return res.status(500).json({ message: 'Không thể kết nối database' });
        }

        await pool.query('DELETE FROM DanhMuc WHERE ma_danh_muc = ?', [id]);
        
        res.json({ success: true, message: 'Xóa danh mục thành công' });
    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi xóa danh mục' });
    }
};

exports.deleteSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const { getSchemaPool } = require('../config/database');
        const pool = await getSchemaPool();
        
        if (!pool) {
            return res.status(500).json({ message: 'Không thể kết nối database' });
        }

        await pool.query('DELETE FROM MonHoc WHERE ma_mon_hoc = ?', [id]);
        
        res.json({ success: true, message: 'Xóa môn học thành công' });
    } catch (error) {
        console.error('Delete subject error:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi xóa môn học' });
    }
};