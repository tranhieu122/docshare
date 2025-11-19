-- Thêm dữ liệu mẫu cho testing

-- Thêm tài liệu mẫu
INSERT INTO tailieu (tieu_de, mo_ta, ma_nguoi_dung, ma_danh_muc, ma_mon_hoc, ten_tap, kich_thuoc, loai_tap, trang_thai, so_luot_xem, so_luot_tai) VALUES
('Giáo trình Lập trình Web', 'Tài liệu hướng dẫn HTML, CSS, JavaScript cơ bản', 1, 1, 1, 'web-programming.pdf', 2048000, 'pdf', 'approved', 150, 45),
('Cơ sở dữ liệu MySQL', 'Hướng dẫn thiết kế và quản lý CSDL với MySQL', 2, 1, 3, 'mysql-guide.pdf', 3145728, 'pdf', 'approved', 200, 80),
('Lập trình Python', 'Python từ cơ bản đến nâng cao', 1, 1, 1, 'python-basics.pdf', 1572864, 'pdf', 'pending', 120, 30);

SELECT 'Đã thêm dữ liệu mẫu thành công!' as message;
SELECT COUNT(*) as total_users FROM user;
SELECT COUNT(*) as total_docs FROM tailieu;
SELECT COUNT(*) as total_categories FROM danhmuc;
SELECT COUNT(*) as total_subjects FROM monhoc;
