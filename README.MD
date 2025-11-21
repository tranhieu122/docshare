# 📚 DocShare - Nền tảng chia sẻ tài liệu học tập

<div align="center">
  <p><strong>Kết nối sinh viên - Chia sẻ tri thức - Học tập hiệu quả</strong></p>
  <p>
    <a href="#tính-năng">Tính năng</a> •
    <a href="#cài-đặt-nhanh">Cài đặt nhanh</a> •
    <a href="#cài-đặt-thủ-công">Cài đặt thủ công</a> •
    <a href="#sử-dụng">Sử dụng</a> •
    <a href="#công-nghệ">Công nghệ</a>
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

### 🛡️ Dành cho Admin

- **Dashboard quản trị**: Thống kê tổng quan, biểu đồ phân tích.
- **Quản lý người dùng**: Phân quyền, khóa/mở khóa tài khoản.
- **Quản lý tài liệu**: Duyệt tài liệu, xóa vi phạm.
- **Quản lý hệ thống**: Cấu hình danh mục, môn học.

## 🚀 Cài đặt nhanh (Khuyên dùng cho Windows)

Chúng tôi đã chuẩn bị sẵn script tự động để bạn có thể chạy dự án chỉ với 1 click!

1. **Yêu cầu:** Đã cài đặt [Node.js](https://nodejs.org/) và [MySQL](https://www.mysql.com/) (hoặc XAMPP).
2. **Chạy:** Double-click vào file `START-SERVER.bat`.
3. **Tự động:** Script sẽ tự động cài đặt thư viện (nếu thiếu) và mở trình duyệt.

> **Lưu ý:** Bạn vẫn cần tạo database trước khi chạy (xem bước 3.2 bên dưới).

## 🛠️ Cài đặt thủ công (Mac/Linux hoặc Advanced Users)

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

- Nếu dùng XAMPP: Start **Apache** + **MySQL**.
- Hoặc start service MySQL của bạn.

#### 3.2. Tạo 3 databases

Chạy lệnh SQL sau trong phpMyAdmin hoặc MySQL Workbench:

```sql
CREATE DATABASE documentsharing_schema;
CREATE DATABASE documentsharing_storage;
CREATE DATABASE documentsharing_analytics;
```

#### 3.3. Import SQL files

Import các file từ thư mục `database/` vào database tương ứng:

1. `database/schema.sql` → `documentsharing_schema`
2. `database/storage.sql` → `documentsharing_storage`
3. `database/analytics_simple.sql` → `documentsharing_analytics`

### Bước 4: Cấu hình môi trường

Tạo file `.env` (copy từ `.env.example`) và cập nhật thông tin database của bạn.

### Bước 5: Chạy server

```bash
npm start
```

Truy cập: [http://localhost:3000](http://localhost:3000)

## 📂 Cấu trúc thư mục

```
document-sharing-platform-main/
├── 📄 server.js                  # Server chính
├── 📁 config/                    # Cấu hình database
├── 📁 controllers/               # Xử lý logic
├── 📁 routes/                    # Định tuyến API
├── 📁 database/                  # File SQL
├── 📁 uploads/                   # Thư mục lưu file
└── 📄 index.html                 # Trang chủ
```

> 📖 Xem chi tiết thiết kế hệ thống tại [DESIGN-DOCUMENT.md](./DESIGN-DOCUMENT.md)

## 💻 Công nghệ sử dụng

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **AI:** Google Gemini API (cho Chatbot)

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh! Vui lòng tạo Pull Request hoặc Issue nếu bạn tìm thấy lỗi.

---

<div align="center">
  Developed by <strong>Tran Hieu</strong>
</div>
