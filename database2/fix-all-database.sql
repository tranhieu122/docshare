-- Tổng hợp các script fix database: tiếng Việt, tên người dùng, danh mục, tài liệu

-- Fix tên người dùng tiếng Việt
UPDATE User SET ho_ten = 'Quản trị viên' WHERE email = 'admin@docshare.com';
UPDATE User SET ho_ten = 'Người dùng mẫu' WHERE email = 'user@docshare.com';

-- Fix tên danh mục tiếng Việt
UPDATE DanhMuc SET ten_danh_muc = 'Cơ sở dữ liệu' WHERE ten_danh_muc LIKE '%C?? s??? d??? li???u%';
UPDATE DanhMuc SET ten_danh_muc = 'Lập trình Web' WHERE ten_danh_muc LIKE '%L???p tr??nh Web%';

-- Fix tên môn học tiếng Việt
UPDATE MonHoc SET ten_mon_hoc = 'Cơ sở dữ liệu MySQL' WHERE ten_mon_hoc LIKE '%C?? s??? d??? li???u MySQL%';
UPDATE MonHoc SET ten_mon_hoc = 'Lập trình Python' WHERE ten_mon_hoc LIKE '%L???p tr??nh Python%';

-- Fix tiêu đề tài liệu tiếng Việt
UPDATE TaiLieu SET tieu_de = 'Giáo trình Lập trình Web' WHERE tieu_de LIKE '%Gi??o tr??nh L???p tr??nh Web%';
UPDATE TaiLieu SET tieu_de = 'Cơ sở dữ liệu MySQL' WHERE tieu_de LIKE '%C?? s??? d??? li???u MySQL%';
UPDATE TaiLieu SET tieu_de = 'Lập trình Python' WHERE tieu_de LIKE '%L???p tr??nh Python%';

-- Thêm các dòng UPDATE khác nếu còn dữ liệu bị lỗi font
