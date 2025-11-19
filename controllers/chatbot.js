const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getAnalyticsPool } = require('../config/database');
const { getSchemaPool } = require('../config/database');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'YOUR_API_KEY_HERE');

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Helper function to delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Retry API call with exponential backoff
async function retryApiCall(apiFunction, retries = MAX_RETRIES) {
    for (let i = 0; i < retries; i++) {
        try {
            return await apiFunction();
        } catch (error) {
            const isLastRetry = i === retries - 1;
            const isOverloadError = error.message?.includes('503') || error.message?.includes('overloaded');
            
            if (isOverloadError && !isLastRetry) {
                const waitTime = RETRY_DELAY * Math.pow(2, i); // Exponential backoff
                console.log(`API overloaded, retrying in ${waitTime}ms... (attempt ${i + 1}/${retries})`);
                await delay(waitTime);
                continue;
            }
            
            throw error;
        }
    }
}

// Smart fallback responses when AI is unavailable
const FALLBACK_RESPONSES = {
    greeting: [
        'Xin chào! 👋 Tôi là DocBot - trợ lý AI của DocShare. Tôi có thể giúp bạn tìm tài liệu học tập. Bạn đang tìm tài liệu gì?',
        'Chào bạn! 😊 Mình là DocBot, trợ lý ảo của DocShare. Hãy cho mình biết bạn cần tài liệu về môn gì nhé!',
        'Hi! 🌟 DocBot đây! Tôi sẵn sàng giúp bạn tìm tài liệu học tập chất lượng. Bạn cần gì?'
    ],
    search: [
        'Để tìm tài liệu, bạn có thể:\n📌 Dùng thanh tìm kiếm ở đầu trang\n📌 Duyệt theo danh mục môn học\n📌 Xem tài liệu mới nhất hoặc phổ biến nhất\n\nHoặc cho mình biết cụ thể bạn cần tài liệu gì! 😊',
        'Tôi có thể giúp bạn tìm tài liệu! 📚 Hãy nói cho tôi biết:\n• Môn học nào?\n• Loại tài liệu gì? (giáo trình, bài tập, slide...)\n• Chủ đề cụ thể?'
    ],
    error: [
        'Xin lỗi, hệ thống AI đang quá tải. 😔 Nhưng đừng lo! Bạn vẫn có thể:\n✨ Tìm kiếm tài liệu trực tiếp trên trang chủ\n✨ Duyệt theo danh mục\n✨ Xem tài liệu phổ biến\n\nHoặc thử lại sau vài giây nhé!',
        'Oops! AI của tôi đang nghỉ giải lao. ☕ Trong lúc chờ đợi, bạn có thể tự khám phá hàng ngàn tài liệu chất lượng trên DocShare! 📚',
        'Hệ thống AI đang bận xử lý nhiều yêu cầu. 🔄 Bạn có thể thử lại sau ít phút, hoặc tìm kiếm tài liệu trực tiếp bằng thanh tìm kiếm nhé!'
    ]
};

function getRandomFallback(type) {
    const responses = FALLBACK_RESPONSES[type] || FALLBACK_RESPONSES.error;
    return responses[Math.floor(Math.random() * responses.length)];
}

function detectIntent(message) {
    const lowerMessage = message.toLowerCase();
    if (/^(hi|hello|chào|xin chào|hey)/.test(lowerMessage)) {
        return 'greeting';
    }
    if (/tìm|search|find|cần|muốn|có|giúp/.test(lowerMessage)) {
        return 'search';
    }
    return 'general';
}

// System prompt for the chatbot
const SYSTEM_PROMPT = `Bạn là DocBot - trợ lý AI thông minh và thân thiện của nền tảng chia sẻ tài liệu học tập DocShare.

🎯 NHIỆM VỤ CỦA BẠN:
• Tìm kiếm và gợi ý tài liệu học tập chất lượng cao
• Tư vấn môn học, danh mục tài liệu phù hợp
• Hướng dẫn sử dụng các tính năng của website
• Giải đáp thắc mắc về học tập và nghiên cứu
• Hỗ trợ sinh viên tối ưu hóa việc học

💡 PHONG CÁCH GIAO TIẾP:
• Thân thiện, nhiệt tình như một người bạn học
• Trả lời ngắn gọn, súc tích nhưng đầy đủ thông tin
• Sử dụng emoji phù hợp để tạo cảm giác gần gũi
• Luôn tích cực và khuyến khích người học
• Cá nhân hóa câu trả lời theo ngữ cảnh

📚 KHI GIỚI THIỆU TÀI LIỆU:
• Phân tích nhu cầu và đề xuất tài liệu phù hợp nhất
• Giải thích tại sao tài liệu đó hữu ích
• Cung cấp link trực tiếp: [Tên tài liệu](URL)
• Nêu rõ điểm mạnh: lượt xem, đánh giá, nội dung
• Gợi ý thêm tài liệu liên quan nếu có

⚡ NGUYÊN TẮC:
• Nếu không chắc chắn, hãy thừa nhận và hướng dẫn cách tìm thông tin
• Khuyến khích khám phá và tự học
• Luôn đặt lợi ích học tập của sinh viên lên hàng đầu
• Tránh đưa ra thông tin sai lệch hoặc không chính xác
`;

// Search documents based on query
async function searchDocuments(query) {
    try {
        const pool = await getSchemaPool();
        if (!pool) return [];

        // Extract key words from query
        const keywords = query.toLowerCase().split(/\s+/).filter(word => 
            word.length > 2 && 
            !['của', 'về', 'cho', 'với', 'trong', 'trên', 'này', 'đó', 'thế', 'như', 'mà', 'và', 'hay', 'hoặc'].includes(word)
        );

        // If no meaningful keywords, return all documents
        if (keywords.length === 0) {
            const [documents] = await pool.query(`
                SELECT 
                    t.ma_tai_lieu,
                    t.tieu_de,
                    t.mo_ta,
                    t.so_luot_xem,
                    t.so_luot_tai,
                    t.ngay_tai,
                    m.ten_mon_hoc,
                    d.ten_danh_muc
                FROM TaiLieu t
                LEFT JOIN MonHoc m ON t.ma_mon_hoc = m.ma_mon_hoc
                LEFT JOIN DanhMuc d ON t.ma_danh_muc = d.ma_danh_muc
                WHERE t.trang_thai = 'approved'
                ORDER BY t.so_luot_xem DESC, t.ngay_tai DESC
                LIMIT 10
            `);
            return documents;
        }

        // Search with keywords
        const searchPattern = `%${keywords.join('%')}%`;
        const [documents] = await pool.query(`
            SELECT 
                t.ma_tai_lieu,
                t.tieu_de,
                t.mo_ta,
                t.so_luot_xem,
                t.so_luot_tai,
                t.ngay_tai,
                m.ten_mon_hoc,
                d.ten_danh_muc
            FROM TaiLieu t
            LEFT JOIN MonHoc m ON t.ma_mon_hoc = m.ma_mon_hoc
            LEFT JOIN DanhMuc d ON t.ma_danh_muc = d.ma_danh_muc
            WHERE 
                t.trang_thai = 'approved'
                AND (
                    t.tieu_de LIKE ? OR
                    t.mo_ta LIKE ? OR
                    m.ten_mon_hoc LIKE ? OR
                    d.ten_danh_muc LIKE ?
                )
            ORDER BY 
                t.so_luot_xem DESC,
                t.ngay_tai DESC
            LIMIT 10
        `, [searchPattern, searchPattern, searchPattern, searchPattern]);

        return documents;
    } catch (error) {
        console.error('Search documents error:', error);
        return [];
    }
}

// Detect if user is asking about documents
function isDocumentQuery(message) {
    const keywords = [
        'tài liệu', 'tìm', 'có', 'môn', 'học', 'giáo trình', 'bài giảng',
        'slide', 'pdf', 'doc', 'download', 'tải', 'xem', 'đọc',
        'lập trình', 'toán', 'lý', 'hóa', 'anh', 'văn', 'sử', 'địa',
        'kinh tế', 'kế toán', 'marketing', 'quản trị', 'tin học',
        'website', 'web', 'hiện có', 'có sẵn', 'danh sách'
    ];
    
    const lowerMessage = message.toLowerCase();
    return keywords.some(keyword => lowerMessage.includes(keyword));
}

// Chat with AI
exports.chat = async (req, res) => {
    try {
        const { message, session_id, context } = req.body;
        const user = req.user || null;

        if (!message || message.trim() === '') {
            return res.status(400).json({ message: 'Tin nhắn không được để trống' });
        }

        const startTime = Date.now();

        // Get conversation history from analytics database
        const analyticsPool = await getAnalyticsPool();
        let conversationHistory = [];
        
        if (analyticsPool && session_id) {
            const [history] = await analyticsPool.query(`
                SELECT message_type, message_content
                FROM ChatbotConversations
                WHERE session_id = ?
                ORDER BY created_at DESC
                LIMIT 10
            `, [session_id]);
            conversationHistory = history.reverse();
        }

        // Build conversation context
        let fullPrompt = SYSTEM_PROMPT + '\n\n';
        
        // Add conversation history
        if (conversationHistory.length > 0) {
            fullPrompt += 'Lịch sử hội thoại:\n';
            conversationHistory.forEach(msg => {
                const role = msg.message_type === 'user' ? 'Người dùng' : 'Trợ lý';
                fullPrompt += `${role}: ${msg.message_content}\n`;
            });
            fullPrompt += '\n';
        }

        // Search for documents if user is asking about documents
        let documents = [];
        let documentContext = '';
        if (isDocumentQuery(message)) {
            documents = await searchDocuments(message);
            
            if (documents.length > 0) {
                documentContext = 'Tài liệu có sẵn trên hệ thống:\n\n';
                documents.forEach((doc, index) => {
                    const docUrl = `http://localhost:3000/documents/detail.html?id=${doc.ma_tai_lieu}`;
                    documentContext += `${index + 1}. **${doc.tieu_de}**\n`;
                    documentContext += `   - Môn học: ${doc.ten_mon_hoc || 'Chưa phân loại'}\n`;
                    documentContext += `   - Danh mục: ${doc.ten_danh_muc || 'Chưa có'}\n`;
                    documentContext += `   - Mô tả: ${doc.mo_ta || 'Không có mô tả'}\n`;
                    documentContext += `   - Lượt xem: ${doc.so_luot_xem || 0}, Lượt tải: ${doc.so_luot_tai || 0}\n`;
                    documentContext += `   - Link: ${docUrl}\n\n`;
                });
                fullPrompt += documentContext;
            } else {
                fullPrompt += 'Không tìm thấy tài liệu phù hợp trong hệ thống.\n\n';
            }
        }

        // Add context if provided
        if (context) {
            fullPrompt += `Ngữ cảnh: ${context}\n\n`;
        }

        // Add current message
        fullPrompt += `Người dùng: ${message}\nTrợ lý:`;

        // Call Gemini API with retry logic
        let botMessage;
        let usedFallback = false;
        
        try {
            const result = await retryApiCall(async () => {
                const model = genAI.getGenerativeModel({ 
                    model: 'gemini-2.0-flash-exp',
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024,
                    }
                });
                return await model.generateContent(fullPrompt);
            });
            
            const response = result.response;
            botMessage = response.text();
        } catch (apiError) {
            console.error('AI API error after retries:', apiError.message);
            usedFallback = true;
            
            // Use intelligent fallback based on context
            if (documents.length > 0) {
                // If we have documents, present them even without AI
                botMessage = `Tôi tìm thấy ${documents.length} tài liệu phù hợp với câu hỏi của bạn:\n\n`;
                documents.slice(0, 3).forEach((doc, index) => {
                    botMessage += `${index + 1}. **${doc.tieu_de}**\n`;
                    botMessage += `   📚 ${doc.ten_mon_hoc || 'Chưa phân loại'} • 👁️ ${doc.so_luot_xem || 0} lượt xem\n`;
                    botMessage += `   [Xem tài liệu →](http://localhost:3000/documents/detail.html?id=${doc.ma_tai_lieu})\n\n`;
                });
                if (documents.length > 3) {
                    botMessage += `\n✨ Và còn ${documents.length - 3} tài liệu khác nữa!`;
                }
            } else {
                // Use smart fallback based on intent
                const intent = detectIntent(message);
                botMessage = getRandomFallback(intent === 'greeting' || intent === 'search' ? intent : 'error');
            }
        }

        const responseTime = Date.now() - startTime;

        // Save to analytics database
        if (analyticsPool && session_id) {
            try {
                // Save user message
                await analyticsPool.query(`
                    INSERT INTO ChatbotConversations (
                        ma_nguoi_dung, user_role, session_id, message_type,
                        message_content, page_context, model_used
                    ) VALUES (?, ?, ?, ?, ?, ?, ?)
                `, [
                    user?.ma_nguoi_dung || null,
                    user?.chuc_vu || 'guest',
                    session_id,
                    'user',
                    message,
                    context || null,
                    'gemini-2.5-flash'
                ]);

                // Save bot message
                await analyticsPool.query(`
                    INSERT INTO ChatbotConversations (
                        ma_nguoi_dung, user_role, session_id, message_type,
                        message_content, page_context, response_time, model_used
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `, [
                    user?.ma_nguoi_dung || null,
                    user?.chuc_vu || 'guest',
                    session_id,
                    'bot',
                    botMessage,
                    context || null,
                    responseTime,
                    'gemini-2.5-flash'
                ]);
            } catch (dbError) {
                console.error('Error saving chat to analytics:', dbError);
                // Continue even if analytics save fails
            }
        }

        res.json({
            message: botMessage,
            session_id: session_id,
            response_time: responseTime,
            model: usedFallback ? 'fallback' : 'gemini-2.0-flash-exp',
            fallback_used: usedFallback,
            documents: documents.length > 0 ? documents.map(doc => ({
                id: doc.ma_tai_lieu,
                title: doc.tieu_de,
                description: doc.mo_ta,
                subject: doc.ten_mon_hoc,
                category: doc.ten_danh_muc,
                views: doc.so_luot_xem,
                downloads: doc.so_luot_tai,
                url: `http://localhost:3000/documents/detail.html?id=${doc.ma_tai_lieu}`
            })) : undefined
        });

    } catch (error) {
        console.error('Chatbot error:', error);
        
        let errorMessage = getRandomFallback('error');
        let statusCode = 500;
        
        if (error.message?.includes('API key') || error.message?.includes('invalid')) {
            errorMessage = '⚙️ Chatbot chưa được cấu hình đúng. Vui lòng liên hệ quản trị viên để kích hoạt AI.';
            statusCode = 503;
        } else if (error.message?.includes('network') || error.message?.includes('timeout')) {
            errorMessage = '🌐 Kết nối mạng không ổn định. Vui lòng kiểm tra internet và thử lại!';
            statusCode = 503;
        } else if (error.message?.includes('rate limit')) {
            errorMessage = '⏱️ Quá nhiều yêu cầu! Vui lòng chờ một chút rồi thử lại nhé. Trong lúc chờ, bạn có thể tìm kiếm tài liệu trực tiếp! 📚';
            statusCode = 429;
        }

        res.status(statusCode).json({ 
            message: errorMessage,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
            fallback_used: true,
            suggestion: 'Bạn có thể tìm kiếm tài liệu trực tiếp trên trang chủ hoặc duyệt theo danh mục! 🔍'
        });
    }
};

// Search documents for chatbot context
exports.searchDocuments = async (req, res) => {
    try {
        const { query, limit = 5 } = req.body;

        if (!query) {
            return res.status(400).json({ message: 'Query is required' });
        }

        const pool = await getSchemaPool();
        if (!pool) {
            return res.status(503).json({ message: 'Database not available' });
        }

        const [documents] = await pool.query(`
            SELECT 
                t.ma_tai_lieu,
                t.tieu_de,
                t.mo_ta,
                m.ten_mon_hoc,
                d.ten_danh_muc,
                t.so_luot_xem,
                t.diem_trung_binh
            FROM TaiLieu t
            LEFT JOIN MonHoc m ON t.ma_mon_hoc = m.ma_mon_hoc
            LEFT JOIN DanhMuc d ON t.ma_danh_muc = d.ma_danh_muc
            WHERE 
                t.trang_thai = 'approved'
                AND (
                    t.tieu_de LIKE ? OR
                    t.mo_ta LIKE ? OR
                    m.ten_mon_hoc LIKE ? OR
                    d.ten_danh_muc LIKE ?
                )
            ORDER BY t.diem_trung_binh DESC, t.so_luot_xem DESC
            LIMIT ?
        `, [
            `%${query}%`,
            `%${query}%`,
            `%${query}%`,
            `%${query}%`,
            parseInt(limit)
        ]);

        res.json({ documents });
    } catch (error) {
        console.error('Search documents error:', error);
        res.status(500).json({ message: 'Error searching documents' });
    }
};

// Get categories and subjects for chatbot
exports.getContext = async (req, res) => {
    try {
        const pool = await getSchemaPool();
        if (!pool) {
            return res.status(503).json({ message: 'Database not available' });
        }

        const [categories] = await pool.query(`
            SELECT ma_danh_muc, ten_danh_muc, mo_ta
            FROM DanhMuc
            WHERE trang_thai = 'active'
            ORDER BY ten_danh_muc
        `);

        const [subjects] = await pool.query(`
            SELECT ma_mon_hoc, ten_mon_hoc, ma_mon, mo_ta
            FROM MonHoc
            WHERE trang_thai = 'active'
            ORDER BY ten_mon_hoc
        `);

        res.json({
            categories,
            subjects,
            total_categories: categories.length,
            total_subjects: subjects.length
        });
    } catch (error) {
        console.error('Get context error:', error);
        res.status(500).json({ message: 'Error getting context' });
    }
};

// Feedback on chatbot response
exports.feedback = async (req, res) => {
    try {
        const { session_id, conversation_id, helpful, feedback_text } = req.body;

        if (!session_id && !conversation_id) {
            return res.status(400).json({ message: 'Session ID or Conversation ID required' });
        }

        const analyticsPool = await getAnalyticsPool();
        if (!analyticsPool) {
            return res.status(503).json({ message: 'Analytics not available' });
        }

        if (conversation_id) {
            // Update specific conversation
            await analyticsPool.query(`
                UPDATE ChatbotConversations
                SET helpful = ?, feedback_text = ?
                WHERE conversation_id = ?
            `, [helpful, feedback_text, conversation_id]);
        } else {
            // Update last bot message in session
            await analyticsPool.query(`
                UPDATE ChatbotConversations
                SET helpful = ?, feedback_text = ?
                WHERE session_id = ? AND message_type = 'bot'
                ORDER BY created_at DESC
                LIMIT 1
            `, [helpful, feedback_text, session_id]);
        }

        res.json({ message: 'Cảm ơn phản hồi của bạn!' });
    } catch (error) {
        console.error('Feedback error:', error);
        res.status(500).json({ message: 'Error saving feedback' });
    }
};

// Upload file and analyze with AI
exports.uploadFile = async (req, res) => {
    try {
        const { session_id, message } = req.body;
        const user = req.user || null;
        
        if (!req.file) {
            return res.status(400).json({ message: 'Vui lòng chọn file để upload' });
        }

        const file = req.file;
        const startTime = Date.now();

        // Analyze file with AI
        let aiResponse;
        try {
            const prompt = `Đây là file "${file.originalname}" (${file.mimetype}, ${file.size} bytes).
            
${message || 'Người dùng đã upload file này. Hãy phân tích và đưa ra nhận xét về file, gợi ý cách sử dụng, hoặc trả lời câu hỏi của họ.'}

Hãy phản hồi một cách hữu ích và chuyên nghiệp.`;

            const result = await retryApiCall(async () => {
                const model = genAI.getGenerativeModel({ 
                    model: 'gemini-2.0-flash-exp',
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024,
                    }
                });
                return await model.generateContent(prompt);
            });
            
            aiResponse = result.response.text();
        } catch (apiError) {
            console.error('AI API error:', apiError.message);
            aiResponse = `✅ File "${file.originalname}" đã được upload thành công!\n\n📊 Thông tin file:\n• Tên: ${file.originalname}\n• Kích thước: ${(file.size / 1024).toFixed(2)} KB\n• Loại: ${file.mimetype}\n\nBạn có thể sử dụng file này để tham khảo hoặc chia sẻ với cộng đồng! 📚`;
        }

        const responseTime = Date.now() - startTime;

        // Save file info to ChatbotFiles table
        const analyticsPool = await getAnalyticsPool();
        let fileId = null;
        
        if (analyticsPool) {
            try {
                const [fileResult] = await analyticsPool.query(`
                    INSERT INTO ChatbotFiles (
                        ma_nguoi_dung, session_id, original_name, stored_name,
                        file_path, file_size, mime_type, analysis_result
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `, [
                    user?.ma_nguoi_dung || null,
                    session_id,
                    file.originalname,
                    file.filename,
                    file.path,
                    file.size,
                    file.mimetype,
                    aiResponse
                ]);
                
                fileId = fileResult.insertId;
                console.log('✅ File saved to ChatbotFiles with ID:', fileId);
            } catch (dbError) {
                console.error('❌ Error saving file to ChatbotFiles:', dbError);
            }
        }

        // Save to analytics (conversation history)
        if (analyticsPool && session_id) {
            try {
                await analyticsPool.query(`
                    INSERT INTO ChatbotConversations (
                        ma_nguoi_dung, user_role, session_id, message_type,
                        message_content, page_context, response_time, model_used
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `, [
                    user?.ma_nguoi_dung || null,
                    user?.chuc_vu || 'guest',
                    session_id,
                    'bot',
                    aiResponse,
                    'file_upload',
                    responseTime,
                    'gemini-2.0-flash-exp'
                ]);
                console.log('✅ Conversation saved to ChatbotConversations');
            } catch (dbError) {
                console.error('❌ Error saving to analytics:', dbError);
            }
        }

        res.json({
            message: aiResponse,
            file: {
                id: fileId,
                name: file.originalname,
                size: file.size,
                type: file.mimetype,
                path: file.path
            },
            response_time: responseTime
        });
    } catch (error) {
        console.error('Upload file error:', error);
        res.status(500).json({ 
            message: 'Lỗi khi upload file. Vui lòng thử lại!',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get chat history
exports.getHistory = async (req, res) => {
    try {
        const { session_id } = req.query;

        if (!session_id) {
            return res.status(400).json({ message: 'Session ID required' });
        }

        const analyticsPool = await getAnalyticsPool();
        if (!analyticsPool) {
            return res.status(503).json({ message: 'Analytics not available' });
        }

        const [history] = await analyticsPool.query(`
            SELECT 
                conversation_id,
                message_type,
                message_content,
                response_time,
                created_at
            FROM ChatbotConversations
            WHERE session_id = ?
            ORDER BY created_at ASC
        `, [session_id]);

        res.json({ history });
    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({ message: 'Error getting history' });
    }
};

// Document query - alias for searchDocuments
exports.documentQuery = async (req, res) => {
    return exports.searchDocuments(req, res);
};
