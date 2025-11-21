# 📚 DocShare - Nền tảng chia sẻ tài liệu học tập

<div align="center">
  <p><strong>Kết nối sinh viên - Chia sẻ tri thức - Học tập hiệu quả</strong></p>
  <p>
    <a href="#tính-năng">Tính năng</a> •
    <a href="#cài-đặt">Cài đặt</a> •
    <a href="#sử-dụng">Sử ddụng</a> •
    <a href="#công-nghệ">Công nghệ</a> •
    <a href="#đóng-góp">Đóng góp</a>
  </p>
</div>

---

## 📖 Giới thiệu

DocShare là nền tảng chia sẻ tài liệu học tập dành riêng cho sinh viên Việt Nam. Website cung cấp một không gian số để sinh viên có thể:

- 🔍 **Tìm kiếm** tài liệu học tập nhanh chóng theo môn học, danh mục
- 📤 **Chia sẻ** tài liệu của bản thân để giúp đỡ cộng đồng
- 💬 **Tương tác** thông qua bình luận, đánh giá và chatbot AI
- 📊 **Quản lý** tài liệu cá nhân và theo dõi hoạt động

## ✨ Tính năng

### 🎯 Dành cho sinh viên

- **Quản lý tài liệu**
  - Upload tài liệu (PDF, DOCX, XLSX, PPTX)
  - Xem trước và tải xuống tài liệu
  - Quản lý tài liệu đã upload
  - Lưu tài liệu yêu thích

- **Tìm kiếm & khám phá**
  - Tìm kiếm nâng cao theo từ khóa, môn học, danh mục
  - Lọc theo khoa, ngành, năm học
  - Sắp xếp theo độ phổ biến, mới nhất, rating
  - Gợi ý tài liệu liên quan

- **Tương tác cộng đồng**
  - Đánh giá tài liệu (1-5 sao)
  - Bình luận và thảo luận
  - Theo dõi tác giả
  - Báo cáo nội dung vi phạm

- **Chatbot AI thông minh**
  - Trả lời câu hỏi học tập
  - Tìm kiếm tài liệu bằng ngôn ngữ tự nhiên
  - Gợi ý tài liệu phù hợp
  - Hướng dẫn sử dụng website

### 🤖 AI AGENT (NEW!) - Tính năng đột phá

> **⚡ AI Agent tự động xử lý tài liệu - Tiết kiệm 94% thời gian!**

- **Auto-Upload & Publish** 🚀
  - Upload file → AI tự động đọc nội dung
  - AI tự đặt tên tiêu đề hấp dẫn, chuẩn SEO
  - AI tự viết mô tả chi tiết (50-200 từ)
  - AI tự xác định môn học và danh mục
  - AI tự tạo keywords và tags
  - Tự động đăng bài lên hệ thống ngay!
  - **Chỉ mất 10 giây thay vì 3 phút thủ công!**

- **RAG Search (Retrieval Augmented Generation)** 🔍
  - Hỏi AI về nội dung cụ thể trong tài liệu
  - AI đọc file và trả lời chính xác
  - Ví dụ: "Trong file này, công thức tính đạo hàm là gì?"
  - Tìm kiếm semantic trong nội dung

- **Smart Document Analysis** 🧠
  - Phân tích độ khó của tài liệu
  - Gợi ý tài liệu liên quan
  - Tự động phát hiện trùng lặp
  - Preview metadata trước khi đăng

📖 **Xem chi tiết:** [AI-AGENT.md](./AI-AGENT.md) | [AI-AGENT-SETUP.md](./AI-AGENT-SETUP.md)

### 🛡️ Dành cho Admin

- **Dashboard quản trị**
  - Thống kê tổng quan (users, documents, uploads)
  - Biểu đồ phân tích xu hướng
  - Quản lý hoạt động hệ thống

- **Quản lý người dùng**
  - Xem danh sách users
  - Phân quyền (admin/user)
  - Khóa/mở khóa tài khoản
  - Xem lịch sử hoạt động

- **Quản lý tài liệu**
  - Duyệt tài liệu mới upload
  - Xóa tài liệu vi phạm
  - Quản lý danh mục và môn học
  - Kiểm duyệt bình luận

- **Quản lý hệ thống**
  - Cấu hình danh mục, môn học, khoa
  - Backup và restore database
  - Xem logs hệ thống
  - Quản lý API keys

### 🔐 Bảo mật

- Xác thực JWT (JSON Web Token)
- Mã hóa mật khẩu với bcrypt
- Phân quyền role-based (Admin/User)
- Kiểm duyệt nội dung upload
- Rate limiting để chống spam
- Bảo vệ khỏi SQL Injection, XSS



## 🚀 Cài đặt

### Yêu cầu hệ thống

- **Node.js** >= 14.x ([Tải tại đây](https://nodejs.org/))
- **MySQL** 5.7+ (XAMPP, WAMP hoặc MySQL Server)
- **Trình duyệt** hiện đại (Chrome, Edge, Firefox)
- **Git** (để clone project)

### Bước 1: Clone project

```bash
git clone https://github.com/tranhieu122/docshare.git
cd document-sharing-platform-main
```

### Bước 2: Cài đặt dependencies

```bash
npm install
```

### Bước 3: Thiết lập Database

#### 3.1. Khởi động MySQL

- Nếu dùng XAMPP: Mở XAMPP Control Panel và start **Apache** + **MySQL**
- Truy cập phpMyAdmin: `http://localhost/phpmyadmin`

#### 3.2. Tạo 3 databases

Trong phpMyAdmin, tạo 3 database sau:

```sql
CREATE DATABASE documentsharing_schema;
CREATE DATABASE documentsharing_storage;
CREATE DATABASE documentsharing_analytics;
```

#### 3.3. Import SQL files

Import các file SQL tương ứng vào database vừa tạo:

1. `database/schema.sql` → `documentsharing_schema`
2. `database/storage.sql` → `documentsharing_storage`
3. `database/analytics_simple.sql` → `documentsharing_analytics`
4. (Tùy chọn) `database2/add-sample-data.sql` → Thêm dữ liệu mẫu

### Bước 4: Cấu hình môi trường

Tạo file `.env` trong thư mục gốc với nội dung:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_SCHEMA=documentsharing_schema
DB_STORAGE=documentsharing_storage
DB_ANALYTICS=documentsharing_analytics

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Secret
JWT_SECRET=your-super-secret-key-change-this-in-production

# Gemini AI (Optional - for Chatbot)
GEMINI_API_KEY=your-gemini-api-key-here

# Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_EXTENSIONS=.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt
```

> ⚠️ **Lưu ý:** Thay `your-super-secret-key` bằng chuỗi bí mật của bạn!

### Bước 5: Tạo thư mục uploads

```bash
# Windows (PowerShell)
New-Item -ItemType Directory -Force -Path uploads

# Linux/Mac
mkdir -p uploads
```

### Bước 6: Cài đặt AI Agent dependencies (NEW!)

```bash
npm install pdf-parse mammoth xlsx sharp
```

**Giải thích:**
- `pdf-parse` - Đọc nội dung file PDF
- `mammoth` - Đọc file Word (.docx)
- `xlsx` - Đọc file Excel
- `sharp` - Xử lý ảnh (cho OCR sau này)

📖 **Chi tiết:** Xem [AI-AGENT-SETUP.md](./AI-AGENT-SETUP.md)

### Bước 7: Chạy server

```bash
node server.js
```

Hoặc dùng nodemon để tự động restart:

```bash
npm install -g nodemon
nodemon server.js
```

### Bước 8: Truy cập website

Mở trình duyệt và truy cập:

- **Trang chủ:** [http://localhost:3000](http://localhost:3000)
- **Đăng nhập:** [http://localhost:3000/login.html](http://localhost:3000/login.html)
- **Dashboard sinh viên:** [http://localhost:3000/sinhvien/home.html](http://localhost:3000/sinhvien/home.html)
- **Dashboard admin:** [http://localhost:3000/admin/dashboard.html](http://localhost:3000/admin/dashboard.html)

### Tài khoản mẫu (nếu import sample data)

**Admin:**
- Email: `admin@docshare.vn`
- Password: `admin123`

**User:**
- Email: `user@docshare.vn`
- Password: `user123`



## 📂 Cấu trúc thư mục

```
document-sharing-platform-main/
│
├── 📄 server.js                  # Node.js Express server
├── 📄 package.json               # Dependencies & scripts
├── 📄 .env                       # Environment variables (tạo sau)
│
├── 📁 config/                    # Cấu hình
│   └── database.js               # Kết nối MySQL
│
├── 📁 controllers/               # Business logic
│   ├── auth.js                   # Xác thực (login, register)
│   ├── document.js               # Quản lý tài liệu
│   ├── document2.js              # Document helpers
│   ├── admin.js                  # Quản lý admin
│   ├── user.js                   # Quản lý user
│   ├── category.js               # Quản lý danh mục
│   ├── comment.js                # Bình luận & rating
│   ├── chatbot.js                # Chatbot AI
│   └── analytics.js              # Thống kê
│
├── 📁 routes/                    # API routing
│   ├── auth.js                   # /api/auth/*
│   ├── document.js               # /api/documents/*
│   ├── admin.js                  # /api/admin/*
│   ├── user.js                   # /api/users/*
│   ├── category.js               # /api/categories/*
│   ├── comment.js                # /api/comments/*
│   ├── chatbot.js                # /api/chatbot/*
│   └── index.js                  # Router chính
│
├── 📁 middleware/                # Middleware
│   ├── auth.js                   # JWT verification
│   └── upload.js                 # Multer file upload
│
├── 📁 database/                  # SQL schemas
│   ├── schema.sql                # Schema chính
│   ├── storage.sql               # Storage schema
│   ├── analytics_simple.sql      # Analytics schema
│   ├── chatbot.sql               # Chatbot schema
│   └── ...
│
├── 📁 database2/                 # SQL utilities
│   ├── add-sample-data.sql       # Dữ liệu mẫu
│   ├── fix-all-database.sql      # Fix scripts
│   └── ...
│
├── 📄 index.html                 # 🏠 Trang chủ
├── 📄 login.html                 # 🔐 Đăng nhập
├── 📄 register.html              # ✍️ Đăng ký
├── 📄 features.html              # ✨ Tính năng
├── 📄 about.html                 # ℹ️ Về chúng tôi
├── 📄 404.html                   # ❌ Page not found
├── 📄 style.css                  # 🎨 CSS chung
├── 📄 main.js                    # ⚙️ JavaScript chung
├── 📄 header-auth.js             # 🔑 Header authentication
├── 📄 chatbot-widget.js          # 🤖 Chatbot widget
│
├── 📁 sinhvien/                  # 👨‍🎓 Dashboard sinh viên
│   ├── home.html                 # Trang chủ SV
│   ├── upload.html               # Upload tài liệu
│   ├── my-documents.html         # Tài liệu của tôi
│   └── profile.html              # Thông tin cá nhân
│
├── 📁 documents/                 # 📚 Trang tài liệu
│   ├── detail.html               # Chi tiết tài liệu
│   └── (list.html removed)       # Moved to root
│
├── 📁 admin/                     # 🛡️ Dashboard admin
│   ├── dashboard.html            # Tổng quan
│   ├── users.html                # Quản lý users
│   ├── documents.html            # Quản lý tài liệu
│   └── categories.html           # Quản lý danh mục
│
├── 📁 chatbotAI/                 # 🤖 Chatbot pages
│   ├── chat.html                 # Chat interface
│   ├── Chatbot.html              # Chatbot config
│   └── README.md                 # Chatbot docs
│
├── 📁 uploads/                   # 📦 File storage
│   └── (user uploaded files)
│
├── 📁 data/                      # 💾 Data utilities
│   └── store.js
│
└── 📄 *.bat                      # Windows batch scripts

```

> 📖 Xem chi tiết trong [FOLDER.md](./FOLDER.md)



## 🔌 API Documentation

### Authentication APIs

#### Đăng ký
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "nguyen_van_a",
  "email": "nguyenvana@gmail.com",
  "password": "securepassword123",
  "fullName": "Nguyễn Văn A"
}
```

#### Đăng nhập
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "nguyenvana@gmail.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "nguyen_van_a",
    "email": "nguyenvana@gmail.com",
    "role": "user"
  }
}
```

### Document APIs

#### Lấy danh sách tài liệu
```http
GET /api/documents?page=1&limit=10&search=toan&category=1
Authorization: Bearer {token}
```

#### Upload tài liệu
```http
POST /api/documents
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "file": <binary>,
  "title": "Giáo trình Toán cao cấp",
  "description": "Giáo trình đầy đủ cho sinh viên năm 1",
  "subjectId": 5,
  "categoryId": 2
}
```

#### Xem tài liệu
```http
GET /api/documents/:id/view
Authorization: Bearer {token}
```

#### Chi tiết tài liệu
```http
GET /api/documents/:id
Authorization: Bearer {token}
```

#### Xóa tài liệu
```http
DELETE /api/documents/:id
Authorization: Bearer {token}
```

### Comment & Rating APIs

#### Thêm bình luận
```http
POST /api/comments
Authorization: Bearer {token}
Content-Type: application/json

{
  "documentId": 5,
  "content": "Tài liệu rất hữu ích!"
}
```

#### Đánh giá tài liệu
```http
POST /api/comments/rate
Authorization: Bearer {token}
Content-Type: application/json

{
  "documentId": 5,
  "rating": 5
}
```

### Chatbot APIs

#### Lấy context chatbot
```http
GET /api/chatbot/context
Authorization: Bearer {token}
```

#### Chat với AI
```http
POST /api/chatbot/chat
Authorization: Bearer {token}
Content-Type: application/json

{
  "message": "Tìm giúp tôi tài liệu về Toán rời rạc"
}
```

### Admin APIs

#### Dashboard thống kê
```http
GET /api/admin/dashboard
Authorization: Bearer {admin-token}
```

#### Quản lý users
```http
GET /api/admin/users
Authorization: Bearer {admin-token}
```

#### Duyệt tài liệu
```http
PUT /api/admin/documents/:id/approve
Authorization: Bearer {admin-token}
```

### AI Agent APIs (NEW!)

#### Auto-upload và publish tài liệu
```http
POST /api/chatbot/auto-upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

Body: file=<binary>
```

**Response:**
```json
{
  "success": true,
  "message": "🎉 Đã tự động phân tích và đăng tài liệu thành công!",
  "data": {
    "documentId": 123,
    "title": "Giáo trình Lập trình Web với Node.js",
    "description": "Tài liệu hướng dẫn chi tiết...",
    "subject": "Lập trình Web",
    "category": "Giáo trình",
    "keywords": ["nodejs", "javascript", "web"],
    "url": "/documents/detail.html?id=123"
  }
}
```

#### RAG Search - Hỏi đáp dựa trên nội dung tài liệu
```http
POST /api/chatbot/rag-search
Authorization: Bearer {token}
Content-Type: application/json

{
  "documentId": 123,
  "question": "Trong file này, thuật toán QuickSort hoạt động như thế nào?"
}
```

#### Phân tích file (Preview)
```http
POST /api/chatbot/analyze-file
Authorization: Bearer {token}
Content-Type: multipart/form-data

Body: file=<binary>
```



## 💻 Công nghệ sử dụng

### Frontend
- **HTML5, CSS3, JavaScript (Vanilla)**
- **Responsive Design** - Tối ưu mọi thiết bị
- **Font Awesome** - Icons
- **Google Fonts** - Typography
- **Chart.js** - Biểu đồ thống kê

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Multer** - File upload
- **CORS** - Cross-origin resource sharing

### AI & Machine Learning 🤖
- **Google Gemini AI** (`gemini-1.5-flash`) - AI Agent brain
- **pdf-parse** - PDF content extraction
- **mammoth** - Word document parsing
- **xlsx** - Excel spreadsheet processing
- **NLP** - Natural Language Processing
- **RAG** - Retrieval Augmented Generation
- **Prompt Engineering** - Optimized AI prompts

### Database
- **MySQL** - Relational database
- **3 databases:**
  - `documentsharing_schema` - User, documents, categories
  - `documentsharing_storage` - File metadata
  - `documentsharing_analytics` - Analytics data

### AI Integration
- **Google Gemini AI** - Chatbot intelligence
- **Natural Language Processing** - Hiểu câu hỏi người dùng
- **Context-aware responses** - Trả lời dựa trên context

### DevOps
- **Git & GitHub** - Version control
- **npm** - Package management
- **nodemon** - Development auto-reload

## 🎯 Sử dụng

### Cho sinh viên

1. **Đăng ký tài khoản** tại `/register.html`
2. **Đăng nhập** tại `/login.html`
3. **Khám phá tài liệu** tại `/documents/list.html` hoặc trang chủ
4. **Upload tài liệu** tại `/sinhvien/upload.html`
5. **Quản lý tài liệu** của bạn tại `/sinhvien/my-documents.html`
6. **Chat với AI** bằng widget chatbot góc dưới phải

### Cho admin

1. **Đăng nhập với tài khoản admin**
2. Truy cập **Dashboard** tại `/admin/dashboard.html`
3. **Quản lý users** tại `/admin/users.html`
4. **Duyệt tài liệu** tại `/admin/documents.html`
5. **Quản lý categories** tại `/admin/categories.html`

## 🤝 Đóng góp

Chúng tôi rất hoan nghênh mọi đóng góp! Hãy làm theo các bước sau:

### Quy trình đóng góp

1. **Fork repository** này
2. **Clone** về máy local:
   ```bash
   git clone https://github.com/your-username/docshare.git
   ```
3. **Tạo branch mới** cho tính năng/bugfix:
   ```bash
   git checkout -b feature/ten-tinh-nang
   ```
4. **Commit** thay đổi với message rõ ràng:
   ```bash
   git commit -m "feat: thêm chức năng tìm kiếm nâng cao"
   ```
5. **Push** lên GitHub:
   ```bash
   git push origin feature/ten-tinh-nang
   ```
6. **Tạo Pull Request** trên GitHub

### Coding conventions

- Sử dụng **camelCase** cho biến JavaScript
- Sử dụng **PascalCase** cho class
- Comment rõ ràng cho logic phức tạp
- Tuân thủ cấu trúc thư mục hiện tại
- Test kỹ trước khi commit

### Commit message format

```
<type>: <description>

[optional body]
[optional footer]
```

**Types:**
- `feat`: Tính năng mới
- `fix`: Sửa bug
- `docs`: Cập nhật documentation
- `style`: Thay đổi CSS/UI
- `refactor`: Refactor code
- `test`: Thêm/sửa tests
- `chore`: Cập nhật build, dependencies

**Ví dụ:**
```
feat: thêm chức năng lọc tài liệu theo năm học

- Thêm dropdown chọn năm học
- Cập nhật API filter
- Thêm unit tests
```



## ❓ Troubleshooting & FAQ

### Lỗi thường gặp

#### 🔴 Không kết nối được Database

**Triệu chứng:**
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Giải pháp:**
1. Kiểm tra MySQL đã chạy chưa (XAMPP Control Panel)
2. Xác nhận thông tin trong `.env` đúng:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   ```
3. Kiểm tra 3 databases đã tạo chưa
4. Test connection: `mysql -u root -p`

#### 🔴 Không upload được file

**Triệu chứng:**
- Upload button không hoạt động
- Báo lỗi "File too large"
- Báo lỗi "Invalid file type"

**Giải pháp:**
1. Kiểm tra thư mục `uploads/` đã tồn tại
2. Kiểm tra quyền write cho thư mục (Windows: Read-only off)
3. Kiểm tra dung lượng file (max 10MB mặc định)
4. Kiểm tra extension được phép:
   ```env
   ALLOWED_EXTENSIONS=.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx
   ```
5. Xem console log để debug:
   ```javascript
   console.log('File size:', file.size);
   console.log('File type:', file.type);
   ```

#### 🔴 Chatbot không hoạt động

**Triệu chứng:**
- Chatbot báo lỗi 503
- Response rất chậm
- Không trả lời được

**Giải pháp:**
1. Kiểm tra `GEMINI_API_KEY` trong `.env`
2. Verify API key tại [Google AI Studio](https://makersuite.google.com/app/apikey)
3. Kiểm tra quota API (có thể bị limit)
4. Google Gemini API đang quá tải → thử lại sau
5. Check network: `curl https://generativelanguage.googleapis.com/v1/models`

#### 🔴 Không xem được file PDF/DOCX

**Triệu chứng:**
- Click vào tài liệu không mở được
- Báo lỗi 404 Not Found
- Download file bị lỗi

**Giải pháp:**
1. Kiểm tra file có tồn tại trong `uploads/`:
   ```bash
   ls uploads/
   ```
2. Kiểm tra đường dẫn trong database:
   ```sql
   SELECT file_path FROM documents WHERE id = X;
   ```
3. Xem route `/api/documents/:id/view` đã config chưa
4. Check MIME type trong controller:
   ```javascript
   res.setHeader('Content-Type', 'application/pdf');
   ```

#### 🔴 Lỗi CORS

**Triệu chứng:**
```
Access to fetch at 'http://localhost:3000/api/...' from origin 'null' has been blocked by CORS policy
```

**Giải pháp:**
1. Đảm bảo server có CORS middleware:
   ```javascript
   app.use(cors());
   ```
2. Không mở file HTML trực tiếp (`file://`), phải qua server (`http://localhost:3000`)
3. Nếu dùng custom domain, config CORS origin:
   ```javascript
   app.use(cors({ origin: 'http://yourdomain.com' }));
   ```

#### 🔴 JWT Token expired

**Triệu chứng:**
- Đăng nhập lại liên tục
- Báo lỗi "Token expired"

**Giải pháp:**
1. Xóa localStorage và login lại:
   ```javascript
   localStorage.clear();
   ```
2. Tăng thời gian expiry trong `controllers/auth.js`:
   ```javascript
   jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
   ```

### FAQ

**Q: Làm sao để thêm admin mới?**  
A: Vào database → bảng `users` → sửa cột `role` thành `'admin'`

**Q: Có thể deploy lên hosting không?**  
A: Có! Deploy lên Heroku, Railway, Render, hoặc VPS. Cần config `.env` cho production.

**Q: Hỗ trợ ngôn ngữ khác ngoài tiếng Việt?**  
A: Hiện tại chỉ hỗ trợ tiếng Việt. Có thể thêm i18n nếu cần.

**Q: Có mobile app không?**  
A: Chưa có. Hiện tại là responsive web app.

**Q: Làm sao để backup database?**  
A: Export từ phpMyAdmin hoặc dùng lệnh:
```bash
mysqldump -u root -p documentsharing_schema > backup.sql
```

**Q: Chatbot có học được từ cuộc hội thoại không?**  
A: Hiện tại chưa. Gemini API không lưu lịch sử giữa các session.

## 📸 Screenshots

### Trang chủ
![Homepage](https://via.placeholder.com/800x400?text=DocShare+Homepage)

### Dashboard sinh viên
![Student Dashboard](https://via.placeholder.com/800x400?text=Student+Dashboard)

### Upload tài liệu
![Upload Document](https://via.placeholder.com/800x400?text=Upload+Document)

### Chatbot AI
![Chatbot](https://via.placeholder.com/800x400?text=AI+Chatbot)

## 🗺️ Roadmap

### Version 2.0 (Q1 2026)
- [ ] Mobile app (React Native)
- [ ] Real-time notifications
- [ ] Advanced search với AI
- [ ] Social features (follow users, newsfeed)
- [ ] Gamification (badges, points, leaderboard)

### Version 2.5 (Q2 2026)
- [ ] Video tutorials
- [ ] Live chat between users
- [ ] Document collaboration (Google Docs style)
- [ ] API public cho developers
- [ ] Premium features

### Version 3.0 (Q3 2026)
- [ ] Machine learning recommendations
- [ ] Auto-tagging documents với AI
- [ ] OCR cho scan documents
- [ ] Multi-language support
- [ ] White-label solution cho các trường

## 📄 License

MIT License

Copyright (c) 2025 DocShare Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## 👥 Team

- **Trần Hiếu** - [@tranhieu122](https://github.com/tranhieu122) - Founder & Lead Developer
- **Contributors** - Xem danh sách đầy đủ tại [Contributors](https://github.com/tranhieu122/docshare/graphs/contributors)

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/) - Web framework
- [Google Gemini AI](https://ai.google.dev/) - AI chatbot
- [Font Awesome](https://fontawesome.com/) - Icons
- [Chart.js](https://www.chartjs.org/) - Charts
- Cộng đồng sinh viên Việt Nam đã đóng góp ý tưởng

## 📞 Liên hệ & Hỗ trợ

- 🌐 **Website:** [https://docshare.vn](https://docshare.vn)
- 📧 **Email:** contact@docshare.vn
- 💬 **Facebook:** [fb.com/docshare](https://fb.com/docshare)
- 🐛 **Issues:** [GitHub Issues](https://github.com/tranhieu122/docshare/issues)
- 💡 **Feature Requests:** [GitHub Discussions](https://github.com/tranhieu122/docshare/discussions)

---

<div align="center">
  <strong>⭐ Nếu thấy project hữu ích, hãy cho chúng tôi 1 star nhé! ⭐</strong>
  <br><br>
  <strong>📚 DocShare - Chia sẻ tri thức, kết nối sinh viên! 🎓</strong>
  <br>
  <sub>Made with ❤️ by DocShare Team</sub>
</div>
