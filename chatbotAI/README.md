# =============================================
# HƯỚNG DẪN CÀI ĐẶT CHATBOT AI
# =============================================

## Bước 1: Lấy API Key từ Google AI Studio

1. Truy cập: https://makersuite.google.com/app/apikey
2. Đăng nhập bằng tài khoản Google
3. Click "Create API Key" → Chọn project (hoặc tạo mới)
4. Copy API Key

## Bước 2: Cấu hình API Key

Thêm vào file `.env`:
```
GEMINI_API_KEY=your_api_key_here
```

Hoặc sửa trực tiếp trong `controllers/chatbot.js` dòng 6:
```javascript
const genAI = new GoogleGenerativeAI('YOUR_API_KEY_HERE');
```

## Bước 3: Khởi động server

```bash
node server.js
```

## Bước 4: Sử dụng Chatbot

1. Mở trình duyệt: `http://localhost:3000/chatbotAI/chat.html`
2. Hoặc thêm link vào menu website của bạn

## API Endpoints

- `POST /api/chatbot/chat` - Chat với AI
- `POST /api/chatbot/search` - Tìm tài liệu
- `GET /api/chatbot/context` - Lấy danh mục/môn học
- `POST /api/chatbot/feedback` - Feedback
- `GET /api/chatbot/history` - Lịch sử chat

## Tính năng

✅ Chat với AI thông minh (Google Gemini Pro)
✅ Tìm kiếm tài liệu học tập
✅ Gợi ý môn học
✅ Hướng dẫn sử dụng website
✅ Lưu lịch sử hội thoại
✅ Analytics và tracking
✅ Responsive design

## Tùy chỉnh

### Thay đổi System Prompt
Sửa file `controllers/chatbot.js` dòng 8-23

### Thay đổi giao diện
Sửa file `chatbotAI/chat.html`

### Tích hợp vào website
Thêm floating button vào các trang khác:

```html
<!-- Floating Chat Button -->
<a href="/chatbotAI/chat.html" class="chat-float-btn" 
   style="position: fixed; bottom: 20px; right: 20px; 
          width: 60px; height: 60px; background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          color: white; font-size: 28px; text-decoration: none; box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          z-index: 1000;">
    🤖
</a>
```

## Giới hạn

- Gemini API có giới hạn miễn phí: 60 requests/phút
- Nếu cần nhiều hơn, nâng cấp lên Google AI Studio Pro

## Troubleshooting

**Lỗi: "API key not valid"**
- Kiểm tra API key đã đúng chưa
- API key đã được enable chưa

**Lỗi: "Failed to fetch"**
- Kiểm tra server đang chạy
- Kiểm tra CORS đã được enable

**Lỗi: "Resource exhausted"**
- Vượt quá giới hạn request
- Đợi 1 phút hoặc nâng cấp plan
