// Simple Rule-Based Chatbot Controller - No AI Required
const { getSchemaPool } = require('../config/database');
const { getAnalyticsPool } = require('../config/database');

// Chatbot knowledge base
const KNOWLEDGE_BASE = {
    website: {
        keywords: ['website', 'trang web', 'hệ thống', 'platform', 'docshare', 'là gì'],
        responses: [
            '🌐 **DocShare là nền tảng chia sẻ tài liệu học tập miễn phí!**\n\n✨ **Tính năng nổi bật:**\n• 📚 Tìm kiếm hàng ngàn tài liệu\n• 📤 Upload và chia sẻ tài liệu\n• ⭐ Đánh giá và bình luận\n• 📊 Quản lý tài liệu cá nhân\n\n🚀 Hãy khám phá ngay!',
            '💡 **DocShare giúp bạn:**\n• Tìm tài liệu học tập nhanh chóng\n• Chia sẻ kiến thức với cộng đồng\n• Tải tài liệu miễn phí\n• Đánh giá chất lượng tài liệu\n\n📚 Bắt đầu tìm kiếm tài liệu ngay!'
        ]
    },
    features: {
        keywords: ['tính năng', 'làm được gì', 'chức năng', 'features', 'có gì', 'có những'],
        responses: [
            '🎯 **DocShare có các tính năng:**\n\n📚 **Tìm kiếm tài liệu**\n• Tìm theo môn học, danh mục\n• Xem tài liệu phổ biến\n• Lọc theo lượt xem/tải\n\n📤 **Upload tài liệu**\n• Hỗ trợ PDF, Word, Excel, PPT\n• Tự động phân loại\n\n💬 **Tương tác**\n• Bình luận, đánh giá\n• Chia sẻ tài liệu\n\n👤 **Quản lý cá nhân**\n• Xem lịch sử tải\n• Quản lý tài liệu của bạn'
        ]
    },
    search: {
        keywords: ['tìm', 'search', 'find', 'cần tài liệu', 'cho tôi', 'có tài liệu'],
        responses: [
            '🔍 **Để tìm tài liệu:**\n\n1. Gõ từ khóa vào ô tìm kiếm\n2. Chọn môn học hoặc danh mục\n3. Xem kết quả và tải về\n\n💡 **Mẹo:** Dùng từ khóa cụ thể để tìm chính xác hơn!\n\n📚 Bạn đang tìm tài liệu về chủ đề gì?',
            '🎯 **Tìm tài liệu dễ dàng:**\n• Thanh tìm kiếm ở đầu trang\n• Lọc theo môn học\n• Sắp xếp theo lượt xem/tải\n• Xem tài liệu liên quan\n\n❓ Cho tôi biết bạn cần tài liệu gì nhé!'
        ]
    },
    upload: {
        keywords: ['upload', 'đăng', 'tải lên', 'chia sẻ', 'đăng tài liệu'],
        responses: [
            '📤 **Để upload tài liệu:**\n\n1️⃣ Đăng nhập tài khoản\n2️⃣ Click **"Upload"** trên menu\n3️⃣ Chọn file (PDF, Word, Excel, PPT)\n4️⃣ Điền thông tin:\n   • Tiêu đề\n   • Mô tả\n   • Môn học\n   • Danh mục\n5️⃣ Click **"Đăng tải"**\n\n✅ Tài liệu sẽ xuất hiện trên hệ thống ngay!'
        ]
    },
    account: {
        keywords: ['tài khoản', 'đăng nhập', 'đăng ký', 'login', 'register', 'account', 'tên gì', 'thông tin'],
        responses: [
            '👤 **Quản lý tài khoản:**\n\n🔐 **Đăng ký:**\n• Click "Đăng ký" trên trang chủ\n• Điền thông tin cá nhân\n\n🔑 **Đăng nhập:**\n• Email + Mật khẩu\n\n📊 **Tính năng thành viên:**\n• Upload tài liệu\n• Lưu tài liệu yêu thích\n• Xem lịch sử\n• Quản lý tài liệu của bạn\n\n💡 Xem thông tin tài khoản tại: **Trang cá nhân**'
        ]
    },
    help: {
        keywords: ['giúp', 'help', 'hướng dẫn', 'guide', 'làm sao', 'như thế nào'],
        responses: [
            '💡 **Tôi có thể giúp bạn:**\n\n📚 Tìm tài liệu học tập\n🔍 Hướng dẫn tìm kiếm\n📤 Hướng dẫn upload\n👤 Quản lý tài khoản\n💬 Trả lời câu hỏi về website\n\n❓ Bạn cần hỗ trợ về vấn đề gì?'
        ]
    },
    greeting: {
        keywords: ['chào', 'hello', 'hi', 'hey', 'xin chào', 'alo'],
        responses: [
            '👋 **Xin chào!** Tôi là DocBot - trợ lý của DocShare.\n\n📚 **Tôi có thể giúp bạn:**\n• Tìm tài liệu học tập\n• Hướng dẫn sử dụng website\n• Trả lời câu hỏi về tính năng\n\n💬 Bạn cần giúp gì?',
            '🌟 **Chào bạn!** Mình là DocBot!\n\n📖 Mình có thể giúp bạn tìm tài liệu, hướng dẫn sử dụng website, hoặc trả lời các câu hỏi về DocShare.\n\n❓ Bạn muốn biết điều gì? 😊'
        ]
    },
    thanks: {
        keywords: ['cảm ơn', 'thank', 'thanks', 'cám ơn', 'cảm ơn bạn'],
        responses: [
            '😊 **Không có gì!** Rất vui được giúp bạn.\n\nNếu cần hỗ trợ thêm, cứ hỏi mình nhé! 💙',
            '🤗 **Rất vui được hỗ trợ bạn!**\n\nChúc bạn học tập tốt và tìm được tài liệu hữu ích! 📚✨'
        ]
    },
    goodbye: {
        keywords: ['tạm biệt', 'bye', 'goodbye', 'see you', 'hẹn gặp lại'],
        responses: [
            '👋 **Tạm biệt!** Chúc bạn học tập hiệu quả!\n\n📚 Quay lại DocShare bất cứ khi nào bạn cần tài liệu nhé! 😊',
            '🌟 **Hẹn gặp lại!** Chúc bạn thành công trong học tập!\n\n💡 DocBot luôn sẵn sàng hỗ trợ bạn! 💙'
        ]
    },
    default: {
        keywords: [],
        responses: [
            '🤔 **Xin lỗi, tôi chưa hiểu câu hỏi của bạn.**\n\n💡 **Bạn có thể hỏi tôi về:**\n• Tài liệu trên website\n• Cách tìm kiếm\n• Cách upload tài liệu\n• Tính năng của DocShare\n• Quản lý tài khoản\n\n🔍 Hoặc thử tìm kiếm trực tiếp trên trang chủ!',
            '❓ **Tôi có thể giúp bạn với:**\n\n📚 Tìm tài liệu\n🔍 Hướng dẫn tìm kiếm\n📤 Upload tài liệu\n💡 Giải thích tính năng\n👤 Hỗ trợ tài khoản\n\n💬 Bạn muốn biết điều gì cụ thể?'
        ]
    }
};

// Detect intent from user message
function detectIntent(message) {
    const lowerMessage = message.toLowerCase().trim();
    
    // Check each knowledge category
    for (const [category, data] of Object.entries(KNOWLEDGE_BASE)) {
        for (const keyword of data.keywords) {
            if (lowerMessage.includes(keyword)) {
                return category;
            }
        }
    }
    
    return 'default';
}

// Get random response from category
function getResponse(category) {
    const responses = KNOWLEDGE_BASE[category]?.responses || KNOWLEDGE_BASE.default.responses;
    return responses[Math.floor(Math.random() * responses.length)];
}

// Search documents in database
async function searchDocumentsInDB(query) {
    try {
        const schemaPool = await getSchemaPool();
        if (!schemaPool) return [];

        const keywords = query.toLowerCase().split(' ').filter(w => w.length > 2);
        const searchPattern = `%${keywords.join('%')}%`;

        const [documents] = await schemaPool.query(`
            SELECT 
                tl.ma_tai_lieu,
                tl.tieu_de,
                tl.mo_ta,
                tl.so_luot_xem,
                tl.so_luot_tai,
                mh.ten_mon_hoc,
                dm.ten_danh_muc
            FROM TaiLieu tl
            LEFT JOIN MonHoc mh ON tl.ma_mon_hoc = mh.ma_mon_hoc
            LEFT JOIN DanhMuc dm ON tl.ma_danh_muc = dm.ma_danh_muc
            WHERE tl.tieu_de LIKE ? OR tl.mo_ta LIKE ? OR mh.ten_mon_hoc LIKE ?
            ORDER BY tl.so_luot_xem DESC, tl.so_luot_tai DESC
            LIMIT 10
        `, [searchPattern, searchPattern, searchPattern]);

        return documents;
    } catch (error) {
        console.error('Database search error:', error);
        return [];
    }
}

// Main chat function
exports.chat = async (req, res) => {
    try {
        const { message, session_id } = req.body;
        const user = req.user || null;

        if (!message || message.trim() === '') {
            return res.status(400).json({ message: 'Tin nhắn không được để trống' });
        }

        const startTime = Date.now();

        // Detect intent and get response
        const intent = detectIntent(message);
        let botMessage = getResponse(intent);

        // If asking about specific subject/document, search database
        if (intent === 'search' || message.length > 15) {
            try {
                const documents = await searchDocumentsInDB(message);
                if (documents.length > 0) {
                    botMessage = '📚 **Tôi tìm thấy các tài liệu này:**\n\n';
                    documents.slice(0, 5).forEach((doc, index) => {
                        botMessage += `${index + 1}. **${doc.tieu_de}**\n`;
                        botMessage += `   📖 Môn: ${doc.ten_mon_hoc || 'Chưa phân loại'}\n`;
                        botMessage += `   👁️ Lượt xem: ${doc.so_luot_xem || 0} | 📥 Tải: ${doc.so_luot_tai || 0}\n`;
                        botMessage += `   🔗 [Xem chi tiết](http://localhost:3000/documents/detail.html?id=${doc.ma_tai_lieu})\n\n`;
                    });
                    if (documents.length > 5) {
                        botMessage += `\n... và **${documents.length - 5} tài liệu khác**. Dùng thanh tìm kiếm để xem thêm! 🔍`;
                    }
                }
            } catch (error) {
                console.error('Search error:', error);
            }
        }

        const responseTime = Date.now() - startTime;

        // Save conversation to analytics database
        const analyticsPool = await getAnalyticsPool();
        if (analyticsPool) {
            try {
                const sessionId = session_id || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                
                // Save user message
                await analyticsPool.query(`
                    INSERT INTO ChatbotConversations (session_id, user_id, message_type, message_content)
                    VALUES (?, ?, 'user', ?)
                `, [sessionId, user?.id || null, message]);

                // Save bot response
                await analyticsPool.query(`
                    INSERT INTO ChatbotConversations (session_id, user_id, message_type, message_content)
                    VALUES (?, ?, 'assistant', ?)
                `, [sessionId, user?.id || null, botMessage]);

            } catch (error) {
                console.error('Failed to save conversation:', error);
            }
        }

        res.json({
            message: botMessage,
            intent: intent,
            response_time: responseTime,
            session_id: session_id,
            model: 'rule-based-bot',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({
            message: '😔 Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại!',
            error: error.message
        });
    }
};

// Get chat history
exports.getHistory = async (req, res) => {
    try {
        const { session_id } = req.query;
        const user = req.user;

        if (!session_id) {
            return res.status(400).json({ message: 'Thiếu session_id' });
        }

        const analyticsPool = await getAnalyticsPool();
        if (!analyticsPool) {
            return res.json({ conversations: [] });
        }

        const [conversations] = await analyticsPool.query(`
            SELECT message_type, message_content, created_at
            FROM ChatbotConversations
            WHERE session_id = ?
            ORDER BY created_at ASC
        `, [session_id]);

        res.json({
            conversations: conversations,
            total: conversations.length
        });

    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({
            message: 'Lỗi khi lấy lịch sử chat',
            error: error.message
        });
    }
};

// Search documents endpoint (for API calls)
exports.searchDocuments = async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query) {
            return res.status(400).json({ message: 'Thiếu từ khóa tìm kiếm' });
        }

        const documents = await searchDocumentsInDB(query);

        res.json({
            documents: documents,
            total: documents.length,
            query: query
        });

    } catch (error) {
        console.error('Search documents error:', error);
        res.status(500).json({
            message: 'Lỗi khi tìm kiếm tài liệu',
            error: error.message
        });
    }
};


