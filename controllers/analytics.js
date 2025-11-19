const { getAnalyticsPool } = require('../config/database');

// Track page view
exports.trackPageView = async (req, res) => {
    try {
        const pool = await getAnalyticsPool();
        if (!pool) {
            return res.status(503).json({ message: 'Analytics not available' });
        }

        const {
            page_url,
            page_title,
            page_type,
            referrer,
            session_id,
            device_type,
            browser,
            os
        } = req.body;

        const user = req.user || null;
        const ip_address = req.ip || req.connection.remoteAddress;
        const user_agent = req.headers['user-agent'];
        const view_date = new Date().toISOString().split('T')[0];

        await pool.query(`
            INSERT INTO PageViews (
                ma_nguoi_dung, session_id, page_url, page_title, page_type,
                referrer, user_agent, device_type, browser, os, ip_address, view_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            user?.ma_nguoi_dung || null,
            session_id,
            page_url,
            page_title,
            page_type,
            referrer,
            user_agent,
            device_type,
            browser,
            os,
            ip_address,
            view_date
        ]);

        res.json({ message: 'Page view tracked' });
    } catch (error) {
        console.error('Track page view error:', error);
        res.status(500).json({ message: 'Error tracking page view' });
    }
};

// Track search query
exports.trackSearch = async (req, res) => {
    try {
        const pool = await getAnalyticsPool();
        if (!pool) {
            return res.status(503).json({ message: 'Analytics not available' });
        }

        const {
            search_term,
            search_type,
            filters,
            results_count,
            session_id
        } = req.body;

        const user = req.user || null;
        const search_date = new Date().toISOString().split('T')[0];

        await pool.query(`
            INSERT INTO SearchQueries (
                ma_nguoi_dung, session_id, search_term, search_type,
                filters, results_count, search_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            user?.ma_nguoi_dung || null,
            session_id,
            search_term,
            search_type || 'general',
            JSON.stringify(filters || {}),
            results_count || 0,
            search_date
        ]);

        res.json({ message: 'Search tracked' });
    } catch (error) {
        console.error('Track search error:', error);
        res.status(500).json({ message: 'Error tracking search' });
    }
};

// Track user behavior
exports.trackBehavior = async (req, res) => {
    try {
        const pool = await getAnalyticsPool();
        if (!pool) {
            return res.status(503).json({ message: 'Analytics not available' });
        }

        const {
            action_type,
            entity_type,
            entity_id,
            context,
            ui_element
        } = req.body;

        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const action_date = new Date().toISOString().split('T')[0];

        await pool.query(`
            INSERT INTO UserBehavior (
                ma_nguoi_dung, action_type, entity_type, entity_id,
                context, ui_element, action_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            user.ma_nguoi_dung,
            action_type,
            entity_type,
            entity_id,
            JSON.stringify(context || {}),
            ui_element,
            action_date
        ]);

        res.json({ message: 'Behavior tracked' });
    } catch (error) {
        console.error('Track behavior error:', error);
        res.status(500).json({ message: 'Error tracking behavior' });
    }
};

// Get analytics dashboard
exports.getDashboard = async (req, res) => {
    try {
        const pool = await getAnalyticsPool();
        if (!pool) {
            return res.status(503).json({ message: 'Analytics not available' });
        }

        const { start_date, end_date } = req.query;
        const startDate = start_date || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const endDate = end_date || new Date().toISOString().split('T')[0];

        const [stats] = await pool.query(`
            CALL sp_analytics_dashboard(?, ?)
        `, [startDate, endDate]);

        res.json(stats[0][0]);
    } catch (error) {
        console.error('Get analytics dashboard error:', error);
        res.status(500).json({ message: 'Error getting analytics' });
    }
};

// Get top searches
exports.getTopSearches = async (req, res) => {
    try {
        const pool = await getAnalyticsPool();
        if (!pool) {
            return res.status(503).json({ message: 'Analytics not available' });
        }

        const limit = parseInt(req.query.limit) || 10;

        const [searches] = await pool.query(`
            CALL sp_top_searches(?)
        `, [limit]);

        res.json(searches[0]);
    } catch (error) {
        console.error('Get top searches error:', error);
        res.status(500).json({ message: 'Error getting top searches' });
    }
};

// Get recommendations for user
exports.getRecommendations = async (req, res) => {
    try {
        const pool = await getAnalyticsPool();
        if (!pool) {
            return res.status(503).json({ message: 'Analytics not available' });
        }

        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const limit = parseInt(req.query.limit) || 5;

        const [recommendations] = await pool.query(`
            CALL sp_user_recommendations(?, ?)
        `, [user.ma_nguoi_dung, limit]);

        res.json(recommendations[0]);
    } catch (error) {
        console.error('Get recommendations error:', error);
        res.status(500).json({ message: 'Error getting recommendations' });
    }
};

// Get real-time analytics
exports.getRealtime = async (req, res) => {
    try {
        const pool = await getAnalyticsPool();
        if (!pool) {
            return res.status(503).json({ message: 'Analytics not available' });
        }

        const [realtime] = await pool.query(`
            SELECT * FROM v_realtime_analytics
        `);

        res.json(realtime[0]);
    } catch (error) {
        console.error('Get realtime analytics error:', error);
        res.status(500).json({ message: 'Error getting realtime analytics' });
    }
};

// Get popular documents today
exports.getPopularToday = async (req, res) => {
    try {
        const pool = await getAnalyticsPool();
        if (!pool) {
            return res.status(503).json({ message: 'Analytics not available' });
        }

        const [popular] = await pool.query(`
            SELECT * FROM v_popular_documents_today
        `);

        res.json(popular);
    } catch (error) {
        console.error('Get popular documents error:', error);
        res.status(500).json({ message: 'Error getting popular documents' });
    }
};

// Chatbot conversation
exports.saveChatMessage = async (req, res) => {
    try {
        const pool = await getAnalyticsPool();
        if (!pool) {
            return res.status(503).json({ message: 'Analytics not available' });
        }

        const {
            session_id,
            message_type,
            message_content,
            page_context,
            intent,
            confidence,
            response_time,
            tokens_used,
            model_used
        } = req.body;

        const user = req.user || null;
        const user_role = user?.chuc_vu || 'guest';

        await pool.query(`
            INSERT INTO ChatbotConversations (
                ma_nguoi_dung, user_role, session_id, message_type,
                message_content, page_context, intent, confidence,
                response_time, tokens_used, model_used
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            user?.ma_nguoi_dung || null,
            user_role,
            session_id,
            message_type,
            message_content,
            page_context,
            intent,
            confidence,
            response_time,
            tokens_used,
            model_used
        ]);

        res.json({ message: 'Chat message saved' });
    } catch (error) {
        console.error('Save chat message error:', error);
        res.status(500).json({ message: 'Error saving chat message' });
    }
};

// Get chatbot stats
exports.getChatbotStats = async (req, res) => {
    try {
        const pool = await getAnalyticsPool();
        if (!pool) {
            return res.status(503).json({ message: 'Analytics not available' });
        }

        const [stats] = await pool.query(`
            SELECT * FROM v_chatbot_stats
            LIMIT 30
        `);

        res.json(stats);
    } catch (error) {
        console.error('Get chatbot stats error:', error);
        res.status(500).json({ message: 'Error getting chatbot stats' });
    }
};
