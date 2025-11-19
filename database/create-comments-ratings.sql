-- ============================================
-- Tạo bảng BinhLuan (Comments) và DanhGia (Ratings)
-- ============================================

USE documentsharing_schema;

-- Bảng Bình luận
CREATE TABLE IF NOT EXISTS BinhLuan (
    ma_binh_luan INT AUTO_INCREMENT PRIMARY KEY,
    ma_tai_lieu INT NOT NULL,
    ma_nguoi_dung INT NOT NULL,
    noi_dung TEXT NOT NULL,
    ngay_binh_luan DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_tai_lieu) REFERENCES TaiLieu(ma_tai_lieu) ON DELETE CASCADE,
    FOREIGN KEY (ma_nguoi_dung) REFERENCES User(ma_nguoi_dung) ON DELETE CASCADE,
    INDEX idx_tai_lieu (ma_tai_lieu),
    INDEX idx_nguoi_dung (ma_nguoi_dung),
    INDEX idx_ngay (ngay_binh_luan)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Đánh giá
CREATE TABLE IF NOT EXISTS DanhGia (
    ma_danh_gia INT AUTO_INCREMENT PRIMARY KEY,
    ma_tai_lieu INT NOT NULL,
    ma_nguoi_dung INT NOT NULL,
    diem_so INT NOT NULL CHECK (diem_so >= 1 AND diem_so <= 5),
    ngay_danh_gia DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_tai_lieu) REFERENCES TaiLieu(ma_tai_lieu) ON DELETE CASCADE,
    FOREIGN KEY (ma_nguoi_dung) REFERENCES User(ma_nguoi_dung) ON DELETE CASCADE,
    UNIQUE KEY unique_rating (ma_tai_lieu, ma_nguoi_dung),
    INDEX idx_tai_lieu (ma_tai_lieu),
    INDEX idx_nguoi_dung (ma_nguoi_dung)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Thêm dữ liệu mẫu (chỉ nếu có tài liệu)
-- INSERT INTO BinhLuan (ma_tai_lieu, ma_nguoi_dung, noi_dung) VALUES
-- (1, 2, 'Tài liệu rất hữu ích, cảm ơn tác giả!');

SELECT 'Đã tạo xong bảng BinhLuan và DanhGia!' as status;
