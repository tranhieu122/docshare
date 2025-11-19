-- =============================================
-- CHATBOT FILE UPLOADS TABLE
-- Database: documentsharing_analytics
-- =============================================

USE documentsharing_analytics;

-- Tạo bảng lưu thông tin file upload từ chatbot
CREATE TABLE IF NOT EXISTS ChatbotFiles (
    file_id INT PRIMARY KEY AUTO_INCREMENT,
    ma_nguoi_dung INT,
    session_id VARCHAR(100),
    original_name VARCHAR(255) NOT NULL,
    stored_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100),
    upload_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    analysis_result TEXT,
    
    INDEX idx_session (session_id),
    INDEX idx_user (ma_nguoi_dung),
    INDEX idx_upload_time (upload_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Thêm comment cho bảng
ALTER TABLE ChatbotFiles COMMENT = 'Lưu trữ thông tin file upload từ chatbot AI';
