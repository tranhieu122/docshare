// Tiếp theo từ phần 1...

// Get my documents
exports.getMyDocuments = async (req, res) => {
    try {
        const userId = req.user.ma_nguoi_dung;
        const pool = await getSchemaPool();
        
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT 
                    t.*,
                    m.ten_mon_hoc,
                    d.ten_danh_muc
                FROM TaiLieu t
                LEFT JOIN MonHoc m ON t.ma_mon_hoc = m.ma_mon_hoc
                LEFT JOIN DanhMuc d ON t.ma_danh_muc = d.ma_danh_muc
                WHERE t.ma_nguoi_dung = @userId
                ORDER BY t.ngay_tai DESC
            `);

        res.json(result.recordset);
    } catch (error) {
        console.error('Error getting my documents:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Get my stats
exports.getMyStats = async (req, res) => {
    try {
        const userId = req.user.ma_nguoi_dung;
        const pool = await getSchemaPool();
        
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT 
                    COUNT(*) as totalDocs,
                    ISNULL(SUM(so_luot_xem), 0) as totalViews,
                    ISNULL(SUM(so_luot_tai), 0) as totalDownloads
                FROM TaiLieu
                WHERE ma_nguoi_dung = @userId
            `);

        res.json(result.recordset[0]);
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Update document
exports.updateDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const { tieu_de, mo_ta } = req.body;
        const userId = req.user.ma_nguoi_dung;
        
        const pool = await getSchemaPool();

        // Check ownership
        const checkResult = await pool.request()
            .input('id', sql.Int, id)
            .input('userId', sql.Int, userId)
            .query('SELECT * FROM TaiLieu WHERE ma_tai_lieu = @id AND ma_nguoi_dung = @userId');

        if (checkResult.recordset.length === 0) {
            return res.status(403).json({ message: 'Bạn không có quyền sửa tài liệu này' });
        }

        // Update
        await pool.request()
            .input('id', sql.Int, id)
            .input('tieu_de', sql.NVarChar, tieu_de)
            .input('mo_ta', sql.NVarChar, mo_ta)
            .query(`
                UPDATE TaiLieu 
                SET tieu_de = @tieu_de, mo_ta = @mo_ta
                WHERE ma_tai_lieu = @id
            `);

        res.json({ message: 'Cập nhật thành công' });
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Delete document
exports.deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.ma_nguoi_dung;
        const isAdmin = req.user.chuc_vu === 'admin';
        
        const schemaPool = await getSchemaPool();
        const storagePool = await getStoragePool();

        // Check ownership (admin can delete all)
        if (!isAdmin) {
            const checkResult = await schemaPool.request()
                .input('id', sql.Int, id)
                .input('userId', sql.Int, userId)
                .query('SELECT * FROM TaiLieu WHERE ma_tai_lieu = @id AND ma_nguoi_dung = @userId');

            if (checkResult.recordset.length === 0) {
                return res.status(403).json({ message: 'Bạn không có quyền xóa tài liệu này' });
            }
        }

        // Delete from Storage DB first
        await storagePool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM FileStorage WHERE ma_tai_lieu = @id');

        // Delete comments
        await schemaPool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM BinhLuan WHERE ma_tai_lieu = @id');

        // Delete ratings
        await schemaPool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM DanhGia WHERE ma_tai_lieu = @id');

        // Delete downloads
        await schemaPool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM TaiXuong WHERE ma_tai_lieu = @id');

        // Delete from Schema DB
        await schemaPool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM TaiLieu WHERE ma_tai_lieu = @id');

        res.json({ message: 'Xóa tài liệu thành công' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ message: 'Lỗi khi xóa tài liệu' });
    }
};

// Rate document
exports.rateDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const { so_sao } = req.body;
        const userId = req.user.ma_nguoi_dung;
        
        if (so_sao < 1 || so_sao > 5) {
            return res.status(400).json({ message: 'Đánh giá từ 1-5 sao' });
        }

        const pool = await getSchemaPool();

        // Check if already rated
        const checkResult = await pool.request()
            .input('userId', sql.Int, userId)
            .input('docId', sql.Int, id)
            .query('SELECT * FROM DanhGia WHERE ma_nguoi_dung = @userId AND ma_tai_lieu = @docId');

        if (checkResult.recordset.length > 0) {
            // Update existing rating
            await pool.request()
                .input('userId', sql.Int, userId)
                .input('docId', sql.Int, id)
                .input('so_sao', sql.Int, so_sao)
                .query('UPDATE DanhGia SET so_sao = @so_sao WHERE ma_nguoi_dung = @userId AND ma_tai_lieu = @docId');
        } else {
            // Insert new rating
            await pool.request()
                .input('userId', sql.Int, userId)
                .input('docId', sql.Int, id)
                .input('so_sao', sql.Int, so_sao)
                .input('ngay_tao', sql.DateTime, new Date())
                .query('INSERT INTO DanhGia (ma_nguoi_dung, ma_tai_lieu, so_sao, ngay_tao) VALUES (@userId, @docId, @so_sao, @ngay_tao)');
        }

        res.json({ message: 'Đánh giá thành công' });
    } catch (error) {
        console.error('Rating error:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Get document rating
exports.getDocumentRating = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await getSchemaPool();
        
        const result = await pool.request()
            .input('docId', sql.Int, id)
            .query(`
                SELECT 
                    AVG(CAST(so_sao AS FLOAT)) as avgRating,
                    COUNT(*) as totalRatings
                FROM DanhGia
                WHERE ma_tai_lieu = @docId
            `);

        let userRating = null;
        if (req.headers.authorization) {
            try {
                const token = req.headers.authorization.split(' ')[1];
                const jwt = require('jsonwebtoken');
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'docshare-jwt-secret');
                
                const userResult = await pool.request()
                    .input('userId', sql.Int, decoded.ma_nguoi_dung)
                    .input('docId', sql.Int, id)
                    .query('SELECT so_sao FROM DanhGia WHERE ma_nguoi_dung = @userId AND ma_tai_lieu = @docId');
                
                if (userResult.recordset.length > 0) {
                    userRating = userResult.recordset[0].so_sao;
                }
            } catch (e) {
                // Token invalid, ignore
            }
        }

        res.json({
            avgRating: result.recordset[0].avgRating || 0,
            totalRatings: result.recordset[0].totalRatings || 0,
            userRating
        });
    } catch (error) {
        console.error('Error getting rating:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Get document comments
exports.getDocumentComments = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await getSchemaPool();
        
        const result = await pool.request()
            .input('docId', sql.Int, id)
            .query(`
                SELECT 
                    b.*,
                    u.email
                FROM BinhLuan b
                LEFT JOIN [User] u ON b.ma_nguoi_dung = u.ma_nguoi_dung
                WHERE b.ma_tai_lieu = @docId
                ORDER BY b.ngay_tao DESC
            `);

        res.json(result.recordset);
    } catch (error) {
        console.error('Error getting comments:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Add comment
exports.addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { noi_dung } = req.body;
        const userId = req.user.ma_nguoi_dung;
        
        if (!noi_dung || noi_dung.trim().length === 0) {
            return res.status(400).json({ message: 'Nội dung bình luận không được để trống' });
        }

        const pool = await getSchemaPool();

        await pool.request()
            .input('userId', sql.Int, userId)
            .input('docId', sql.Int, id)
            .input('noi_dung', sql.NVarChar, noi_dung)
            .input('ngay_tao', sql.DateTime, new Date())
            .query('INSERT INTO BinhLuan (ma_nguoi_dung, ma_tai_lieu, noi_dung, ngay_tao) VALUES (@userId, @docId, @noi_dung, @ngay_tao)');

        res.status(201).json({ message: 'Bình luận thành công' });
    } catch (error) {
        console.error('Comment error:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

module.exports = exports;