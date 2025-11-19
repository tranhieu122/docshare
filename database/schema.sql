-- =============================================
-- Document Sharing Platform - Schema Database (MySQL)
-- Version: 2.0 - Optimized
-- =============================================

-- Tạo database
CREATE DATABASE IF NOT EXISTS documentsharing_schema 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE documentsharing_schema;

-- Xóa các bảng cũ (nếu có) theo đúng thứ tự foreign key
DROP TABLE IF EXISTS ThongBao;
DROP TABLE IF EXISTS TaiXuong;
DROP TABLE IF EXISTS BinhLuan;
DROP TABLE IF EXISTS DanhGia;
DROP TABLE IF EXISTS TaiLieu;
DROP TABLE IF EXISTS MonHoc;
DROP TABLE IF EXISTS DanhMuc;
DROP TABLE IF EXISTS `User`;

-- =============================================
-- Bảng User (Người dùng)
-- =============================================
CREATE TABLE `User` (
    ma_nguoi_dung INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    mat_khau VARCHAR(255) NOT NULL,
    ho_ten VARCHAR(255) DEFAULT NULL,
    chuc_vu ENUM('user', 'admin') DEFAULT 'user',
    avatar_url VARCHAR(500) DEFAULT NULL,
    ngay_lap DATETIME DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    trang_thai ENUM('active', 'inactive', 'banned') DEFAULT 'active',
    
    INDEX idx_email (email),
    INDEX idx_chuc_vu (chuc_vu),
    INDEX idx_ngay_lap (ngay_lap DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Bảng DanhMuc (Danh mục)
-- =============================================
CREATE TABLE DanhMuc (
    ma_danh_muc INT AUTO_INCREMENT PRIMARY KEY,
    ten_danh_muc VARCHAR(255) NOT NULL,
    khoa VARCHAR(255) DEFAULT NULL,
    mo_ta TEXT DEFAULT NULL,
    icon VARCHAR(50) DEFAULT NULL,
    mau_sac VARCHAR(50) DEFAULT NULL,
    thu_tu INT DEFAULT 0,
    trang_thai ENUM('active', 'inactive') DEFAULT 'active',
    ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_ten (ten_danh_muc),
    INDEX idx_trang_thai (trang_thai),
    INDEX idx_thu_tu (thu_tu)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Bảng MonHoc (Môn học)
-- =============================================
CREATE TABLE MonHoc (
    ma_mon_hoc INT AUTO_INCREMENT PRIMARY KEY,
    ten_mon_hoc VARCHAR(255) NOT NULL,
    ma_mon VARCHAR(50) DEFAULT NULL,
    mo_ta TEXT DEFAULT NULL,
    so_tin_chi INT DEFAULT NULL,
    hoc_ky INT DEFAULT NULL,
    trang_thai ENUM('active', 'inactive') DEFAULT 'active',
    ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_ten (ten_mon_hoc),
    INDEX idx_ma_mon (ma_mon),
    INDEX idx_trang_thai (trang_thai)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Bảng TaiLieu (Tài liệu) - CHỈ LƯU METADATA
-- =============================================
CREATE TABLE TaiLieu (
    ma_tai_lieu INT AUTO_INCREMENT PRIMARY KEY,
    ma_nguoi_dung INT NOT NULL,
    ma_mon_hoc INT DEFAULT NULL,
    ma_danh_muc INT DEFAULT NULL,
    
    -- Thông tin tài liệu
    tieu_de VARCHAR(500) NOT NULL,
    mo_ta TEXT DEFAULT NULL,
    ten_tap VARCHAR(500) NOT NULL,
    kich_thuoc INT DEFAULT 0 COMMENT 'Kích thước file (bytes)',
    loai_tap VARCHAR(50) DEFAULT NULL COMMENT 'pdf, docx, pptx, etc',
    
    -- Thống kê
    so_luot_xem INT DEFAULT 0,
    so_luot_tai INT DEFAULT 0,
    so_luot_thich INT DEFAULT 0,
    diem_trung_binh DECIMAL(3,2) DEFAULT 0.00,
    so_luot_danh_gia INT DEFAULT 0,
    
    -- Trạng thái
    trang_thai ENUM('pending', 'approved', 'rejected') DEFAULT 'approved',
    ly_do_tu_choi TEXT DEFAULT NULL,
    
    -- Timestamps
    ngay_tai DATETIME DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ngay_duyet DATETIME DEFAULT NULL,
    ma_nguoi_duyet INT DEFAULT NULL,
    
    -- Foreign Keys
    FOREIGN KEY (ma_nguoi_dung) REFERENCES `User`(ma_nguoi_dung) ON DELETE CASCADE,
    FOREIGN KEY (ma_mon_hoc) REFERENCES MonHoc(ma_mon_hoc) ON DELETE SET NULL,
    FOREIGN KEY (ma_danh_muc) REFERENCES DanhMuc(ma_danh_muc) ON DELETE SET NULL,
    FOREIGN KEY (ma_nguoi_duyet) REFERENCES `User`(ma_nguoi_dung) ON DELETE SET NULL,
    
    -- Indexes
    INDEX idx_nguoi_dung (ma_nguoi_dung),
    INDEX idx_mon_hoc (ma_mon_hoc),
    INDEX idx_danh_muc (ma_danh_muc),
    INDEX idx_ngay_tai (ngay_tai DESC),
    INDEX idx_trang_thai (trang_thai),
    INDEX idx_so_luot_xem (so_luot_xem DESC),
    INDEX idx_so_luot_tai (so_luot_tai DESC),
    INDEX idx_diem (diem_trung_binh DESC),
    FULLTEXT INDEX idx_fulltext (tieu_de, mo_ta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Bảng DanhGia (Đánh giá)
-- =============================================
CREATE TABLE DanhGia (
    ma_danh_gia INT AUTO_INCREMENT PRIMARY KEY,
    ma_nguoi_dung INT NOT NULL,
    ma_tai_lieu INT NOT NULL,
    so_sao INT NOT NULL CHECK (so_sao >= 1 AND so_sao <= 5),
    nhan_xet TEXT DEFAULT NULL,
    ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (ma_nguoi_dung) REFERENCES `User`(ma_nguoi_dung) ON DELETE CASCADE,
    FOREIGN KEY (ma_tai_lieu) REFERENCES TaiLieu(ma_tai_lieu) ON DELETE CASCADE,
    
    UNIQUE KEY unique_rating (ma_nguoi_dung, ma_tai_lieu),
    INDEX idx_tai_lieu (ma_tai_lieu),
    INDEX idx_nguoi_dung (ma_nguoi_dung),
    INDEX idx_so_sao (so_sao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Bảng BinhLuan (Bình luận)
-- =============================================
CREATE TABLE BinhLuan (
    ma_binh_luan INT AUTO_INCREMENT PRIMARY KEY,
    ma_nguoi_dung INT NOT NULL,
    ma_tai_lieu INT NOT NULL,
    ma_binh_luan_cha INT DEFAULT NULL COMMENT 'Reply to another comment',
    noi_dung TEXT NOT NULL,
    so_luot_thich INT DEFAULT 0,
    trang_thai ENUM('active', 'hidden', 'deleted') DEFAULT 'active',
    ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (ma_nguoi_dung) REFERENCES `User`(ma_nguoi_dung) ON DELETE CASCADE,
    FOREIGN KEY (ma_tai_lieu) REFERENCES TaiLieu(ma_tai_lieu) ON DELETE CASCADE,
    FOREIGN KEY (ma_binh_luan_cha) REFERENCES BinhLuan(ma_binh_luan) ON DELETE CASCADE,
    
    INDEX idx_tai_lieu (ma_tai_lieu),
    INDEX idx_nguoi_dung (ma_nguoi_dung),
    INDEX idx_cha (ma_binh_luan_cha),
    INDEX idx_ngay_tao (ngay_tao DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Bảng TaiXuong (Lịch sử tải xuống)
-- =============================================
CREATE TABLE TaiXuong (
    ma_tai_xuong INT AUTO_INCREMENT PRIMARY KEY,
    ma_nguoi_dung INT NOT NULL,
    ma_tai_lieu INT NOT NULL,
    ip_address VARCHAR(45) DEFAULT NULL,
    user_agent VARCHAR(500) DEFAULT NULL,
    ngay_tai_xuong DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (ma_nguoi_dung) REFERENCES `User`(ma_nguoi_dung) ON DELETE CASCADE,
    FOREIGN KEY (ma_tai_lieu) REFERENCES TaiLieu(ma_tai_lieu) ON DELETE CASCADE,
    
    INDEX idx_nguoi_dung (ma_nguoi_dung),
    INDEX idx_tai_lieu (ma_tai_lieu),
    INDEX idx_ngay (ngay_tai_xuong DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Bảng ThongBao (Thông báo)
-- =============================================
CREATE TABLE ThongBao (
    ma_thong_bao INT AUTO_INCREMENT PRIMARY KEY,
    ma_nguoi_dung INT NOT NULL,
    loai_thong_bao ENUM('info', 'warning', 'success', 'error') DEFAULT 'info',
    tieu_de VARCHAR(255) NOT NULL,
    noi_dung TEXT DEFAULT NULL,
    link VARCHAR(500) DEFAULT NULL,
    da_doc BOOLEAN DEFAULT FALSE,
    ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
    ngay_doc DATETIME DEFAULT NULL,
    
    FOREIGN KEY (ma_nguoi_dung) REFERENCES `User`(ma_nguoi_dung) ON DELETE CASCADE,
    
    INDEX idx_nguoi_dung (ma_nguoi_dung),
    INDEX idx_da_doc (da_doc),
    INDEX idx_ngay_tao (ngay_tao DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Bảng YeuThich (Tài liệu yêu thích)
-- =============================================
CREATE TABLE YeuThich (
    ma_yeu_thich INT AUTO_INCREMENT PRIMARY KEY,
    ma_nguoi_dung INT NOT NULL,
    ma_tai_lieu INT NOT NULL,
    ngay_them DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (ma_nguoi_dung) REFERENCES `User`(ma_nguoi_dung) ON DELETE CASCADE,
    FOREIGN KEY (ma_tai_lieu) REFERENCES TaiLieu(ma_tai_lieu) ON DELETE CASCADE,
    
    UNIQUE KEY unique_favorite (ma_nguoi_dung, ma_tai_lieu),
    INDEX idx_nguoi_dung (ma_nguoi_dung),
    INDEX idx_tai_lieu (ma_tai_lieu)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Bảng LichSuXem (Lịch sử xem)
-- =============================================
CREATE TABLE LichSuXem (
    ma_lich_su INT AUTO_INCREMENT PRIMARY KEY,
    ma_nguoi_dung INT DEFAULT NULL,
    ma_tai_lieu INT NOT NULL,
    ip_address VARCHAR(45) DEFAULT NULL,
    ngay_xem DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (ma_nguoi_dung) REFERENCES `User`(ma_nguoi_dung) ON DELETE CASCADE,
    FOREIGN KEY (ma_tai_lieu) REFERENCES TaiLieu(ma_tai_lieu) ON DELETE CASCADE,
    
    INDEX idx_nguoi_dung (ma_nguoi_dung),
    INDEX idx_tai_lieu (ma_tai_lieu),
    INDEX idx_ngay (ngay_xem DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Bảng Tags (Thẻ tag cho tài liệu)
-- =============================================
CREATE TABLE Tags (
    ma_tag INT AUTO_INCREMENT PRIMARY KEY,
    ten_tag VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    so_luot_su_dung INT DEFAULT 0,
    ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_ten (ten_tag),
    INDEX idx_slug (slug),
    INDEX idx_su_dung (so_luot_su_dung DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Bảng TaiLieu_Tags (Quan hệ nhiều-nhiều)
-- =============================================
CREATE TABLE TaiLieu_Tags (
    ma_tai_lieu INT NOT NULL,
    ma_tag INT NOT NULL,
    ngay_them DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (ma_tai_lieu, ma_tag),
    FOREIGN KEY (ma_tai_lieu) REFERENCES TaiLieu(ma_tai_lieu) ON DELETE CASCADE,
    FOREIGN KEY (ma_tag) REFERENCES Tags(ma_tag) ON DELETE CASCADE,
    
    INDEX idx_tai_lieu (ma_tai_lieu),
    INDEX idx_tag (ma_tag)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Bảng SystemSettings (Cấu hình hệ thống)
-- =============================================
CREATE TABLE SystemSettings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value TEXT,
    setting_type VARCHAR(50) DEFAULT 'string',
    description TEXT,
    ngay_cap_nhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Bảng ActivityLog (Nhật ký hoạt động)
-- =============================================
CREATE TABLE ActivityLog (
    ma_log BIGINT AUTO_INCREMENT PRIMARY KEY,
    ma_nguoi_dung INT DEFAULT NULL,
    loai_hoat_dong VARCHAR(50) NOT NULL,
    chi_tiet TEXT,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (ma_nguoi_dung) REFERENCES `User`(ma_nguoi_dung) ON DELETE SET NULL,
    
    INDEX idx_nguoi_dung (ma_nguoi_dung),
    INDEX idx_loai (loai_hoat_dong),
    INDEX idx_ngay (ngay_tao DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TRIGGERS - Tự động cập nhật thống kê
-- =============================================

-- Trigger: Tăng số lượt xem
DELIMITER $$
CREATE TRIGGER after_view_insert 
AFTER INSERT ON LichSuXem
FOR EACH ROW
BEGIN
    UPDATE TaiLieu 
    SET so_luot_xem = so_luot_xem + 1 
    WHERE ma_tai_lieu = NEW.ma_tai_lieu;
END$$
DELIMITER ;

-- Trigger: Tăng số lượt tải
DELIMITER $$
CREATE TRIGGER after_download_insert 
AFTER INSERT ON TaiXuong
FOR EACH ROW
BEGIN
    UPDATE TaiLieu 
    SET so_luot_tai = so_luot_tai + 1 
    WHERE ma_tai_lieu = NEW.ma_tai_lieu;
END$$
DELIMITER ;

-- Trigger: Cập nhật điểm trung bình khi có đánh giá mới
DELIMITER $$
CREATE TRIGGER after_rating_insert 
AFTER INSERT ON DanhGia
FOR EACH ROW
BEGIN
    UPDATE TaiLieu 
    SET 
        diem_trung_binh = (
            SELECT AVG(so_sao) 
            FROM DanhGia 
            WHERE ma_tai_lieu = NEW.ma_tai_lieu
        ),
        so_luot_danh_gia = (
            SELECT COUNT(*) 
            FROM DanhGia 
            WHERE ma_tai_lieu = NEW.ma_tai_lieu
        )
    WHERE ma_tai_lieu = NEW.ma_tai_lieu;
END$$
DELIMITER ;

-- Trigger: Cập nhật điểm khi sửa đánh giá
DELIMITER $$
CREATE TRIGGER after_rating_update 
AFTER UPDATE ON DanhGia
FOR EACH ROW
BEGIN
    UPDATE TaiLieu 
    SET 
        diem_trung_binh = (
            SELECT AVG(so_sao) 
            FROM DanhGia 
            WHERE ma_tai_lieu = NEW.ma_tai_lieu
        )
    WHERE ma_tai_lieu = NEW.ma_tai_lieu;
END$$
DELIMITER ;

-- Trigger: Cập nhật điểm khi xóa đánh giá
DELIMITER $$
CREATE TRIGGER after_rating_delete 
AFTER DELETE ON DanhGia
FOR EACH ROW
BEGIN
    UPDATE TaiLieu 
    SET 
        diem_trung_binh = COALESCE((
            SELECT AVG(so_sao) 
            FROM DanhGia 
            WHERE ma_tai_lieu = OLD.ma_tai_lieu
        ), 0),
        so_luot_danh_gia = (
            SELECT COUNT(*) 
            FROM DanhGia 
            WHERE ma_tai_lieu = OLD.ma_tai_lieu
        )
    WHERE ma_tai_lieu = OLD.ma_tai_lieu;
END$$
DELIMITER ;

-- Trigger: Tăng số lượt sử dụng tag
DELIMITER $$
CREATE TRIGGER after_document_tag_insert 
AFTER INSERT ON TaiLieu_Tags
FOR EACH ROW
BEGIN
    UPDATE Tags 
    SET so_luot_su_dung = so_luot_su_dung + 1 
    WHERE ma_tag = NEW.ma_tag;
END$$
DELIMITER ;

-- Trigger: Giảm số lượt sử dụng tag
DELIMITER $$
CREATE TRIGGER after_document_tag_delete 
AFTER DELETE ON TaiLieu_Tags
FOR EACH ROW
BEGIN
    UPDATE Tags 
    SET so_luot_su_dung = GREATEST(0, so_luot_su_dung - 1)
    WHERE ma_tag = OLD.ma_tag;
END$$
DELIMITER ;

-- =============================================
-- DỮ LIỆU MẪU
-- =============================================

-- Admin user (password: admin123 - đã hash bằng bcrypt)
INSERT INTO `User` (email, mat_khau, ho_ten, chuc_vu) VALUES
('admin@docshare.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Quản trị viên', 'admin'),
('user@docshare.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Nguyễn Văn A', 'user');

-- Danh mục
INSERT INTO DanhMuc (ten_danh_muc, khoa, mo_ta, icon, mau_sac, thu_tu) VALUES
('Công nghệ thông tin', 'Khoa Công nghệ', 'Các tài liệu về CNTT', '💻', '#667eea', 1),
('Toán học', 'Khoa Khoa học Tự nhiên', 'Toán cao cấp, Giải tích', '📊', '#27ae60', 2),
('Vật lý', 'Khoa Khoa học Tự nhiên', 'Vật lý đại cương', '⚛️', '#e74c3c', 3),
('Hóa học', 'Khoa Khoa học Tự nhiên', 'Hóa học đại cương', '⚗️', '#f39c12', 4),
('Tiếng Anh', 'Khoa Ngoại ngữ', 'Tiếng Anh chuyên ngành', '🌐', '#3498db', 5),
('Kinh tế', 'Khoa Kinh tế', 'Kinh tế vi mô, vĩ mô', '📈', '#9b59b6', 6),
('Kỹ thuật', 'Khoa Kỹ thuật', 'Cơ khí, Điện tử', '⚙️', '#34495e', 7);

-- Môn học
INSERT INTO MonHoc (ten_mon_hoc, ma_mon, mo_ta, so_tin_chi, hoc_ky) VALUES
('Lập trình C++', 'IT101', 'Ngôn ngữ lập trình hướng đối tượng', 3, 1),
('Cơ sở dữ liệu', 'IT201', 'Thiết kế và quản lý CSDL', 3, 2),
('Cấu trúc dữ liệu', 'IT102', 'Các cấu trúc dữ liệu cơ bản', 3, 1),
('Toán cao cấp A1', 'MATH101', 'Giải tích 1 biến', 4, 1),
('Toán cao cấp A2', 'MATH102', 'Giải tích nhiều biến', 4, 2),
('Đại số tuyến tính', 'MATH201', 'Ma trận, Định thức', 3, 2),
('Tiếng Anh chuyên ngành IT', 'ENG101', 'English for IT', 2, 1),
('Kinh tế vi mô', 'ECON101', 'Nguyên lý kinh tế vi mô', 3, 1),
('Kinh tế vĩ mô', 'ECON102', 'Nguyên lý kinh tế vĩ mô', 3, 2),
('Mạng máy tính', 'IT301', 'Kiến trúc mạng và giao thức', 3, 3),
('Hệ điều hành', 'IT302', 'Quản lý tiến trình và bộ nhớ', 3, 3),
('Trí tuệ nhân tạo', 'IT401', 'Machine Learning cơ bản', 3, 4),
('An toàn thông tin', 'IT303', 'Bảo mật hệ thống', 3, 3),
('Lập trình Web', 'IT202', 'HTML, CSS, JavaScript', 3, 2),
('Phát triển ứng dụng di động', 'IT402', 'Android và iOS', 3, 4);

-- Tags phổ biến
INSERT INTO Tags (ten_tag, slug) VALUES
('C++', 'cpp'),
('Python', 'python'),
('Java', 'java'),
('Database', 'database'),
('Web Development', 'web-development'),
('Machine Learning', 'machine-learning'),
('Data Structure', 'data-structure'),
('Algorithm', 'algorithm'),
('Network', 'network'),
('Security', 'security'),
('Mobile', 'mobile'),
('Frontend', 'frontend'),
('Backend', 'backend'),
('DevOps', 'devops'),
('Cloud', 'cloud');

-- System Settings
INSERT INTO SystemSettings (setting_key, setting_value, setting_type, description) VALUES
('site_name', 'DocShare', 'string', 'Tên website'),
('site_description', 'Nền tảng chia sẻ tài liệu học tập', 'string', 'Mô tả website'),
('max_file_size', '52428800', 'number', 'Kích thước file tối đa (50MB)'),
('allowed_file_types', 'pdf,doc,docx,ppt,pptx,xls,xlsx', 'string', 'Các loại file được phép'),
('require_approval', 'false', 'boolean', 'Yêu cầu duyệt tài liệu'),
('enable_comments', 'true', 'boolean', 'Cho phép bình luận'),
('enable_ratings', 'true', 'boolean', 'Cho phép đánh giá'),
('items_per_page', '20', 'number', 'Số item mỗi trang');

-- =============================================
-- VIEWS - Các view hữu ích
-- =============================================

-- View: Thống kê tổng quan
CREATE OR REPLACE VIEW v_statistics AS
SELECT
    (SELECT COUNT(*) FROM `User` WHERE trang_thai = 'active') as total_users,
    (SELECT COUNT(*) FROM `User` WHERE chuc_vu = 'admin') as total_admins,
    (SELECT COUNT(*) FROM TaiLieu WHERE trang_thai = 'approved') as total_documents,
    (SELECT COUNT(*) FROM DanhMuc WHERE trang_thai = 'active') as total_categories,
    (SELECT COUNT(*) FROM MonHoc WHERE trang_thai = 'active') as total_subjects,
    (SELECT SUM(so_luot_xem) FROM TaiLieu) as total_views,
    (SELECT SUM(so_luot_tai) FROM TaiLieu) as total_downloads,
    (SELECT COUNT(*) FROM BinhLuan WHERE trang_thai = 'active') as total_comments,
    (SELECT COUNT(*) FROM DanhGia) as total_ratings;

-- View: Tài liệu với thông tin đầy đủ
CREATE OR REPLACE VIEW v_tailieu_full AS
SELECT 
    t.*,
    u.email,
    u.ho_ten,
    d.ten_danh_muc,
    m.ten_mon_hoc,
    m.ma_mon,
    (SELECT GROUP_CONCAT(tg.ten_tag SEPARATOR ', ') 
     FROM TaiLieu_Tags tt 
     JOIN Tags tg ON tt.ma_tag = tg.ma_tag 
     WHERE tt.ma_tai_lieu = t.ma_tai_lieu) as tags
FROM TaiLieu t
LEFT JOIN `User` u ON t.ma_nguoi_dung = u.ma_nguoi_dung
LEFT JOIN DanhMuc d ON t.ma_danh_muc = d.ma_danh_muc
LEFT JOIN MonHoc m ON t.ma_mon_hoc = m.ma_mon_hoc;

-- View: Top tài liệu
CREATE OR REPLACE VIEW v_top_documents AS
SELECT 
    t.ma_tai_lieu,
    t.tieu_de,
    t.so_luot_xem,
    t.so_luot_tai,
    t.diem_trung_binh,
    t.so_luot_danh_gia,
    u.ho_ten as tac_gia,
    d.ten_danh_muc,
    m.ten_mon_hoc
FROM TaiLieu t
LEFT JOIN `User` u ON t.ma_nguoi_dung = u.ma_nguoi_dung
LEFT JOIN DanhMuc d ON t.ma_danh_muc = d.ma_danh_muc
LEFT JOIN MonHoc m ON t.ma_mon_hoc = m.ma_mon_hoc
WHERE t.trang_thai = 'approved'
ORDER BY (t.so_luot_xem * 0.3 + t.so_luot_tai * 0.4 + t.diem_trung_binh * 20 * 0.3) DESC
LIMIT 50;

-- =============================================
-- STORED PROCEDURES
-- =============================================

-- Procedure: Tìm kiếm tài liệu
DELIMITER $$
CREATE PROCEDURE sp_search_documents(
    IN p_keyword VARCHAR(500),
    IN p_category INT,
    IN p_subject INT,
    IN p_limit INT,
    IN p_offset INT
)
BEGIN
    SELECT 
        t.*,
        u.ho_ten,
        d.ten_danh_muc,
        m.ten_mon_hoc
    FROM TaiLieu t
    LEFT JOIN `User` u ON t.ma_nguoi_dung = u.ma_nguoi_dung
    LEFT JOIN DanhMuc d ON t.ma_danh_muc = d.ma_danh_muc
    LEFT JOIN MonHoc m ON t.ma_mon_hoc = m.ma_mon_hoc
    WHERE 
        t.trang_thai = 'approved'
        AND (p_keyword IS NULL OR t.tieu_de LIKE CONCAT('%', p_keyword, '%') OR t.mo_ta LIKE CONCAT('%', p_keyword, '%'))
        AND (p_category IS NULL OR t.ma_danh_muc = p_category)
        AND (p_subject IS NULL OR t.ma_mon_hoc = p_subject)
    ORDER BY t.ngay_tai DESC
    LIMIT p_limit OFFSET p_offset;
END$$
DELIMITER ;

-- Procedure: Lấy thống kê người dùng
DELIMITER $$
CREATE PROCEDURE sp_user_stats(IN p_user_id INT)
BEGIN
    SELECT
        (SELECT COUNT(*) FROM TaiLieu WHERE ma_nguoi_dung = p_user_id) as uploaded_documents,
        (SELECT SUM(so_luot_xem) FROM TaiLieu WHERE ma_nguoi_dung = p_user_id) as total_views,
        (SELECT SUM(so_luot_tai) FROM TaiLieu WHERE ma_nguoi_dung = p_user_id) as total_downloads,
        (SELECT COUNT(*) FROM TaiXuong WHERE ma_nguoi_dung = p_user_id) as downloaded_documents,
        (SELECT COUNT(*) FROM BinhLuan WHERE ma_nguoi_dung = p_user_id) as comments_count,
        (SELECT COUNT(*) FROM DanhGia WHERE ma_nguoi_dung = p_user_id) as ratings_count,
        (SELECT COUNT(*) FROM YeuThich WHERE ma_nguoi_dung = p_user_id) as favorites_count;
END$$
DELIMITER ;

-- =============================================
-- INDEXES OPTIMIZATION
-- =============================================

-- Composite indexes for common queries
ALTER TABLE TaiLieu ADD INDEX idx_category_subject (ma_danh_muc, ma_mon_hoc);
ALTER TABLE TaiLieu ADD INDEX idx_user_status (ma_nguoi_dung, trang_thai);
ALTER TABLE BinhLuan ADD INDEX idx_document_status (ma_tai_lieu, trang_thai);

-- =============================================
-- SUCCESS MESSAGE
-- =============================================
SELECT '✅ Schema Database created successfully!' AS message;
SELECT '📊 Total tables created: ' AS info, COUNT(*) as count FROM information_schema.tables WHERE table_schema = 'documentsharing_schema';