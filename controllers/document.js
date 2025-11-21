const store = require('../data/store');

// Subject and category mappings
const subjectMap = {
    1: 'Toán cao cấp',
    2: 'Lập trình C++',
    3: 'Cơ sở dữ liệu',
    4: 'Tiếng Anh chuyên ngành',
    5: 'Vật lý đại cương',
    6: 'Hóa học đại cương',
    7: 'Kinh tế vi mô',
    8: 'Kỹ thuật phần mềm',
    9: 'Mạng máy tính',
    10: 'Triết học Mác-Lênin',
    11: 'Pháp luật đại cương',
    12: 'Cấu trúc dữ liệu'
};

const categoryMap = {
    1: 'Lập trình',
    2: 'Toán học',
    3: 'Tiếng Anh',
    4: 'Khoa học tự nhiên',
    5: 'Kinh tế',
    6: 'Kỹ thuật',
    7: 'Chính trị - Pháp luật'
};

// Helper function to add subject and category names to documents
function enrichDocument(doc) {
    return {
        ...doc,
        ten_mon_hoc: subjectMap[doc.ma_mon_hoc] || 'N/A',
        ten_danh_muc: categoryMap[doc.ma_danh_muc] || 'N/A'
    };
}

// Debug endpoint to see all documents in store
exports.getAllDocumentsDebug = async (req, res) => {
    res.json({ 
        total: store.documents.length,
        docs: store.documents.map(d => ({ id: d.ma_tai_lieu, owner: d.ma_nguoi_dung, email: d.email, title: d.tieu_de }))
    });
};

exports.getAllDocuments = async (req, res) => {
    try {
        const { getSchemaPool } = require('../config/database');
        const pool = await getSchemaPool();
        
        if (!pool) {
            return res.status(500).json({ message: 'Không thể kết nối database' });
        }

        const [docs] = await pool.query(`
            SELECT 
                t.ma_tai_lieu,
                t.tieu_de,
                t.mo_ta,
                t.ma_mon_hoc,
                t.ma_danh_muc,
                t.ten_tap,
                t.ngay_tai,
                t.so_luot_xem,
                t.so_luot_tai,
                t.ma_nguoi_dung,
                u.email,
                m.ten_mon_hoc,
                d.ten_danh_muc
            FROM TaiLieu t
            LEFT JOIN User u ON t.ma_nguoi_dung = u.ma_nguoi_dung
            LEFT JOIN MonHoc m ON t.ma_mon_hoc = m.ma_mon_hoc
            LEFT JOIN DanhMuc d ON t.ma_danh_muc = d.ma_danh_muc
            ORDER BY t.ngay_tai DESC
        `);
        
        res.json(docs);
    } catch (error) {
        console.error('Get all documents error:', error);
        res.status(500).json({ message: 'Lỗi khi tải danh sách tài liệu' });
    }
};

exports.getRecentDocuments = async (req, res) => {
    try {
        const { getSchemaPool } = require('../config/database');
        const pool = await getSchemaPool();
        
        if (!pool) {
            return res.status(500).json({ message: 'Không thể kết nối database' });
        }

        const [docs] = await pool.query(`
            SELECT 
                t.ma_tai_lieu,
                t.tieu_de,
                t.mo_ta,
                t.ma_mon_hoc,
                t.ma_danh_muc,
                t.ten_tap,
                t.ngay_tai,
                t.so_luot_xem,
                t.so_luot_tai,
                u.email,
                m.ten_mon_hoc,
                d.ten_danh_muc
            FROM TaiLieu t
            LEFT JOIN User u ON t.ma_nguoi_dung = u.ma_nguoi_dung
            LEFT JOIN MonHoc m ON t.ma_mon_hoc = m.ma_mon_hoc
            LEFT JOIN DanhMuc d ON t.ma_danh_muc = d.ma_danh_muc
            ORDER BY t.ngay_tai DESC
            LIMIT 5
        `);
        
        res.json(docs);
    } catch (error) {
        console.error('Get recent documents error:', error);
        res.status(500).json({ message: 'Lỗi khi tải tài liệu mới nhất' });
    }
};

exports.getDocumentById = async (req, res) => {
    try {
        const docId = parseInt(req.params.id, 10);
        
        // Validate document ID
        if (!docId || isNaN(docId)) {
            return res.status(400).json({ message: 'ID tài liệu không hợp lệ' });
        }
        
        const { getSchemaPool } = require('../config/database');
        const pool = await getSchemaPool();
        
        if (!pool) {
            return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
        }

        const [docs] = await pool.query(`
            SELECT 
                t.ma_tai_lieu,
                t.tieu_de,
                t.mo_ta,
                t.ma_mon_hoc,
                t.ma_danh_muc,
                t.ten_tap,
                t.ngay_tai,
                t.so_luot_xem,
                t.so_luot_tai,
                t.ma_nguoi_dung,
                u.email,
                m.ten_mon_hoc,
                d.ten_danh_muc
            FROM TaiLieu t
            LEFT JOIN User u ON t.ma_nguoi_dung = u.ma_nguoi_dung
            LEFT JOIN MonHoc m ON t.ma_mon_hoc = m.ma_mon_hoc
            LEFT JOIN DanhMuc d ON t.ma_danh_muc = d.ma_danh_muc
            WHERE t.ma_tai_lieu = ?
        `, [docId]);
        
        if (docs.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
        }
        
        res.json(docs[0]);
    } catch (error) {
        console.error('Get document error:', error);
        res.status(404).json({ message: 'Không tìm thấy tài liệu' });
    }
};

exports.uploadDocument = async (req, res) => {
    try {
        const { tieu_de, mo_ta, ma_mon_hoc, ma_danh_muc } = req.body;
        const file = req.file;
        const user = req.user;

        console.log('=== UPLOAD REQUEST ===');
        console.log('User:', user);
        console.log('Body:', { tieu_de, mo_ta, ma_mon_hoc, ma_danh_muc });
        console.log('Body types:', { 
            tieu_de: typeof tieu_de, 
            ma_mon_hoc: typeof ma_mon_hoc,
            ma_danh_muc: typeof ma_danh_muc
        });
        console.log('File:', file ? { filename: file.filename, size: file.size, mimetype: file.mimetype } : 'No file');

        if (!user || !user.ma_nguoi_dung) {
            console.error('❌ No user or ma_nguoi_dung');
            return res.status(401).json({ message: 'Chưa đăng nhập' });
        }

        if (!tieu_de || !file) {
            console.error('❌ Missing title or file');
            return res.status(400).json({ message: 'Thiếu tiêu đề hoặc file' });
        }

        // Validate subject is provided and not empty
        console.log('Validating ma_mon_hoc:', ma_mon_hoc, 'isEmpty:', !ma_mon_hoc, 'isZero:', ma_mon_hoc === '0');
        if (!ma_mon_hoc || ma_mon_hoc === '' || ma_mon_hoc === '0') {
            console.error('❌ Invalid subject ID:', ma_mon_hoc);
            return res.status(400).json({ message: 'Vui lòng chọn môn học' });
        }

        const { getSchemaPool } = require('../config/database');
        const schemaPool = await getSchemaPool();

        if (!schemaPool) {
            console.error('❌ Cannot connect to database');
            return res.status(500).json({ message: 'Không thể kết nối database' });
        }

        console.log('✅ Database connected');
        console.log('Inserting:', {
            tieu_de,
            ma_mon_hoc: parseInt(ma_mon_hoc, 10),
            ma_danh_muc: ma_danh_muc ? parseInt(ma_danh_muc, 10) : null,
            ten_tap: file.filename,
            kich_thuoc: file.size,
            loai_tap: file.mimetype,
            ma_nguoi_dung: user.ma_nguoi_dung
        });

        // Insert document info (file stored in uploads folder, managed separately)
        const [result] = await schemaPool.query(
            'INSERT INTO TaiLieu (tieu_de, mo_ta, ma_mon_hoc, ma_danh_muc, ten_tap, kich_thuoc, loai_tap, ma_nguoi_dung) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
                tieu_de, 
                mo_ta || null, 
                parseInt(ma_mon_hoc, 10), 
                ma_danh_muc ? parseInt(ma_danh_muc, 10) : null, 
                file.filename, // Store actual filename that exists in uploads folder
                file.size, 
                file.mimetype,
                user.ma_nguoi_dung
            ]
        );

        const docId = result.insertId;
        console.log('✅ Document inserted with ID:', docId);

        res.json({
            message: 'Upload tài liệu thành công!',
            data: {
                ma_tai_lieu: docId,
                tieu_de,
                mo_ta,
                ten_tap: file.originalname
            }
        });
    } catch (error) {
        console.error('Upload error:', error);
        
        // Delete uploaded file if database insert fails
        if (req.file && req.file.path) {
            const fs = require('fs');
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting file:', err);
            });
        }
        
        let errorMessage = 'Lỗi khi upload tài liệu';
        if (error.code === 'ECONNABORTED' || error.code === 'PROTOCOL_CONNECTION_LOST') {
            errorMessage = 'File quá lớn hoặc kết nối bị gián đoạn. Vui lòng thử file nhỏ hơn hoặc thử lại.';
        } else if (error.code === 'ER_NET_PACKET_TOO_LARGE') {
            errorMessage = 'File vượt quá giới hạn cho phép của server. Vui lòng chọn file nhỏ hơn 10MB.';
        }
        
        res.status(500).json({ message: errorMessage, error: error.message });
    }
};

exports.downloadDocument = async (req, res) => {
    try {
        const docId = parseInt(req.params.id, 10);
        
        if (!docId || isNaN(docId)) {
            return res.status(400).json({ message: 'ID tài liệu không hợp lệ' });
        }
        
        const { getSchemaPool } = require('../config/database');
        const pool = await getSchemaPool();
        
        if (!pool) {
            return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
        }

        // Get file info from schema
        const [docs] = await pool.query('SELECT ten_tap, loai_tap FROM TaiLieu WHERE ma_tai_lieu = ?', [docId]);
        
        if (docs.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
        }

        const doc = docs[0];
        const path = require('path');
        const fs = require('fs');
        const filePath = path.join(__dirname, '..', 'uploads', doc.ten_tap);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File không tồn tại trên server' });
        }

        // Update download count
        await pool.query('UPDATE TaiLieu SET so_luot_tai = so_luot_tai + 1 WHERE ma_tai_lieu = ?', [docId]);

        // Send file as download
        res.setHeader('Content-Type', doc.loai_tap || 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(doc.ten_tap)}"`);
        
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
        
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ message: 'Lỗi khi tải tài liệu' });
    }
};

exports.viewDocument = async (req, res) => {
    try {
        const docId = parseInt(req.params.id, 10);
        
        if (!docId || isNaN(docId)) {
            return res.status(400).json({ message: 'ID tài liệu không hợp lệ' });
        }
        
        const { getSchemaPool } = require('../config/database');
        const pool = await getSchemaPool();
        
        if (!pool) {
            return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
        }

        // Get file info from schema
        const [docs] = await pool.query('SELECT ten_tap, loai_tap FROM TaiLieu WHERE ma_tai_lieu = ?', [docId]);
        
        if (docs.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
        }

        const doc = docs[0];
        const path = require('path');
        const fs = require('fs');
        const filePath = path.join(__dirname, '..', 'uploads', doc.ten_tap);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            console.error('File not found:', filePath);
            return res.status(404).json({ message: 'File không tồn tại trên server' });
        }

        // Update view count
        await pool.query('UPDATE TaiLieu SET so_luot_xem = so_luot_xem + 1 WHERE ma_tai_lieu = ?', [docId]);

        // Determine content type based on file extension
        const ext = path.extname(doc.ten_tap).toLowerCase();
        let contentType = doc.loai_tap || 'application/octet-stream';
        
        const contentTypeMap = {
            '.pdf': 'application/pdf',
            '.doc': 'application/msword',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.xls': 'application/vnd.ms-excel',
            '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            '.ppt': 'application/vnd.ms-powerpoint',
            '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            '.txt': 'text/plain',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif'
        };
        
        if (contentTypeMap[ext]) {
            contentType = contentTypeMap[ext];
        }

        // Send file
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(doc.ten_tap)}"`);
        res.setHeader('Cache-Control', 'public, max-age=3600');
        
        const fileStream = fs.createReadStream(filePath);
        fileStream.on('error', (error) => {
            console.error('File stream error:', error);
            if (!res.headersSent) {
                res.status(500).json({ message: 'Lỗi khi đọc file' });
            }
        });
        fileStream.pipe(res);
        
    } catch (error) {
        console.error('View error:', error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Lỗi khi xem tài liệu' });
        }
    }
};

exports.getMyDocuments = async (req, res) => {
    try {
        const user = req.user;
        console.log('📄 Get My Documents - User:', user);
        
        if (!user) {
            return res.status(401).json({ message: 'Chưa đăng nhập' });
        }
        
        const { getSchemaPool } = require('../config/database');
        const pool = await getSchemaPool();
        
        if (!pool) {
            return res.status(500).json({ message: 'Không thể kết nối database' });
        }

        console.log('📄 Querying documents for user ID:', user.ma_nguoi_dung);

        // Get documents with subject and category names
        const [docs] = await pool.query(`
            SELECT 
                t.ma_tai_lieu,
                t.tieu_de,
                t.mo_ta,
                t.ma_mon_hoc,
                t.ma_danh_muc,
                t.ten_tap,
                t.ngay_tai,
                t.so_luot_xem,
                t.so_luot_tai,
                m.ten_mon_hoc,
                d.ten_danh_muc
            FROM TaiLieu t
            LEFT JOIN MonHoc m ON t.ma_mon_hoc = m.ma_mon_hoc
            LEFT JOIN DanhMuc d ON t.ma_danh_muc = d.ma_danh_muc
            WHERE t.ma_nguoi_dung = ?
            ORDER BY t.ngay_tai DESC
        `, [user.ma_nguoi_dung]);
        
        console.log('📄 Found documents:', docs.length);
        console.log('📄 Documents:', JSON.stringify(docs, null, 2));
        
        res.json(docs);
    } catch (error) {
        console.error('Get my documents error:', error);
        res.status(500).json({ message: 'Lỗi khi tải danh sách tài liệu', error: error.message });
    }
};

exports.getMyStats = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'Chưa đăng nhập' });
        }
        
        const { getSchemaPool } = require('../config/database');
        const pool = await getSchemaPool();
        
        if (!pool) {
            return res.status(500).json({ message: 'Không thể kết nối database' });
        }

        const [stats] = await pool.query(`
            SELECT 
                COUNT(*) as totalDocs,
                SUM(so_luot_xem) as totalViews,
                SUM(so_luot_tai) as totalDownloads
            FROM TaiLieu 
            WHERE ma_nguoi_dung = ?
        `, [user.ma_nguoi_dung]);
        
        res.json({
            totalDocs: parseInt(stats[0].totalDocs) || 0,
            totalViews: parseInt(stats[0].totalViews) || 0,
            totalDownloads: parseInt(stats[0].totalDownloads) || 0
        });
    } catch (error) {
        console.error('Get my stats error:', error);
        res.status(500).json({ message: 'Lỗi khi tải thống kê' });
    }
};

exports.updateDocument = async (req, res) => {
    res.json({ message: 'Document updated' });
};

exports.deleteDocument = async (req, res) => {
    try {
        const docId = parseInt(req.params.id, 10);
        const user = req.user;
        
        if (!user) {
            return res.status(401).json({ message: 'Chưa đăng nhập' });
        }

        const { getSchemaPool, getStoragePool } = require('../config/database');
        const schemaPool = await getSchemaPool();
        const storagePool = await getStoragePool();
        
        if (!schemaPool || !storagePool) {
            return res.status(500).json({ message: 'Không thể kết nối database' });
        }

        // Check if document exists and get owner
        const [docs] = await schemaPool.query('SELECT ma_nguoi_dung FROM TaiLieu WHERE ma_tai_lieu = ?', [docId]);
        
        if (docs.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
        }

        // Only allow owner or admin to delete
        if (user.ma_nguoi_dung !== docs[0].ma_nguoi_dung && user.chuc_vu !== 'admin') {
            return res.status(403).json({ message: 'Không có quyền xóa tài liệu này' });
        }

        // Delete from FileStorage first
        await storagePool.query('DELETE FROM FileStorage WHERE ma_tai_lieu = ?', [docId]);
        
        // Delete from TaiLieu (CASCADE will delete related records)
        await schemaPool.query('DELETE FROM TaiLieu WHERE ma_tai_lieu = ?', [docId]);
        
        res.json({ message: 'Xóa tài liệu thành công' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ message: 'Lỗi khi xóa tài liệu', error: error.message });
    }
};

exports.rateDocument = async (req, res) => {
    try {
        const docId = parseInt(req.params.id, 10);
        const user = req.user;
        const { so_sao } = req.body;
        
        console.log('📊 Rating Request:', { docId, userId: user?.ma_nguoi_dung, so_sao });
        
        if (!user) {
            console.error('❌ Rating failed: User not authenticated');
            return res.status(401).json({ message: 'Chưa đăng nhập' });
        }
        
        if (!so_sao || so_sao < 1 || so_sao > 5) {
            return res.status(400).json({ message: 'Số sao phải từ 1 đến 5' });
        }

        const { getSchemaPool } = require('../config/database');
        const pool = await getSchemaPool();
        
        if (!pool) {
            return res.status(500).json({ message: 'Không thể kết nối database' });
        }

        // Check if document exists
        const [docs] = await pool.query('SELECT ma_tai_lieu FROM TaiLieu WHERE ma_tai_lieu = ?', [docId]);
        if (docs.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
        }

        // Check if user already rated
        const [existing] = await pool.query(
            'SELECT ma_danh_gia FROM DanhGia WHERE ma_nguoi_dung = ? AND ma_tai_lieu = ?',
            [user.ma_nguoi_dung, docId]
        );

        if (existing.length > 0) {
            // Update existing rating (ngay_cap_nhat auto-updates)
            await pool.query(
                'UPDATE DanhGia SET diem_so = ? WHERE ma_nguoi_dung = ? AND ma_tai_lieu = ?',
                [so_sao, user.ma_nguoi_dung, docId]
            );
        } else {
            // Insert new rating (ma_danh_gia AUTO_INCREMENT, ngay_tao/ngay_cap_nhat auto-set)
            await pool.query(
                'INSERT INTO DanhGia (ma_nguoi_dung, ma_tai_lieu, diem_so) VALUES (?, ?, ?)',
                [user.ma_nguoi_dung, docId, so_sao]
            );
        }

        console.log('✅ Rating successful:', { docId, userId: user.ma_nguoi_dung, so_sao });
        res.json({ message: 'Đánh giá thành công', so_sao });
    } catch (error) {
        console.error('❌ Rate document error:', error);
        console.error('Error details:', { message: error.message, stack: error.stack });
        res.status(500).json({ message: 'Lỗi khi đánh giá tài liệu' });
    }
};

exports.getDocumentRating = async (req, res) => {
    try {
        const docId = parseInt(req.params.id, 10);
        const { getSchemaPool } = require('../config/database');
        const pool = await getSchemaPool();
        
        if (!pool) {
            return res.status(500).json({ message: 'Không thể kết nối database' });
        }

        // Get average rating and total ratings
        const [stats] = await pool.query(`
            SELECT 
                COALESCE(AVG(diem_so), 0) as avgRating,
                COUNT(*) as totalRatings
            FROM DanhGia 
            WHERE ma_tai_lieu = ?
        `, [docId]);

        // Get user's rating if logged in
        let userRating = 0;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const jwt = require('jsonwebtoken');
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-this');
                const [userRate] = await pool.query(
                    'SELECT diem_so FROM DanhGia WHERE ma_nguoi_dung = ? AND ma_tai_lieu = ?',
                    [decoded.ma_nguoi_dung, docId]
                );
                if (userRate.length > 0) {
                    userRating = userRate[0].diem_so;
                }
            } catch (err) {
                // Token invalid, ignore
            }
        }

        res.json({
            avgRating: parseFloat(stats[0].avgRating || 0),
            totalRatings: stats[0].totalRatings || 0,
            userRating: userRating
        });
    } catch (error) {
        console.error('Get rating error:', error);
        res.status(500).json({ 
            avgRating: 0, 
            totalRatings: 0,
            userRating: 0 
        });
    }
};

exports.getDocumentComments = async (req, res) => {
    try {
        const docId = parseInt(req.params.id, 10);
        const { getSchemaPool } = require('../config/database');
        const pool = await getSchemaPool();
        
        if (!pool) {
            return res.status(500).json({ message: 'Không thể kết nối database' });
        }

        const [comments] = await pool.query(`
            SELECT 
                b.ma_binh_luan,
                b.ma_nguoi_dung,
                b.ma_tai_lieu,
                b.noi_dung,
                b.ngay_tao,
                u.email
            FROM BinhLuan b
            LEFT JOIN User u ON b.ma_nguoi_dung = u.ma_nguoi_dung
            WHERE b.ma_tai_lieu = ?
            ORDER BY b.ngay_tao DESC
        `, [docId]);
        
        res.json(comments);
    } catch (error) {
        console.error('Get comments error:', error);
        res.status(500).json({ message: 'Lỗi khi tải bình luận' });
    }
};

exports.addComment = async (req, res) => {
    try {
        const docId = parseInt(req.params.id, 10);
        const user = req.user;
        const { noi_dung } = req.body;
        
        if (!user) {
            return res.status(401).json({ message: 'Chưa đăng nhập' });
        }
        
        if (!noi_dung || noi_dung.trim() === '') {
            return res.status(400).json({ message: 'Thiếu nội dung bình luận' });
        }

        const { getSchemaPool } = require('../config/database');
        const pool = await getSchemaPool();
        
        if (!pool) {
            return res.status(500).json({ message: 'Không thể kết nối database' });
        }

        // Check if document exists
        const [docs] = await pool.query('SELECT ma_tai_lieu FROM TaiLieu WHERE ma_tai_lieu = ?', [docId]);
        if (docs.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
        }

        // Insert comment (ma_binh_luan AUTO_INCREMENT, ngay_tao/ngay_cap_nhat auto-set)
        const [result] = await pool.query(
            'INSERT INTO BinhLuan (ma_nguoi_dung, ma_tai_lieu, noi_dung) VALUES (?, ?, ?)',
            [user.ma_nguoi_dung, docId, noi_dung]
        );

        res.json({ 
            message: 'Bình luận đã được ghi nhận',
            data: {
                ma_binh_luan: result.insertId,
                ma_nguoi_dung: user.ma_nguoi_dung,
                ma_tai_lieu: docId,
                noi_dung: noi_dung.trim(),
                ngay_tao: new Date(),
                email: user.email
            }
        });
    } catch (error) {
        console.error('Add comment error:', error);
        res.status(500).json({ message: 'Lỗi khi thêm bình luận' });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const commentId = parseInt(req.params.commentId, 10);
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: 'Chưa đăng nhập' });
        }

        const { getSchemaPool } = require('../config/database');
        const pool = await getSchemaPool();
        
        if (!pool) {
            return res.status(500).json({ message: 'Không thể kết nối database' });
        }

        // Check if comment exists and get owner
        const [comments] = await pool.query('SELECT ma_nguoi_dung FROM BinhLuan WHERE ma_binh_luan = ?', [commentId]);
        
        if (comments.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy bình luận' });
        }

        // Only allow comment owner or admin to delete
        if (user.ma_nguoi_dung !== comments[0].ma_nguoi_dung && user.chuc_vu !== 'admin') {
            return res.status(403).json({ message: 'Không có quyền xóa bình luận này' });
        }

        // Delete comment
        await pool.query('DELETE FROM BinhLuan WHERE ma_binh_luan = ?', [commentId]);
        
        res.json({ message: 'Xóa bình luận thành công' });
    } catch (error) {
        console.error('Delete comment error:', error);
        res.status(500).json({ message: 'Lỗi khi xóa bình luận' });
    }
};

// Search documents
exports.searchDocuments = async (req, res) => {
    try {
        const { q, subject, category } = req.query;
        const { getSchemaPool } = require('../config/database');
        const pool = await getSchemaPool();
        
        if (!pool) {
            return res.status(500).json({ message: 'Không thể kết nối database' });
        }

        let query = `
            SELECT t.*, u.email, m.ten_mon_hoc, d.ten_danh_muc
            FROM TaiLieu t
            LEFT JOIN User u ON t.ma_nguoi_dung = u.ma_nguoi_dung
            LEFT JOIN MonHoc m ON t.ma_mon_hoc = m.ma_mon_hoc
            LEFT JOIN DanhMuc d ON t.ma_danh_muc = d.ma_danh_muc
            WHERE 1=1
        `;
        const params = [];

        if (q) {
            query += ' AND (t.tieu_de LIKE ? OR t.mo_ta LIKE ?)';
            params.push(`%${q}%`, `%${q}%`);
        }

        if (subject) {
            query += ' AND t.ma_mon_hoc = ?';
            params.push(subject);
        }

        if (category) {
            query += ' AND t.ma_danh_muc = ?';
            params.push(category);
        }

        query += ' ORDER BY t.ngay_dang DESC';

        const [rows] = await pool.query(query, params);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// Get document ratings
exports.getDocumentRatings = async (req, res) => {
    try {
        const { id } = req.params;
        const { getSchemaPool } = require('../config/database');
        const pool = await getSchemaPool();
        
        if (!pool) {
            return res.status(500).json({ message: 'Không thể kết nối database' });
        }

        const [rows] = await pool.query(
            `SELECT dg.*, u.email 
             FROM DanhGia dg 
             LEFT JOIN User u ON dg.ma_nguoi_dung = u.ma_nguoi_dung
             WHERE dg.ma_tai_lieu = ?
             ORDER BY dg.ngay_danh_gia DESC`,
            [id]
        );

        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Get ratings error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};