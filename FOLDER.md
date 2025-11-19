# DocShare - Cấu trúc thư mục dự án

```
.
├── index.html                # Trang chủ
├── style.css                 # CSS chung toàn site
├── main.js                   # JS chung toàn site
├── README.MD                 # Hướng dẫn tổng thể dự án
├── add-users.js              # Script thêm user (dev tool)
├── check-user.js             # Script kiểm tra user (dev tool)
├── fix-subjects.js           # Script sửa tên môn học (dev tool)
├── fix-tailieu-columns.sql   # SQL sửa cấu trúc bảng tài liệu
├── chatbot-widget.js         # Widget chatbot nổi (floating)
├── login.html                # Trang đăng nhập
├── documents/                # Trang tài liệu (list, detail)
│   ├── list.html
│   └── detail.html
├── sinhvien/                 # Giao diện sinh viên
│   ├── home.html
│   ├── my-documents.html
│   ├── upload.html
│   └── profile.html
├── admin/                    # Giao diện quản trị viên
│   ├── dashboard.html
│   ├── users.html
│   ├── documents.html
│   └── categories.html
├── chatbotAI/                # Module chatbot AI
│   ├── chat.html             # Giao diện chat AI
│   ├── README.md             # Hướng dẫn riêng chatbot
│   └── Chatbot.html          # (Không dùng, có thể xoá)
├── controllers/              # Backend: controller cho từng module
│   ├── admin.js
│   ├── analytics.js
│   ├── auth.js
│   ├── category.js
│   ├── chatbot.js
│   ├── comment.js
│   ├── document.js
│   ├── document2.js
│   └── user.js
├── config/                   # Cấu hình kết nối DB, env
│   └── database.js
├── data/                     # Store tạm, seed data
│   └── store.js
├── database/                 # File SQL, schema, backup
│   ├── schema.sql
│   ├── storage.sql
│   ├── analytics_simple.sql
│   ├── documentsharing_analytics.sql
│   ├── documentsharing_analytics_clean.sql
│   └── create-comments-ratings.sql
├── middleware/               # Middleware cho Express
│   ├── auth.js
│   └── upload.js
├── uploads/                  # Thư mục chứa file upload
└── ... (các file khác)
```

## Ghi chú:
- **index.html**: Trang landing chính, tích hợp chatbot nổi
- **style.css**: Style chung, responsive, dùng cho toàn bộ site
- **main.js**: Xử lý JS chung (menu, toast, auth, ...)
- **admin/**: Giao diện quản trị viên (dashboard, quản lý user, tài liệu, danh mục)
- **sinhvien/**: Giao diện sinh viên (dashboard, tài liệu cá nhân, upload, profile)
- **documents/**: Trang danh sách và chi tiết tài liệu
- **chatbotAI/**: Giao diện chat AI riêng, có thể mở popup hoặc trang riêng
- **controllers/**: Code backend Node.js/Express cho từng module
- **config/**: Cấu hình DB, biến môi trường
- **database/**: File SQL, schema, backup, scripts
- **middleware/**: Middleware cho xác thực, upload file
- **uploads/**: Chứa file upload thực tế

## Phát triển thêm
- Có thể tách riêng thư mục `assets/` cho ảnh, icon, font
- Có thể tách riêng `js/`, `css/` nếu muốn chia nhỏ code front-end
- Thêm test, CI/CD, Docker tuỳ nhu cầu

---
**Tài liệu này giúp bạn nắm nhanh cấu trúc tổng thể của website DocShare.**
