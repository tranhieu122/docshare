git clone <repository-url>
cd document-sharing-platform
document-sharing-platform/
│
├── 📁 config/              # Cấu hình database
├── 📁 controllers/         # Xử lý logic (auth, document, admin...)
├── 📁 routes/              # Định tuyến API
├── 📁 middleware/          # Bảo mật & upload file
├── 📁 database/            # File SQL tạo database
│
├── 📁 index.html           # Trang chủ
├── 📁 login.html           # Trang đăng nhập
├── 📁 register.html        # Trang đăng ký
│
├── 📁 sinhvien/            # Dashboard sinh viên
│   ├── home.html
│   ├── upload.html
│   ├── my-documents.html
│   └── profile.html
│
├── 📁 documents/           # Trang tài liệu
│   ├── list.html           # Danh sách tài liệu
│   └── detail.html         # Chi tiết tài liệu
│
├── 📁 admin/               # Dashboard admin
│   ├── dashboard.html
│   ├── users.html
│   ├── documents.html
│   └── categories.html
│
├── 📁 chatbotAI/           # Chatbot page (nếu cần)
├── 📁 uploads/             # Thư mục chứa file upload
│
├── 📄 chatbot-widget.js    # Widget chatbot nổi
├── 📄 main.js              # JavaScript chung
├── 📄 style.css            # CSS chung
├── 📄 server.js            # File chạy server
├── 📄 package.json         # Danh sách thư viện
└── 📄 .env                 # Cấu hình (database, API key)

# DocShare - Nền tảng chia sẻ tài liệu học tập

## 1. Giới thiệu
DocShare là website chia sẻ tài liệu học tập dành cho sinh viên Việt Nam. Nền tảng hỗ trợ tìm kiếm, tải về, upload tài liệu, quản lý tài khoản, và tích hợp chatbot AI hỗ trợ học tập.

## 2. Tính năng nổi bật

- 📚 **Tìm kiếm, xem, tải và upload tài liệu**: Hỗ trợ nhiều định dạng (PDF, Word, PowerPoint, Excel), phân loại theo môn học, danh mục.
- 🏷️ **Quản lý danh mục, môn học, tài liệu**: Thêm/sửa/xóa danh mục, môn học, duyệt tài liệu mới.
- 👤 **Quản lý tài khoản sinh viên & admin**: Đăng ký, đăng nhập, phân quyền, quản lý user, đổi vai trò.
- 🤖 **Chatbot AI**: Tìm tài liệu, giải đáp thắc mắc, gợi ý học tập, hướng dẫn sử dụng website.
- 📈 **Thống kê, analytics, feedback**: Dashboard tổng quan, biểu đồ, phản hồi người dùng.
- 🔒 **Bảo mật**: Xác thực JWT, phân quyền, mã hóa mật khẩu, kiểm duyệt tài liệu.
- 💬 **Bình luận, đánh giá**: Đánh giá 1-5 sao, bình luận, thảo luận tài liệu.
- 📱 **Responsive UI**: Giao diện đẹp, tối ưu cho mọi thiết bị.

## 3. Cấu trúc thư mục dự án
Xem chi tiết trong file [`FOLDER.md`](./FOLDER.md). Ví dụ:

```
├── index.html                # Trang chủ
├── style.css                 # CSS chung
├── main.js                   # JS chung
├── admin/                    # Giao diện quản trị
├── sinhvien/                 # Giao diện sinh viên
├── documents/                # Trang tài liệu
├── chatbotAI/                # Chatbot AI
├── controllers/              # Backend controllers
├── config/                   # Cấu hình DB
├── database/                 # File SQL, schema
├── middleware/               # Middleware Express
├── uploads/                  # File upload
└── ...
```

## 4. Hướng dẫn cài đặt chi tiết

### 4.1. Yêu cầu hệ thống
- Node.js >= 14.x
- MySQL (XAMPP, WAMP, hoặc server riêng)
- Trình duyệt hiện đại (Chrome, Edge, Firefox)

### 4.2. Cài đặt project
```bash
git clone <repository-url>
cd document-sharing-platform-main
npm install
```

### 4.3. Thiết lập database
1. Mở XAMPP, start MySQL
2. Vào phpMyAdmin tạo 3 database:
  - `documentsharing_schema`
  - `documentsharing_storage`
  - `documentsharing_analytics`
3. Import các file SQL tương ứng trong thư mục `database/`

### 4.4. Cấu hình môi trường
1. Copy file `.env.example` thành `.env`
2. Sửa thông tin kết nối DB, thêm GEMINI_API_KEY nếu dùng chatbot AI

### 4.5. Chạy server
```bash
node server.js
```
Truy cập: [http://localhost:3000](http://localhost:3000)

## 5. API Backend (ví dụ)

- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `GET /api/documents` - Lấy danh sách tài liệu
- `POST /api/documents` - Upload tài liệu
- `GET /api/chatbot/context` - Lấy context chatbot
- `POST /api/chatbot/chat` - Chat với AI

## 6. Phát triển & đóng góp

1. Fork repo, tạo branch mới cho mỗi tính năng/bugfix
2. Commit rõ ràng, mô tả chi tiết
3. Tạo pull request, review code
4. Đọc kỹ file `FOLDER.md` và comment trong code

## 7. Troubleshooting & FAQ

- **Không kết nối được DB:** Kiểm tra MySQL đã chạy, thông tin trong `.env` đúng chưa
- **Không upload được file:** Kiểm tra dung lượng, định dạng, quyền thư mục `uploads/`
- **Chatbot báo lỗi 503:** Google Gemini API quá tải, thử lại sau hoặc kiểm tra API key
- **Không xem được file:** Kiểm tra file tồn tại trong `uploads/`, thử tải lại
- **Lỗi CORS:** Đảm bảo server trả về header CORS đúng

## 8. Liên hệ & hỗ trợ

- Email: contact@docshare.vn
- Facebook: fb.com/docshare
- Issues: Tạo issue trên GitHub repo

---
**DocShare - Chia sẻ tri thức, kết nối sinh viên!**