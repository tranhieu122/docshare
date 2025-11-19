-- Fix toàn bộ dữ liệu danh mục và môn học bị lỗi font
-- Cập nhật bằng ID/ma_mon để đảm bảo đúng dòng dù dữ liệu đang bị mã hóa sai

-- Danh mục
UPDATE DanhMuc SET ten_danh_muc = 'Công nghệ thông tin', khoa = 'Khoa Công nghệ' WHERE ma_danh_muc = 1;
UPDATE DanhMuc SET ten_danh_muc = 'Toán học', khoa = 'Khoa Khoa học Tự nhiên' WHERE ma_danh_muc = 2;
UPDATE DanhMuc SET ten_danh_muc = 'Vật lý', khoa = 'Khoa Khoa học Tự nhiên' WHERE ma_danh_muc = 3;
UPDATE DanhMuc SET ten_danh_muc = 'Hóa học', khoa = 'Khoa Khoa học Tự nhiên' WHERE ma_danh_muc = 4;
UPDATE DanhMuc SET ten_danh_muc = 'Tiếng Anh', khoa = 'Khoa Ngoại ngữ' WHERE ma_danh_muc = 5;
UPDATE DanhMuc SET ten_danh_muc = 'Kinh tế', khoa = 'Khoa Kinh tế' WHERE ma_danh_muc = 6;
UPDATE DanhMuc SET ten_danh_muc = 'Kỹ thuật', khoa = 'Khoa Kỹ thuật' WHERE ma_danh_muc = 7;

-- Môn học (cập nhật cả tên và mô tả)
UPDATE MonHoc SET ten_mon_hoc = 'Lập trình C++', mo_ta = 'Ngôn ngữ lập trình hướng đối tượng' WHERE ma_mon = 'IT101';
UPDATE MonHoc SET ten_mon_hoc = 'Cơ sở dữ liệu', mo_ta = 'Thiết kế và quản lý CSDL' WHERE ma_mon = 'IT201';
UPDATE MonHoc SET ten_mon_hoc = 'Cấu trúc dữ liệu', mo_ta = 'Các cấu trúc dữ liệu cơ bản' WHERE ma_mon = 'IT102';
UPDATE MonHoc SET ten_mon_hoc = 'Toán cao cấp A1', mo_ta = 'Giải tích 1 biến' WHERE ma_mon = 'MATH101';
UPDATE MonHoc SET ten_mon_hoc = 'Toán cao cấp A2', mo_ta = 'Giải tích nhiều biến' WHERE ma_mon = 'MATH102';
UPDATE MonHoc SET ten_mon_hoc = 'Đại số tuyến tính', mo_ta = 'Ma trận, Định thức' WHERE ma_mon = 'MATH201';
UPDATE MonHoc SET ten_mon_hoc = 'Tiếng Anh chuyên ngành IT', mo_ta = 'English for IT' WHERE ma_mon = 'ENG101';
UPDATE MonHoc SET ten_mon_hoc = 'Kinh tế vi mô', mo_ta = 'Nguyên lý kinh tế vi mô' WHERE ma_mon = 'ECON101';
UPDATE MonHoc SET ten_mon_hoc = 'Kinh tế vĩ mô', mo_ta = 'Nguyên lý kinh tế vĩ mô' WHERE ma_mon = 'ECON102';
UPDATE MonHoc SET ten_mon_hoc = 'Mạng máy tính', mo_ta = 'Kiến trúc mạng và giao thức' WHERE ma_mon = 'IT301';
UPDATE MonHoc SET ten_mon_hoc = 'Hệ điều hành', mo_ta = 'Quản lý tiến trình và bộ nhớ' WHERE ma_mon = 'IT302';
UPDATE MonHoc SET ten_mon_hoc = 'Trí tuệ nhân tạo', mo_ta = 'Machine Learning cơ bản' WHERE ma_mon = 'IT401';
UPDATE MonHoc SET ten_mon_hoc = 'An toàn thông tin', mo_ta = 'Bảo mật hệ thống' WHERE ma_mon = 'IT303';
UPDATE MonHoc SET ten_mon_hoc = 'Lập trình Web', mo_ta = 'HTML, CSS, JavaScript' WHERE ma_mon = 'IT202';
UPDATE MonHoc SET ten_mon_hoc = 'Phát triển ứng dụng di động', mo_ta = 'Android và iOS' WHERE ma_mon = 'IT402';

-- Nếu còn dữ liệu bị lỗi khác, thêm dòng UPDATE tương tự ở đây
