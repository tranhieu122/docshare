-- =============================================
-- CHATBOT DATABASE SCHEMA
-- File: database/chatbot.sql
-- =============================================

USE documentsharing_schema;

-- Bảng lưu lịch sử chat
CREATE TABLE IF NOT EXISTS chat_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    user_id INT NULL,
    user_message TEXT NOT NULL,
    bot_response TEXT NOT NULL,
    action_type ENUM('CHAT', 'SEARCH', 'UPLOAD', 'OTHER') DEFAULT 'CHAT',
    document_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_session (session_id),
    INDEX idx_user (user_id),
    INDEX idx_created (created_at),
    FOREIGN KEY (user_id) REFERENCES nguoi_dung(ma_nguoi_dung) ON DELETE SET NULL,
    FOREIGN KEY (document_id) REFERENCES tai_lieu(ma_tai_lieu) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng thống kê chatbot
CREATE TABLE IF NOT EXISTS chatbot_analytics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    total_conversations INT DEFAULT 0,
    total_messages INT DEFAULT 0,
    total_uploads INT DEFAULT 0,
    total_searches INT DEFAULT 0,
    avg_response_time FLOAT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data
INSERT INTO chat_history (session_id, user_id, user_message, bot_response, action_type) VALUES
('session_demo_001', 1, 'Xin chào', 'Xin chào! Tôi có thể giúp gì cho bạn?', 'CHAT'),
('session_demo_001', 1, 'Tìm tài liệu về Toán', 'Tôi đã tìm thấy 5 tài liệu về Toán cao cấp.', 'SEARCH');

-- View để xem thống kê
CREATE OR REPLACE VIEW v_chatbot_stats AS
SELECT 
    DATE(created_at) as date,
    COUNT(DISTINCT session_id) as conversations,
    COUNT(*) as total_messages,
    SUM(CASE WHEN action_type = 'UPLOAD' THEN 1 ELSE 0 END) as uploads,
    SUM(CASE WHEN action_type = 'SEARCH' THEN 1 ELSE 0 END) as searches
FROM chat_history
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Stored procedure để làm sạch lịch sử cũ (giữ 90 ngày)
DELIMITER $$
CREATE PROCEDURE IF NOT EXISTS sp_cleanup_chat_history()
BEGIN
    DELETE FROM chat_history 
    WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY);
END$$
DELIMITER ;

-- Event tự động chạy cleanup mỗi tuần
SET GLOBAL event_scheduler = ON;

CREATE EVENT IF NOT EXISTS event_cleanup_chat
ON SCHEDULE EVERY 1 WEEK
STARTS CURRENT_TIMESTAMP
DO CALL sp_cleanup_chat_history();