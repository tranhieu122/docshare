🤖 HƯỚNG DẪN CÀI ĐẶT CHATBOT AI - DOCSHARE
Tổng quan tính năng
Chatbot AI của DocShare có các tính năng:

✅ Chat thông minh với Google Gemini Pro
🔍 Tìm kiếm tài liệu trong database
📤 Upload tự động - AI phân tích file và tự động điền thông tin
💬 Lưu lịch sử hội thoại
📊 Thống kê sử dụng


BƯỚC 1: Lấy API Key từ Google AI Studio
1.1. Truy cập Google AI Studio
https://makersuite.google.com/app/apikey
1.2. Tạo API Key

Đăng nhập bằng tài khoản Google
Click "Create API Key"
Chọn project (hoặc tạo project mới)
Copy API Key (dạng: AIzaSy...)

1.3. Giới hạn miễn phí

✅ 60 requests/phút
✅ 1500 requests/ngày
✅ Hoàn toàn miễn phí cho mục đích học tập


BƯỚC 2: Cài đặt package
bashcd document-sharing-platform
npm install @google/generative-ai

BƯỚC 3: Cấu hình API Key
Cách 1: Sử dụng file .env (Khuyến nghị)
bash# Tạo/sửa file .env
GEMINI_API_KEY=AIzaSy_YOUR_API_KEY_HERE
Cách 2: Hard-code trực tiếp
Sửa file controllers/chatbot.js dòng 8:
javascriptconst genAI = new GoogleGenerativeAI('AIzaSy_YOUR_API_KEY_HERE');

BƯỚC 4: Tạo database
4.1. Import SQL
bash# Mở phpMyAdmin hoặc MySQL Workbench
# Chọn database: documentsharing_schema
# Import file: database/chatbot.sql
4.2. Hoặc chạy lệnh
bashmysql -u root -p documentsharing_schema < database/chatbot.sql
4.3. Kiểm tra bảng đã tạo
sqlUSE documentsharing_schema;
SHOW TABLES LIKE 'chat%';
-- Kết quả: chat_history, chatbot_analytics

BƯỚC 5: Cấu hình routes
5.1. Thêm vào server.js
Tìm phần routes và thêm:
javascript// Chatbot routes
const chatbotRoutes = require('./routes/chatbot');
app.use('/api/chatbot', chatbotRoutes);
5.2. Vị trí đúng trong server.js
javascript// ... other imports
const chatbotRoutes = require('./routes/chatbot');

// ... middleware

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/chatbot', chatbotRoutes);  // ← THÊM DÒNG NÀY
app.use('/api/admin', adminRoutes);
// ...

BƯỚC 6: Tạo thư mục uploads
bash# Tạo thư mục lưu file upload từ chatbot
mkdir -p uploads/chatbot
mkdir -p uploads/documents
Cấu hình quyền (Linux/Mac)
bashchmod 755 uploads/
chmod 755 uploads/chatbot/
chmod 755 uploads/documents/

BƯỚC 7: Chạy server
bashnode server.js
Kết quả:
Server is running on port 3000
Connected to MySQL database: documentsharing_schema
Connected to MySQL database: documentsharing_storage

BƯỚC 8: Test chatbot
8.1. Truy cập chatbot
http://localhost:3000/chatbotAI/chat.html
8.2. Test các tính năng
Test 1: Chat thông thường
User: Xin chào
Bot: Xin chào! Tôi có thể giúp gì cho bạn?
Test 2: Tìm kiếm tài liệu
User: Tìm tài liệu về Toán cao cấp
Bot: Tôi đã tìm thấy X tài liệu phù hợp:
[Danh sách tài liệu]
Test 3: Upload file (cần đăng nhập)
1. Đăng nhập vào website
2. Mở chatbot
3. Click icon 📎 để chọn file
4. Gửi file
5. AI sẽ tự động phân tích và đăng tải

BƯỚC 9: Tích hợp vào website
9.1. Thêm link chatbot vào menu
Sửa file index.html - thêm vào nav:
html<a href="./chatbotAI/chat.html" class="nav-link">
    <span class="nav-icon">🤖</span>
    AI Chatbot
</a>
9.2. Widget nổi (Floating button)
File chatbot-widget.js đã được tích hợp sẵn trong các trang.
Kiểm tra trong index.html:
html<script src="./chatbot-widget.js"></script>

CẤU TRÚC FILE CHATBOT
├── chatbotAI/
│   ├── chat.html              # Giao diện chatbot
│   └── README.md              # Hướng dẫn này
├── controllers/
│   └── chatbot.js             # Controller xử lý logic
├── routes/
│   └── chatbot.js             # API routes
├── database/
│   └── chatbot.sql            # Database schema
└── chatbot-widget.js          # Floating widget

API ENDPOINTS
1. Chat với AI
httpPOST /api/chatbot/chat
Content-Type: application/json

{
  "message": "Tìm tài liệu về C++",
  "session_id": "session_123",
  "context": "/index.html"
}
2. Upload file
httpPOST /api/chatbot/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [File]
session_id: session_123
message: "Upload tài liệu"
3. Lấy context
httpGET /api/chatbot/context
4. Lịch sử chat
httpGET /api/chatbot/history?session_id=session_123
Authorization: Bearer {token}

TÙY CHỈNH CHATBOT
Thay đổi System Prompt
Sửa file controllers/chatbot.js dòng 13-40:
javascriptconst SYSTEM_PROMPT = `
Bạn là AI Trợ Lý của DocShare...
[Tùy chỉnh tính cách, phong cách của bot]
`;
Thay đổi model AI
Sửa dòng 9:
javascript// Hiện tại: gemini-1.5-pro
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

// Hoặc dùng: gemini-pro (nhanh hơn, nhẹ hơn)
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
Giới hạn file size
Sửa dòng 24:
javascriptlimits: { fileSize: 50 * 1024 * 1024 }, // 50MB

TROUBLESHOOTING
Lỗi 1: "API key not valid"
Nguyên nhân: API key sai hoặc chưa được enable
Giải pháp:

Kiểm tra API key trong .env
Vào https://makersuite.google.com/app/apikey
Kiểm tra API key còn hoạt động không

Lỗi 2: "Failed to fetch"
Nguyên nhân: Server chưa chạy hoặc CORS
Giải pháp:
bash# Kiểm tra server đang chạy
node server.js

# Kiểm tra port 3000
netstat -an | grep 3000
Lỗi 3: "Resource exhausted"
Nguyên nhân: Vượt quá giới hạn 60 requests/phút
Giải pháp:

Đợi 1 phút
Hoặc nâng cấp plan (có phí)

Lỗi 4: "Bạn cần đăng nhập để upload"
Nguyên nhân: Token không hợp lệ
Giải pháp:

Đăng xuất và đăng nhập lại
Kiểm tra localStorage.token
Kiểm tra middleware auth.js

Lỗi 5: Không tìm thấy tài liệu
Nguyên nhân: Database chưa có tài liệu approved
Giải pháp:
sql-- Kiểm tra tài liệu
SELECT COUNT(*) FROM tai_lieu WHERE trang_thai = 'approved';

-- Approve một số tài liệu test
UPDATE tai_lieu SET trang_thai = 'approved' LIMIT 10;

GIÁM SÁT CHATBOT
Xem thống kê sử dụng
sqlUSE documentsharing_schema;

-- Thống kê hôm nay
SELECT * FROM v_chatbot_stats 
WHERE date = CURDATE();

-- Top user sử dụng nhiều nhất
SELECT 
    user_id, 
    COUNT(*) as total_chats 
FROM chat_history 
GROUP BY user_id 
ORDER BY total_chats DESC 
LIMIT 10;

-- Loại hành động phổ biến
SELECT 
    action_type, 
    COUNT(*) as count 
FROM chat_history 
GROUP BY action_type;
Xóa lịch sử cũ (tự động)
Event đã được cấu hình chạy mỗi tuần, xóa lịch sử > 90 ngày.
Chạy thủ công:
sqlCALL sp_cleanup_chat_history();

NÂNG CẤP (OPTIONAL)
1. Thêm voice input
html<!-- Thêm vào chat.html -->
<button onclick="startVoiceInput()">🎤</button>
2. Thêm suggestion động
javascript// Load suggestions từ database
const suggestions = await fetchPopularSearches();
3. Tích hợp notification
javascript// Khi có chat mới
if (Notification.permission === 'granted') {
    new Notification('AI Chatbot', {
        body: 'Bạn có tin nhắn mới!'
    });
}

HỖ TRỢ

📧 Email: contact@docshare.vn
💬 Telegram: @docshare_support
🐛 Issues: GitHub repository


CHECKLIST CÀI ĐẶT

 Đã lấy API key từ Google AI Studio
 Đã cài package @google/generative-ai
 Đã cấu hình API key trong .env
 Đã import database/chatbot.sql
 Đã thêm routes vào server.js
 Đã tạo thư mục uploads/chatbot/
 Server đang chạy không lỗi
 Test chat thành công
 Test tìm kiếm tài liệu
 Test upload file (với login)
 Chatbot widget hiện trên website