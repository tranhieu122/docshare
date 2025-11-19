-- Simple Analytics Database (without triggers/procedures)
CREATE DATABASE IF NOT EXISTS documentsharing_analytics 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE documentsharing_analytics;

-- PageViews
CREATE TABLE IF NOT EXISTS PageViews (
    view_id BIGINT AUTO_INCREMENT,
    ma_nguoi_dung INT DEFAULT NULL,
    session_id VARCHAR(64) NOT NULL,
    page_url VARCHAR(1000) NOT NULL,
    page_title VARCHAR(500) DEFAULT NULL,
    page_type VARCHAR(50) DEFAULT NULL,
    referrer VARCHAR(1000) DEFAULT NULL,
    user_agent VARCHAR(500) DEFAULT NULL,
    device_type VARCHAR(50) DEFAULT NULL,
    browser VARCHAR(100) DEFAULT NULL,
    os VARCHAR(100) DEFAULT NULL,
    ip_address VARCHAR(45) DEFAULT NULL,
    view_date DATE NOT NULL,
    view_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    duration INT DEFAULT 0,
    PRIMARY KEY (view_id, view_date),
    INDEX idx_user (ma_nguoi_dung),
    INDEX idx_session (session_id),
    INDEX idx_date (view_date)
) ENGINE=InnoDB;

-- SearchQueries
CREATE TABLE IF NOT EXISTS SearchQueries (
    query_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ma_nguoi_dung INT DEFAULT NULL,
    session_id VARCHAR(64) DEFAULT NULL,
    search_term VARCHAR(500) NOT NULL,
    search_type VARCHAR(50) DEFAULT 'general',
    filters JSON DEFAULT NULL,
    results_count INT DEFAULT 0,
    clicked_document_id INT DEFAULT NULL,
    search_date DATE NOT NULL,
    search_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user (ma_nguoi_dung),
    INDEX idx_term (search_term(255)),
    INDEX idx_date (search_date)
) ENGINE=InnoDB;

-- UserBehavior
CREATE TABLE IF NOT EXISTS UserBehavior (
    behavior_id BIGINT AUTO_INCREMENT,
    ma_nguoi_dung INT NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT NOT NULL,
    context JSON DEFAULT NULL,
    ui_element VARCHAR(100) DEFAULT NULL,
    action_date DATE NOT NULL,
    action_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (behavior_id, action_date),
    INDEX idx_user (ma_nguoi_dung),
    INDEX idx_action (action_type),
    INDEX idx_entity (entity_type, entity_id)
) ENGINE=InnoDB;

-- DailyStats
CREATE TABLE IF NOT EXISTS DailyStats (
    stat_id INT AUTO_INCREMENT PRIMARY KEY,
    stat_date DATE NOT NULL UNIQUE,
    new_users INT DEFAULT 0,
    active_users INT DEFAULT 0,
    new_documents INT DEFAULT 0,
    documents_viewed INT DEFAULT 0,
    documents_downloaded INT DEFAULT 0,
    total_sessions INT DEFAULT 0,
    total_page_views INT DEFAULT 0,
    total_searches INT DEFAULT 0,
    total_comments INT DEFAULT 0,
    total_ratings INT DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_date (stat_date DESC)
) ENGINE=InnoDB;

-- ChatbotConversations
CREATE TABLE IF NOT EXISTS ChatbotConversations (
    conversation_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ma_nguoi_dung INT DEFAULT NULL,
    user_role VARCHAR(50) DEFAULT 'guest',
    session_id VARCHAR(64) NOT NULL,
    message_type ENUM('user', 'bot', 'system') NOT NULL,
    message_content TEXT NOT NULL,
    page_context VARCHAR(500) DEFAULT NULL,
    intent VARCHAR(100) DEFAULT NULL,
    confidence DECIMAL(5,4) DEFAULT NULL,
    response_time INT DEFAULT NULL,
    tokens_used INT DEFAULT NULL,
    model_used VARCHAR(100) DEFAULT NULL,
    helpful BOOLEAN DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user (ma_nguoi_dung),
    INDEX idx_session (session_id),
    INDEX idx_created (created_at DESC)
) ENGINE=InnoDB;

-- DocumentRecommendations
CREATE TABLE IF NOT EXISTS DocumentRecommendations (
    recommendation_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ma_nguoi_dung INT NOT NULL,
    ma_tai_lieu INT NOT NULL,
    recommendation_type VARCHAR(50) NOT NULL,
    score DECIMAL(10,6) DEFAULT 0,
    reason JSON DEFAULT NULL,
    was_shown BOOLEAN DEFAULT FALSE,
    was_clicked BOOLEAN DEFAULT FALSE,
    generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    shown_at DATETIME DEFAULT NULL,
    clicked_at DATETIME DEFAULT NULL,
    INDEX idx_user (ma_nguoi_dung),
    INDEX idx_document (ma_tai_lieu),
    INDEX idx_score (score DESC)
) ENGINE=InnoDB;

-- PopularSearches
CREATE TABLE IF NOT EXISTS PopularSearches (
    search_id INT AUTO_INCREMENT PRIMARY KEY,
    search_term VARCHAR(255) NOT NULL UNIQUE,
    search_count INT DEFAULT 1,
    result_count INT DEFAULT 0,
    click_count INT DEFAULT 0,
    ctr DECIMAL(5,4) DEFAULT 0,
    count_today INT DEFAULT 0,
    count_week INT DEFAULT 0,
    count_month INT DEFAULT 0,
    trending_score DECIMAL(10,6) DEFAULT 0,
    first_searched DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_searched DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_term (search_term),
    INDEX idx_count (search_count DESC)
) ENGINE=InnoDB;

-- QueryCache
CREATE TABLE IF NOT EXISTS QueryCache (
    cache_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cache_key VARCHAR(255) NOT NULL UNIQUE,
    cache_data LONGTEXT NOT NULL,
    cache_type VARCHAR(50) DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    hit_count INT DEFAULT 0,
    INDEX idx_key (cache_key),
    INDEX idx_expires (expires_at)
) ENGINE=InnoDB;

SELECT '✅ Analytics Database created successfully!' AS message;
