-- Cập nhật lại mật khẩu admin (hash mới)
UPDATE User SET mat_khau = '$2a$10$w1QwQnQwQnQwQnQwQnQwQeQnQwQnQwQnQwQnQwQnQwQnQwQnQwQ' WHERE email = 'admin@docshare.com';
-- Thay hash trên bằng hash thực tế bạn muốn sử dụng
