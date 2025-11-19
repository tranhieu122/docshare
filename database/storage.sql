-- =============================================
-- Document Sharing Platform - Storage Database (MySQL)
-- Version: 2.0 - Optimized
-- LƯU FILE BINARY + METADATA
-- =============================================

-- Tạo database
CREATE DATABASE IF NOT EXISTS documentsharing_storage 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE documentsharing_storage;

-- Xóa bảng cũ
DROP TABLE IF EXISTS FileStorage;

-- =============================================
-- Bảng FileStorage - Lưu file binary
-- =============================================
CREATE TABLE FileStorage (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ma_tai_lieu INT NOT NULL UNIQUE COMMENT 'Reference to documentsharing_schema.TaiLieu',
    
    -- File data
    file_data LONGBLOB NOT NULL COMMENT 'Binary file data',
    
    -- File metadata
    file_name VARCHAR(500) NOT NULL,
    original_name VARCHAR(500) NOT NULL COMMENT 'Original filename',
    file_size BIGINT NOT NULL COMMENT 'File size in bytes',
    file_extension VARCHAR(50) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    
    -- Checksums for integrity
    md5_hash VARCHAR(32) NOT NULL,
    sha256_hash VARCHAR(64) DEFAULT NULL,
    
    -- Storage info
    storage_path VARCHAR(1000) DEFAULT NULL COMMENT 'Alternative storage path if using file system',
    is_compressed BOOLEAN DEFAULT FALSE,
    compression_type VARCHAR(50) DEFAULT NULL,
    
    -- Virus scan
    virus_scanned BOOLEAN DEFAULT FALSE,
    virus_scan_date DATETIME DEFAULT NULL,
    scan_result VARCHAR(50) DEFAULT NULL,
    
    -- Access control
    is_public BOOLEAN DEFAULT TRUE,
    encryption_key VARCHAR(500) DEFAULT NULL,
    
    -- Timestamps
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_accessed DATETIME DEFAULT NULL,
    access_count INT DEFAULT 0,
    
    -- Indexes
    INDEX idx_ma_tai_lieu (ma_tai_lieu),
    INDEX idx_upload_date (upload_date DESC),
    INDEX idx_file_size (file_size),
    INDEX idx_md5 (md5_hash),
    INDEX idx_mime_type (mime_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
ROW_FORMAT=COMPRESSED
KEY_BLOCK_SIZE=8;

-- =============================================
-- Bảng FileVersions - Lưu các phiên bản file
-- =============================================
CREATE TABLE FileVersions (
    version_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ma_tai_lieu INT NOT NULL,
    version_number INT NOT NULL DEFAULT 1,
    
    -- File data
    file_data LONGBLOB NOT NULL,
    file_name VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    md5_hash VARCHAR(32) NOT NULL,
    
    -- Version info
    change_note TEXT DEFAULT NULL,
    uploaded_by INT DEFAULT NULL COMMENT 'User ID',
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_current BOOLEAN DEFAULT FALSE,
    
    INDEX idx_ma_tai_lieu (ma_tai_lieu),
    INDEX idx_version (ma_tai_lieu, version_number),
    INDEX idx_current (ma_tai_lieu, is_current)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Bảng FileThumbnails - Lưu thumbnail/preview
-- =============================================
CREATE TABLE FileThumbnails (
    thumbnail_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ma_tai_lieu INT NOT NULL,
    
    -- Thumbnail data
    thumbnail_data MEDIUMBLOB NOT NULL,
    thumbnail_type VARCHAR(50) NOT NULL COMMENT 'small, medium, large',
    width INT DEFAULT 0,
    height INT DEFAULT 0,
    
    -- Metadata
    mime_type VARCHAR(100) DEFAULT 'image/jpeg',
    file_size INT DEFAULT 0,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_thumbnail (ma_tai_lieu, thumbnail_type),
    INDEX idx_ma_tai_lieu (ma_tai_lieu)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Bảng FileChunks - Lưu file theo chunks (large files)
-- =============================================
CREATE TABLE FileChunks (
    chunk_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ma_tai_lieu INT NOT NULL,
    chunk_number INT NOT NULL,
    chunk_data BLOB NOT NULL,
    chunk_size INT NOT NULL,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_chunk (ma_tai_lieu, chunk_number),
    INDEX idx_ma_tai_lieu (ma_tai_lieu)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Bảng StorageStats - Thống kê storage
-- =============================================
CREATE TABLE StorageStats (
    stat_id INT AUTO_INCREMENT PRIMARY KEY,
    stat_date DATE NOT NULL UNIQUE,
    total_files INT DEFAULT 0,
    total_size BIGINT DEFAULT 0,
    total_downloads INT DEFAULT 0,
    avg_file_size BIGINT DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_date (stat_date DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TRIGGERS
-- =============================================

-- Trigger: Cập nhật last_accessed khi truy cập file
DELIMITER $$
CREATE TRIGGER after_file_access 
BEFORE UPDATE ON FileStorage
FOR EACH ROW
BEGIN
    IF NEW.access_count > OLD.access_count THEN
        SET NEW.last_accessed = NOW();
    END IF;
END$$
DELIMITER ;

-- Trigger: Cập nhật thống kê khi upload file
DELIMITER $$
CREATE TRIGGER after_file_insert 
AFTER INSERT ON FileStorage
FOR EACH ROW
BEGIN
    INSERT INTO StorageStats (stat_date, total_files, total_size)
    VALUES (CURDATE(), 1, NEW.file_size)
    ON DUPLICATE KEY UPDATE
        total_files = total_files + 1,
        total_size = total_size + NEW.file_size;
END$$
DELIMITER ;

-- Trigger: Cập nhật thống kê khi xóa file
DELIMITER $$
CREATE TRIGGER after_file_delete 
AFTER DELETE ON FileStorage
FOR EACH ROW
BEGIN
    UPDATE StorageStats 
    SET 
        total_files = GREATEST(0, total_files - 1),
        total_size = GREATEST(0, total_size - OLD.file_size)
    WHERE stat_date = CURDATE();
END$$
DELIMITER ;

-- =============================================
-- STORED PROCEDURES
-- =============================================

-- Procedure: Lấy file
DELIMITER $$
CREATE PROCEDURE sp_get_file(IN p_ma_tai_lieu INT)
BEGIN
    -- Increment access count
    UPDATE FileStorage 
    SET 
        access_count = access_count + 1,
        last_accessed = NOW()
    WHERE ma_tai_lieu = p_ma_tai_lieu;
    
    -- Return file data
    SELECT 
        id,
        ma_tai_lieu,
        file_data,
        file_name,
        file_size,
        mime_type,
        md5_hash
    FROM FileStorage
    WHERE ma_tai_lieu = p_ma_tai_lieu;
END$$
DELIMITER ;

-- Procedure: Lấy thống kê storage
DELIMITER $$
CREATE PROCEDURE sp_storage_stats()
BEGIN
    SELECT
        COUNT(*) as total_files,
        SUM(file_size) as total_size,
        AVG(file_size) as avg_size,
        MIN(file_size) as min_size,
        MAX(file_size) as max_size,
        SUM(access_count) as total_accesses,
        COUNT(DISTINCT DATE(upload_date)) as upload_days
    FROM FileStorage;
END$$
DELIMITER ;

-- Procedure: Cleanup old versions
DELIMITER $$
CREATE PROCEDURE sp_cleanup_old_versions(IN p_keep_versions INT)
BEGIN
    DELETE v1 FROM FileVersions v1
    INNER JOIN (
        SELECT 
            ma_tai_lieu,
            version_number
        FROM FileVersions v2
        WHERE NOT is_current
        GROUP BY ma_tai_lieu
        HAVING COUNT(*) > p_keep_versions
    ) v2 ON v1.ma_tai_lieu = v2.ma_tai_lieu
    WHERE v1.version_number < (
        SELECT MAX(version_number) - p_keep_versions
        FROM FileVersions v3
        WHERE v3.ma_tai_lieu = v1.ma_tai_lieu
    );
END$$
DELIMITER ;

-- =============================================
-- VIEWS
-- =============================================

-- View: File statistics
CREATE OR REPLACE VIEW v_file_stats AS
SELECT
    mime_type,
    COUNT(*) as file_count,
    SUM(file_size) as total_size,
    AVG(file_size) as avg_size,
    SUM(access_count) as total_accesses
FROM FileStorage
GROUP BY mime_type;

-- View: Large files
CREATE OR REPLACE VIEW v_large_files AS
SELECT
    ma_tai_lieu,
    file_name,
    file_size,
    ROUND(file_size / 1024 / 1024, 2) as size_mb,
    upload_date,
    access_count
FROM FileStorage
WHERE file_size > 10485760  -- > 10MB
ORDER BY file_size DESC;

-- =============================================
-- DỮ LIỆU MẪU
-- =============================================

-- Insert sample storage stats
INSERT INTO StorageStats (stat_date, total_files, total_size, total_downloads) VALUES
(CURDATE(), 0, 0, 0);

-- =============================================
-- MAINTENANCE EVENTS
-- =============================================

-- Event: Tự động cleanup thumbnails cũ (chạy hàng ngày)
CREATE EVENT IF NOT EXISTS cleanup_old_thumbnails
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO
    DELETE FROM FileThumbnails 
    WHERE created_date < DATE_SUB(NOW(), INTERVAL 90 DAY)
    AND ma_tai_lieu NOT IN (
        SELECT ma_tai_lieu FROM FileStorage
    );

-- Event: Cập nhật storage stats (chạy hàng giờ)
CREATE EVENT IF NOT EXISTS update_storage_stats
ON SCHEDULE EVERY 1 HOUR
STARTS CURRENT_TIMESTAMP
DO
    INSERT INTO StorageStats (stat_date, total_files, total_size, avg_file_size)
    SELECT 
        CURDATE(),
        COUNT(*),
        SUM(file_size),
        AVG(file_size)
    FROM FileStorage
    ON DUPLICATE KEY UPDATE
        total_files = VALUES(total_files),
        total_size = VALUES(total_size),
        avg_file_size = VALUES(avg_file_size);

-- =============================================
-- INDEXES OPTIMIZATION
-- =============================================

-- Optimize for large file queries
ALTER TABLE FileStorage ADD INDEX idx_size_date (file_size, upload_date);
ALTER TABLE FileStorage ADD INDEX idx_public (is_public, upload_date);

-- =============================================
-- SUCCESS MESSAGE
-- =============================================
SELECT '✅ Storage Database created successfully!' AS message;
SELECT '💾 Total storage tables: ' AS info, COUNT(*) as count FROM information_schema.tables WHERE table_schema = 'documentsharing_storage';
SELECT '🔒 File security: ' AS info, 'MD5 + SHA256 hashing enabled' as status;