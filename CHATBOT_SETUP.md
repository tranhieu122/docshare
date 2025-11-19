# 🤖 Chatbot AI - Quick Start Guide

## ✅ Đã cài đặt xong!

### Các file đã tạo:
- `controllers/chatbot.js` - Backend logic
- `routes/chatbot.js` - API routes
- `chatbotAI/chat.html` - Giao diện chatbot
- `chatbotAI/README.md` - Hướng dẫn chi tiết

### API Endpoints đã sẵn sàng:
✅ `POST /api/chatbot/chat` - Chat với AI
✅ `POST /api/chatbot/search` - Tìm tài liệu  
✅ `GET /api/chatbot/context` - Lấy danh mục/môn học
✅ `POST /api/chatbot/feedback` - Phản hồi
✅ `GET /api/chatbot/history` - Lịch sử chat

### Package đã cài:
✅ `@google/generative-ai` - Google Gemini AI SDK

---

## 🚀 Cách sử dụng:

### Bước 1: Lấy API Key (MIỄN PHÍ)

1. Truy cập: https://makersuite.google.com/app/apikey
2. Đăng nhập Google
3. Click **"Create API Key"** 
4. Copy API key

### Bước 2: Cấu hình API Key

Mở file `.env` và thay thế:
```
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
```

Bằng API key bạn vừa lấy:
```
GEMINI_API_KEY=AIzaSy...your_actual_key_here
```

### Bước 3: Khởi động server

```bash
node server.js
```

### Bước 4: Mở Chatbot

Trình duyệt: http://localhost:3000/chatbotAI/chat.html

---

## 💡 Tính năng:

✨ **Chat thông minh với AI**
- Hỏi đáp về tài liệu học tập
- Gợi ý môn học phù hợp
- Hướng dẫn sử dụng website

🔍 **Tìm kiếm thông minh**
- Tìm tài liệu theo từ khóa
- Gợi ý tài liệu liên quan
- Xếp hạng theo độ phổ biến

📊 **Analytics**
- Lưu lịch sử hội thoại
- Theo dõi câu hỏi phổ biến
- Feedback từ người dùng

---

## 🎨 Tích hợp vào website:

### Option 1: Link trong menu
```html
<a href="/chatbotAI/chat.html">💬 Chat với AI</a>
```

### Option 2: Floating button
Thêm vào cuối `<body>` của các trang:

```html
<a href="/chatbotAI/chat.html" class="chat-float-btn">🤖</a>
<style>
.chat-float-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 28px;
    text-decoration: none;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    z-index: 1000;
    transition: transform 0.3s;
}
.chat-float-btn:hover {
    transform: scale(1.1);
}
</style>
```

---

## 📋 Test Chatbot:

```bash
node test-chatbot.js
```

Hoặc test thủ công:

```bash
# Test search
curl -X POST http://localhost:3000/api/chatbot/search \
  -H "Content-Type: application/json" \
  -d '{"query":"toán"}'

# Test chat (need API key)
curl -X POST http://localhost:3000/api/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Xin chào","session_id":"test123"}'
```

---

## ⚙️ Tùy chỉnh:

### Thay đổi tính cách AI:
Sửa `SYSTEM_PROMPT` trong `controllers/chatbot.js` dòng 8-23

### Thay đổi giao diện:
Sửa CSS trong `chatbotAI/chat.html`

### Thay đổi model AI:
Dòng 49 trong `controllers/chatbot.js`:
```javascript
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
// Có thể thay bằng: 'gemini-1.5-pro', 'gemini-1.5-flash'
```

---

## 🔥 Giới hạn miễn phí:

- **60 requests/phút**
- **1,500 requests/ngày**
- Đủ cho website nhỏ và vừa!

Nếu cần nhiều hơn → Nâng cấp plan trên Google AI Studio

---

## 🐛 Troubleshooting:

**Lỗi: "Chatbot chưa được cấu hình"**
→ Chưa set GEMINI_API_KEY trong .env

**Lỗi: "Failed to fetch"**
→ Server chưa chạy hoặc port 3000 bị chặn

**Lỗi: "Resource exhausted"**
→ Vượt quá 60 requests/phút, đợi 1 phút

**Chat không thông minh**
→ Cải thiện SYSTEM_PROMPT, thêm context về website

---

## 📚 Tài liệu tham khảo:

- Google Gemini AI: https://ai.google.dev/
- API Documentation: https://ai.google.dev/api
- Examples: https://github.com/google/generative-ai-docs

---

**Chúc bạn thành công! 🎉**

Nếu cần hỗ trợ, hãy đọc file `chatbotAI/README.md` để biết thêm chi tiết.
