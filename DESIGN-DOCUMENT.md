# THIẾT KẾ CHI TIẾT HỆ THỐNG DOCSHARE
## Design Document - Sequence Diagrams & State Diagrams

---

## 1. KIẾN TRÚC HỆ THỐNG

### 1.1. Mô hình tổng quan
- **Pattern**: MVC + RESTful API
- **Frontend**: HTML/CSS/JavaScript (Client-Side Rendering)
- **Backend**: Node.js + Express.js (REST API)
- **Database**: MySQL (3 databases: Schema, Storage, Analytics)

### 1.2. Cấu trúc layers
```
┌─────────────────────────────────────┐
│         VIEW LAYER (HTML)           │  ← Giao diện người dùng
├─────────────────────────────────────┤
│      CONTROLLER LAYER (JS)          │  ← Xử lý logic nghiệp vụ
├─────────────────────────────────────┤
│       MODEL LAYER (Database)        │  ← Dữ liệu và truy vấn
└─────────────────────────────────────┘
```

---

## 2. BIỂU ĐỒ TUẦN TỰ (SEQUENCE DIAGRAMS)

### 2.1. UC01: Đăng ký tài khoản

```
┌──────┐         ┌──────────┐       ┌─────────────┐       ┌──────────┐       ┌──────────┐
│Client│         │RegisterUI│       │AuthController│      │UserModel │       │Database  │
└──┬───┘         └────┬─────┘       └──────┬──────┘       └────┬─────┘       └────┬─────┘
   │                  │                     │                   │                  │
   │ 1. Open register.html                 │                   │                  │
   ├─────────────────>│                     │                   │                  │
   │                  │                     │                   │                  │
   │ 2. Fill form & Submit                 │                   │                  │
   ├─────────────────>│                     │                   │                  │
   │                  │                     │                   │                  │
   │                  │ 3. POST /api/auth/register             │                  │
   │                  ├────────────────────>│                   │                  │
   │                  │                     │                   │                  │
   │                  │                     │ 4. Validate data  │                  │
   │                  │                     ├──────────┐        │                  │
   │                  │                     │          │        │                  │
   │                  │                     │<─────────┘        │                  │
   │                  │                     │                   │                  │
   │                  │                     │ 5. Hash password  │                  │
   │                  │                     ├──────────┐        │                  │
   │                  │                     │          │        │                  │
   │                  │                     │<─────────┘        │                  │
   │                  │                     │                   │                  │
   │                  │                     │ 6. create(userData)                  │
   │                  │                     ├──────────────────>│                  │
   │                  │                     │                   │                  │
   │                  │                     │                   │ 7. INSERT INTO NguoiDung
   │                  │                     │                   ├─────────────────>│
   │                  │                     │                   │                  │
   │                  │                     │                   │ 8. user_id      │
   │                  │                     │                   │<─────────────────┤
   │                  │                     │                   │                  │
   │                  │                     │ 9. userObject     │                  │
   │                  │                     │<──────────────────┤                  │
   │                  │                     │                   │                  │
   │                  │ 10. {success, token}│                  │                  │
   │                  │<────────────────────┤                   │                  │
   │                  │                     │                   │                  │
   │ 11. Redirect to login.html            │                   │                  │
   │<─────────────────┤                     │                   │                  │
   │                  │                     │                   │                  │
```

**Mô tả chi tiết:**
- **Boundary**: `register.html` (View)
- **Controller**: `controllers/auth.js` → `exports.register`
- **Entity**: `NguoiDung` table in MySQL
- **Flow**:
  1. Client mở trang đăng ký
  2. Nhập thông tin (email, password, tên, khoa)
  3. Submit form → POST request
  4. Controller validate dữ liệu
  5. Hash mật khẩu với bcrypt
  6. Lưu vào database
  7. Trả về token JWT
  8. Redirect về login

---

### 2.2. UC02: Đăng nhập

```
┌──────┐         ┌─────────┐       ┌─────────────┐       ┌──────────┐       ┌──────────┐
│Client│         │LoginUI  │       │AuthController│      │UserModel │       │Database  │
└──┬───┘         └────┬────┘       └──────┬──────┘       └────┬─────┘       └────┬─────┘
   │                  │                    │                   │                  │
   │ 1. Open login.html                   │                   │                  │
   ├─────────────────>│                    │                   │                  │
   │                  │                    │                   │                  │
   │ 2. Enter credentials & Submit        │                   │                  │
   ├─────────────────>│                    │                   │                  │
   │                  │                    │                   │                  │
   │                  │ 3. POST /api/auth/login               │                  │
   │                  ├───────────────────>│                   │                  │
   │                  │                    │                   │                  │
   │                  │                    │ 4. findByEmail(email)               │
   │                  │                    ├──────────────────>│                  │
   │                  │                    │                   │                  │
   │                  │                    │                   │ 5. SELECT * FROM NguoiDung
   │                  │                    │                   ├─────────────────>│
   │                  │                    │                   │                  │
   │                  │                    │                   │ 6. userRecord   │
   │                  │                    │                   │<─────────────────┤
   │                  │                    │                   │                  │
   │                  │                    │ 7. userObject     │                  │
   │                  │                    │<──────────────────┤                  │
   │                  │                    │                   │                  │
   │                  │                    │ 8. Compare password                  │
   │                  │                    ├──────────┐        │                  │
   │                  │                    │          │        │                  │
   │                  │                    │<─────────┘        │                  │
   │                  │                    │                   │                  │
   │                  │                    │ 9. Generate JWT token               │
   │                  │                    ├──────────┐        │                  │
   │                  │                    │          │        │                  │
   │                  │                    │<─────────┘        │                  │
   │                  │                    │                   │                  │
   │                  │ 10. {token, user}  │                   │                  │
   │                  │<───────────────────┤                   │                  │
   │                  │                    │                   │                  │
   │ 11. Store token in localStorage       │                   │                  │
   │<─────────────────┤                    │                   │                  │
   │                  │                    │                   │                  │
   │ 12. Redirect to home.html             │                   │                  │
   │<─────────────────┤                    │                   │                  │
```

**Routes**: `POST /api/auth/login`
**Middleware**: None (public endpoint)
**Response**: `{ token, user: { id, email, ho_ten, chuc_vu } }`

---

### 2.3. UC03: Tìm kiếm tài liệu

```
┌──────┐      ┌──────────┐     ┌────────────────┐     ┌──────────────┐     ┌─────────┐
│Client│      │SearchUI  │     │DocumentController│    │DocumentModel │     │Database │
└──┬───┘      └────┬─────┘     └────────┬───────┘     └──────┬───────┘     └────┬────┘
   │               │                     │                    │                  │
   │ 1. Enter search keyword             │                    │                  │
   ├──────────────>│                     │                    │                  │
   │               │                     │                    │                  │
   │               │ 2. GET /api/documents/search?q=database │                  │
   │               ├────────────────────>│                    │                  │
   │               │                     │                    │                  │
   │               │                     │ 3. Parse & sanitize query             │
   │               │                     ├──────────┐         │                  │
   │               │                     │          │         │                  │
   │               │                     │<─────────┘         │                  │
   │               │                     │                    │                  │
   │               │                     │ 4. search(keyword, filters)           │
   │               │                     ├───────────────────>│                  │
   │               │                     │                    │                  │
   │               │                     │                    │ 5. SELECT tl.*, mh.ten_mon_hoc
   │               │                     │                    ├─────────────────>│
   │               │                     │                    │    FROM TaiLieu tl
   │               │                     │                    │    JOIN MonHoc mh
   │               │                     │                    │    WHERE tieu_de LIKE '%keyword%'
   │               │                     │                    │                  │
   │               │                     │                    │ 6. documents[]  │
   │               │                     │                    │<─────────────────┤
   │               │                     │                    │                  │
   │               │                     │ 7. documents[]     │                  │
   │               │                     │<───────────────────┤                  │
   │               │                     │                    │                  │
   │               │                     │ 8. Format response │                  │
   │               │                     ├──────────┐         │                  │
   │               │                     │          │         │                  │
   │               │                     │<─────────┘         │                  │
   │               │                     │                    │                  │
   │               │ 9. {documents, total, page}             │                  │
   │               │<────────────────────┤                    │                  │
   │               │                     │                    │                  │
   │ 10. Render results                  │                    │                  │
   │<──────────────┤                     │                    │                  │
   │               │                     │                    │                  │
```

**Key Components:**
- **Boundary**: `documents/list.html`
- **Controller**: `controllers/document.js` → `exports.search`
- **Entity**: `TaiLieu`, `MonHoc`, `DanhMuc`
- **Filters**: Môn học, danh mục, sắp xếp theo lượt xem/tải

---

### 2.4. UC04: Upload tài liệu

```
┌──────┐      ┌─────────┐    ┌──────────┐    ┌────────────────┐    ┌─────────────┐    ┌─────────┐
│Client│      │UploadUI │    │Middleware│    │DocumentController│   │DocumentModel│    │Database │
└──┬───┘      └────┬────┘    └────┬─────┘    └────────┬───────┘    └──────┬──────┘    └────┬────┘
   │               │              │                    │                   │                │
   │ 1. Open upload.html          │                    │                   │                │
   ├──────────────>│              │                    │                   │                │
   │               │              │                    │                   │                │
   │ 2. Select file & fill form   │                    │                   │                │
   ├──────────────>│              │                    │                   │                │
   │               │              │                    │                   │                │
   │               │ 3. POST /api/documents/upload (multipart/form-data)  │                │
   │               ├─────────────>│                    │                   │                │
   │               │              │                    │                   │                │
   │               │              │ 4. authenticate()  │                   │                │
   │               │              ├──────────┐         │                   │                │
   │               │              │          │         │                   │                │
   │               │              │<─────────┘         │                   │                │
   │               │              │                    │                   │                │
   │               │              │ 5. Verify JWT token│                   │                │
   │               │              ├──────────┐         │                   │                │
   │               │              │          │         │                   │                │
   │               │              │<─────────┘         │                   │                │
   │               │              │                    │                   │                │
   │               │              │ 6. multer.single('file')               │                │
   │               │              ├──────────┐         │                   │                │
   │               │              │ Save to /uploads   │                   │                │
   │               │              │<─────────┘         │                   │                │
   │               │              │                    │                   │                │
   │               │              │ 7. req.file ────────>│                 │                │
   │               │              │                    │                   │                │
   │               │              │                    │ 8. Validate metadata               │
   │               │              │                    ├──────────┐        │                │
   │               │              │                    │          │        │                │
   │               │              │                    │<─────────┘        │                │
   │               │              │                    │                   │                │
   │               │              │                    │ 9. create(docData)                 │
   │               │              │                    ├──────────────────>│                │
   │               │              │                    │                   │                │
   │               │              │                    │                   │ 10. INSERT INTO TaiLieu
   │               │              │                    │                   ├───────────────>│
   │               │              │                    │                   │                │
   │               │              │                    │                   │ 11. document_id│
   │               │              │                    │                   │<───────────────┤
   │               │              │                    │                   │                │
   │               │              │                    │ 12. document obj  │                │
   │               │              │                    │<──────────────────┤                │
   │               │              │                    │                   │                │
   │               │              │  13. {success, document}               │                │
   │               │<─────────────┴────────────────────┤                   │                │
   │               │              │                    │                   │                │
   │ 14. Show success & redirect  │                    │                   │                │
   │<──────────────┤              │                    │                   │                │
```

**Middleware Stack:**
1. `authMiddleware.authenticate` - Xác thực JWT
2. `upload.single('file')` - Xử lý file upload (multer)
3. `documentController.upload` - Logic upload

---

### 2.5. UC05: Chat với Chatbot

```
┌──────┐       ┌──────────┐      ┌─────────────────┐      ┌──────────────┐      ┌─────────┐
│Client│       │ChatbotUI │      │ChatbotController│      │DocumentModel │      │Database │
└──┬───┘       └────┬─────┘      └────────┬────────┘      └──────┬───────┘      └────┬────┘
   │                │                      │                      │                   │
   │ 1. Open chatbot widget                │                      │                   │
   ├───────────────>│                      │                      │                   │
   │                │                      │                      │                   │
   │ 2. Type message: "tìm tài liệu database"                     │                   │
   ├───────────────>│                      │                      │                   │
   │                │                      │                      │                   │
   │                │ 3. POST /api/chatbot/chat {message}         │                   │
   │                ├─────────────────────>│                      │                   │
   │                │                      │                      │                   │
   │                │                      │ 4. detectIntent(message)                 │
   │                │                      ├──────────┐           │                   │
   │                │                      │ Result: "search"     │                   │
   │                │                      │<─────────┘           │                   │
   │                │                      │                      │                   │
   │                │                      │ 5. searchDocumentsInDB(keywords)         │
   │                │                      ├─────────────────────>│                   │
   │                │                      │                      │                   │
   │                │                      │                      │ 6. SELECT * WHERE LIKE
   │                │                      │                      ├──────────────────>│
   │                │                      │                      │                   │
   │                │                      │                      │ 7. documents[]   │
   │                │                      │                      │<──────────────────┤
   │                │                      │                      │                   │
   │                │                      │ 8. documents[]       │                   │
   │                │                      │<─────────────────────┤                   │
   │                │                      │                      │                   │
   │                │                      │ 9. getResponse(intent)                   │
   │                │                      ├──────────┐           │                   │
   │                │                      │ Format message       │                   │
   │                │                      │<─────────┘           │                   │
   │                │                      │                      │                   │
   │                │                      │ 10. Save to ChatbotConversations         │
   │                │                      ├─────────────────────────────────────────>│
   │                │                      │                      │                   │
   │                │ 11. {message, intent, documents}            │                   │
   │                │<─────────────────────┤                      │                   │
   │                │                      │                      │                   │
   │ 12. Display bot response              │                      │                   │
   │<───────────────┤                      │                      │                   │
```

**Logic:**
- **Rule-based**: Không dùng AI
- **Intent Detection**: Keyword matching
- **Response Generation**: Template-based từ KNOWLEDGE_BASE
- **Database Search**: Tự động search khi detect intent = "search"

---

### 2.6. UC06: Đánh giá tài liệu

```
┌──────┐      ┌──────────┐     ┌────────────────┐     ┌────────────┐     ┌─────────┐
│Client│      │DetailUI  │     │CommentController│    │CommentModel│     │Database │
└──┬───┘      └────┬─────┘     └────────┬───────┘     └─────┬──────┘     └────┬────┘
   │               │                     │                   │                 │
   │ 1. View document detail             │                   │                 │
   ├──────────────>│                     │                   │                 │
   │               │                     │                   │                 │
   │ 2. Select rating (1-5 stars) & comment                  │                 │
   ├──────────────>│                     │                   │                 │
   │               │                     │                   │                 │
   │               │ 3. POST /api/comments {doc_id, rating, comment}           │
   │               ├────────────────────>│                   │                 │
   │               │                     │                   │                 │
   │               │                     │ 4. Authenticate & get user_id       │
   │               │                     ├──────────┐        │                 │
   │               │                     │          │        │                 │
   │               │                     │<─────────┘        │                 │
   │               │                     │                   │                 │
   │               │                     │ 5. create({doc_id, user_id, rating, comment})
   │               │                     ├──────────────────>│                 │
   │               │                     │                   │                 │
   │               │                     │                   │ 6. BEGIN TRANSACTION
   │               │                     │                   ├────────────────>│
   │               │                     │                   │                 │
   │               │                     │                   │ 7. INSERT INTO BinhLuan
   │               │                     │                   ├────────────────>│
   │               │                     │                   │                 │
   │               │                     │                   │ 8. UPDATE TaiLieu
   │               │                     │                   ├────────────────>│
   │               │                     │                   │    SET tong_danh_gia
   │               │                     │                   │                 │
   │               │                     │                   │ 9. COMMIT      │
   │               │                     │                   ├────────────────>│
   │               │                     │                   │                 │
   │               │                     │                   │ 10. comment_id │
   │               │                     │                   │<────────────────┤
   │               │                     │                   │                 │
   │               │                     │ 11. comment obj   │                 │
   │               │                     │<──────────────────┤                 │
   │               │                     │                   │                 │
   │               │ 12. {success, comment, avgRating}       │                 │
   │               │<────────────────────┤                   │                 │
   │               │                     │                   │                 │
   │ 13. Update UI with new rating       │                   │                 │
   │<──────────────┤                     │                   │                 │
```

---

## 3. BIỂU ĐỒ TRẠNG THÁI (STATE DIAGRAMS)

### 3.1. Trạng thái Người dùng (NguoiDung)

```
                    ┌─────────────┐
                    │  [Initial]  │
                    └──────┬──────┘
                           │
                           │ register()
                           ▼
                    ┌─────────────┐
              ┌────>│ Registered  │
              │     └──────┬──────┘
              │            │
              │            │ verify_email()
              │            ▼
              │     ┌─────────────┐
              │     │   Active    │<─────┐
              │     └──────┬──────┘      │
              │            │              │
              │            │ login()      │ logout()
              │            ▼              │
              │     ┌─────────────┐      │
              │     │ Logged In   │──────┘
              │     └──────┬──────┘
              │            │
              │            │ violate_policy()
              │            ▼
              │     ┌─────────────┐
              │     │  Suspended  │
              │     └──────┬──────┘
              │            │
              │            │ appeal_success()
              │            │
              └────────────┘
              
                           │ delete_account()
                           ▼
                    ┌─────────────┐
                    │   Deleted   │
                    └─────────────┘
```

**Các trạng thái:**
1. **Registered**: Vừa đăng ký, chưa verify email
2. **Active**: Đã kích hoạt, có thể login
3. **Logged In**: Đang đăng nhập, có JWT token
4. **Suspended**: Bị khóa tài khoản (vi phạm)
5. **Deleted**: Đã xóa tài khoản

**Thuộc tính trạng thái trong DB:**
- `trang_thai` ENUM('active', 'suspended', 'deleted')
- `ngay_tao` TIMESTAMP
- `lan_dang_nhap_cuoi` TIMESTAMP

---

### 3.2. Trạng thái Tài liệu (TaiLieu)

```
                    ┌─────────────┐
                    │   [Start]   │
                    └──────┬──────┘
                           │
                           │ upload()
                           ▼
                    ┌─────────────┐
                    │  Uploaded   │
                    └──────┬──────┘
                           │
                           │ auto_publish() or admin_review()
                           ▼
                    ┌─────────────┐
              ┌────>│  Published  │────┐
              │     └──────┬──────┘    │
              │            │            │
              │            │ view()     │ edit()
              │            ▼            │
              │     ┌─────────────┐    │
              │     │   Viewing   │    │
              │     └──────┬──────┘    │
              │            │            │
              │            │ download() │
              │            ▼            │
              │     ┌─────────────┐    │
              │     │ Downloaded  │────┘
              │     └─────────────┘
              │
              │            │ report_violation()
              │            ▼
              │     ┌─────────────┐
              │     │   Flagged   │
              │     └──────┬──────┘
              │            │
              │            │ admin_approve()
              └────────────┘
              
                           │ admin_reject() or delete()
                           ▼
                    ┌─────────────┐
                    │   Removed   │
                    └─────────────┘
```

**Các trạng thái:**
1. **Uploaded**: Vừa upload, chưa được duyệt
2. **Published**: Đã duyệt, hiển thị công khai
3. **Viewing**: Đang được xem
4. **Downloaded**: Đang được tải về
5. **Flagged**: Bị báo cáo vi phạm
6. **Removed**: Đã gỡ bỏ

**Metrics tracking:**
- `so_luot_xem` INT (tăng khi view)
- `so_luot_tai` INT (tăng khi download)
- `ngay_tai` TIMESTAMP (thời gian upload)

---

### 3.3. Trạng thái Phiên chat (ChatSession)

```
                    ┌─────────────┐
                    │   [Start]   │
                    └──────┬──────┘
                           │
                           │ open_chatbot()
                           ▼
                    ┌─────────────┐
                    │  Connected  │
                    └──────┬──────┘
                           │
                           │ send_message()
                           ▼
                    ┌─────────────┐
              ┌────>│   Active    │<────┐
              │     └──────┬──────┘     │
              │            │             │
              │            │ receive_response()
              │            ▼             │
              │     ┌─────────────┐     │
              │     │ Processing  │─────┘
              │     └──────┬──────┘
              │            │
              │            │ idle > 5 min
              │            ▼
              │     ┌─────────────┐
              │     │    Idle     │
              │     └──────┬──────┘
              │            │
              │            │ new_message()
              └────────────┘
              
                           │ close_chatbot()
                           ▼
                    ┌─────────────┐
                    │   Closed    │
                    └─────────────┘
```

**Session management:**
- `session_id`: Unique identifier
- `created_at`: Thời gian bắt đầu
- `last_activity`: Thời gian hoạt động cuối
- Auto-close sau 30 phút idle

---

### 3.4. Trạng thái File Upload

```
                    ┌─────────────┐
                    │  [Initial]  │
                    └──────┬──────┘
                           │
                           │ select_file()
                           ▼
                    ┌─────────────┐
                    │  Selected   │
                    └──────┬──────┘
                           │
                           │ validate()
                           ▼
                    ┌─────────────┐
                    │ Validating  │───── invalid ────┐
                    └──────┬──────┘                  │
                           │                         │
                           │ valid                   │
                           ▼                         │
                    ┌─────────────┐                  │
                    │ Uploading   │                  │
                    └──────┬──────┘                  │
                           │                         │
                           │ progress updates        │
                           ▼                         ▼
                    ┌─────────────┐          ┌─────────────┐
                    │  Uploaded   │          │   Failed    │
                    └──────┬──────┘          └─────────────┘
                           │
                           │ save_metadata()
                           ▼
                    ┌─────────────┐
                    │  Completed  │
                    └─────────────┘
```

**Validation rules:**
- Max file size: 10MB
- Allowed types: PDF, Word, Excel, PowerPoint
- Virus scan (optional)

---

## 4. MÔ TẢ CHI TIẾT CÁC LỚP

### 4.1. Controllers Layer

#### AuthController (`controllers/auth.js`)
```javascript
class AuthController {
    // Trạng thái: Stateless (không lưu state)
    
    methods:
    + register(req, res)      // UC01: Đăng ký
    + login(req, res)         // UC02: Đăng nhập
    + logout(req, res)        // Đăng xuất
    + verifyToken(req, res)   // Xác thực token
    + refreshToken(req, res)  // Làm mới token
    
    dependencies:
    - bcrypt (hash password)
    - jsonwebtoken (JWT)
    - UserModel
}
```

#### DocumentController (`controllers/document.js`)
```javascript
class DocumentController {
    methods:
    + upload(req, res)        // UC04: Upload tài liệu
    + search(req, res)        // UC03: Tìm kiếm
    + getById(req, res)       // Xem chi tiết
    + update(req, res)        // Cập nhật metadata
    + delete(req, res)        // Xóa tài liệu
    + download(req, res)      // Tải về
    + incrementView(id)       // Tăng lượt xem
    
    state:
    - uploadProgress: Map<fileId, percentage>
    
    dependencies:
    - DocumentModel
    - multer (file upload)
    - fs (file system)
}
```

#### ChatbotController (`controllers/chatbot.js`)
```javascript
class ChatbotController {
    state:
    - KNOWLEDGE_BASE: Object   // Rule-based responses
    - activeSessions: Map      // Session tracking
    
    methods:
    + chat(req, res)          // UC05: Chat
    + detectIntent(message)   // Phân tích intent
    + getResponse(intent)     // Tạo response
    + searchDocuments(query)  // Tìm tài liệu
    + getHistory(req, res)    // Lịch sử chat
    
    dependencies:
    - DocumentModel
    - AnalyticsModel
}
```

#### CommentController (`controllers/comment.js`)
```javascript
class CommentController {
    methods:
    + create(req, res)        // UC06: Thêm bình luận
    + getByDocument(req, res) // Lấy comments của tài liệu
    + update(req, res)        // Sửa comment
    + delete(req, res)        // Xóa comment
    + rate(req, res)          // Đánh giá (rating)
    
    dependencies:
    - CommentModel
    - DocumentModel (update avg rating)
}
```

---

### 4.2. Models Layer

#### UserModel
```javascript
class UserModel {
    table: 'NguoiDung'
    
    attributes:
    - ma_nguoi_dung: INT PRIMARY KEY
    - email: VARCHAR(255) UNIQUE
    - mat_khau: VARCHAR(255) HASHED
    - ho_ten: VARCHAR(255)
    - ma_khoa: INT FK
    - chuc_vu: ENUM('user', 'admin')
    - trang_thai: ENUM('active', 'suspended', 'deleted')
    - ngay_tao: TIMESTAMP
    - lan_dang_nhap_cuoi: TIMESTAMP
    
    methods:
    + create(userData)
    + findByEmail(email)
    + findById(id)
    + update(id, data)
    + delete(id)
    + updateLoginTime(id)
    
    state_transitions:
    - registered → active (verify)
    - active → suspended (violation)
    - suspended → active (appeal)
    - any → deleted (delete account)
}
```

#### DocumentModel
```javascript
class DocumentModel {
    table: 'TaiLieu'
    
    attributes:
    - ma_tai_lieu: INT PRIMARY KEY
    - tieu_de: VARCHAR(255)
    - mo_ta: TEXT
    - ten_tap: VARCHAR(255)  // File path
    - ma_mon_hoc: INT FK
    - ma_danh_muc: INT FK
    - ma_nguoi_dung: INT FK (uploader)
    - so_luot_xem: INT DEFAULT 0
    - so_luot_tai: INT DEFAULT 0
    - tong_danh_gia: DECIMAL(3,2)
    - ngay_tai: TIMESTAMP
    
    methods:
    + create(docData)
    + search(keyword, filters)
    + findById(id)
    + update(id, data)
    + delete(id)
    + incrementView(id)
    + incrementDownload(id)
    + updateRating(id, newRating)
    
    state_transitions:
    - uploaded → published (approve)
    - published → viewing (user access)
    - viewing → downloaded (download)
    - published → flagged (report)
    - flagged → published or removed (admin review)
}
```

#### CommentModel
```javascript
class CommentModel {
    table: 'BinhLuan'
    
    attributes:
    - ma_binh_luan: INT PRIMARY KEY
    - ma_tai_lieu: INT FK
    - ma_nguoi_dung: INT FK
    - noi_dung: TEXT
    - danh_gia: INT (1-5)
    - ngay_binh_luan: TIMESTAMP
    
    methods:
    + create(commentData)
    + findByDocument(docId)
    + update(id, content)
    + delete(id)
    + calculateAvgRating(docId)
}
```

---

### 4.3. Middleware Layer

#### AuthMiddleware (`middleware/auth.js`)
```javascript
class AuthMiddleware {
    methods:
    + authenticate(req, res, next)
        - Verify JWT token
        - Decode user info
        - Attach to req.user
        - Call next() or return 401
    
    + authorize(roles)
        - Check req.user.role
        - Return 403 if unauthorized
    
    state: Stateless
}
```

#### UploadMiddleware (`middleware/upload.js`)
```javascript
class UploadMiddleware {
    using: multer
    
    configuration:
    - storage: diskStorage
    - destination: './uploads'
    - filename: timestamp + originalname
    - fileFilter: check file type
    - limits: { fileSize: 10MB }
    
    methods:
    + single(fieldName)
    + array(fieldName, maxCount)
    
    state_transitions:
    - Selecting → Validating → Uploading → Uploaded/Failed
}
```

---

## 5. LUỒNG DỮ LIỆU

### 5.1. Request Flow
```
Client → Route → Middleware → Controller → Model → Database
                    ↓
              (authenticate,
               upload file,
               validate)
```

### 5.2. Response Flow
```
Database → Model → Controller → JSON Response → Client
                      ↓
                (format data,
                 error handling)
```

---

## 6. TRANSACTION & CONCURRENCY

### 6.1. Upload Transaction
```sql
BEGIN TRANSACTION;
    -- 1. Insert document metadata
    INSERT INTO TaiLieu (...) VALUES (...);
    
    -- 2. Update user upload count
    UPDATE NguoiDung SET so_tai_lieu_tai_len = so_tai_lieu_tai_len + 1 
    WHERE ma_nguoi_dung = ?;
    
    -- 3. Log activity
    INSERT INTO LichSuHoatDong (...) VALUES (...);
COMMIT;
```

### 6.2. Rating Transaction
```sql
BEGIN TRANSACTION;
    -- 1. Insert comment/rating
    INSERT INTO BinhLuan (...) VALUES (...);
    
    -- 2. Update document avg rating
    UPDATE TaiLieu 
    SET tong_danh_gia = (
        SELECT AVG(danh_gia) FROM BinhLuan WHERE ma_tai_lieu = ?
    )
    WHERE ma_tai_lieu = ?;
COMMIT;
```

---

## 7. ERROR HANDLING STATES

### 7.1. API Error Responses
```javascript
states:
- 200 OK: Success
- 201 Created: Resource created
- 400 Bad Request: Invalid input
- 401 Unauthorized: Missing/invalid token
- 403 Forbidden: Insufficient permissions
- 404 Not Found: Resource not exists
- 409 Conflict: Duplicate entry
- 500 Internal Server Error: Server error
```

### 7.2. Chatbot Fallback States
```javascript
state_machine:
- Normal → AI Response (if available)
- Normal → Fallback Response (if AI fails)
- Normal → Database Search (if search intent)
- Normal → Error Response (if exception)
```

---

## 8. PERFORMANCE & CACHING

### 8.1. Document Cache States
```
┌─────────────┐
│   No Cache  │
└──────┬──────┘
       │ first_request()
       ▼
┌─────────────┐
│   Loading   │
└──────┬──────┘
       │ fetch_complete()
       ▼
┌─────────────┐
│   Cached    │<───────┐
└──────┬──────┘        │
       │                │
       │ ttl_expire()   │ cache_hit()
       ▼                │
┌─────────────┐        │
│   Stale     │────────┘
└──────┬──────┘
       │ invalidate()
       ▼
┌─────────────┐
│  Invalidated│
└─────────────┘
```

---

## PHỤ LỤC: ROUTES MAPPING

| Method | Endpoint | Controller | Auth | Description |
|--------|----------|------------|------|-------------|
| POST | /api/auth/register | auth.register | ❌ | Đăng ký |
| POST | /api/auth/login | auth.login | ❌ | Đăng nhập |
| POST | /api/documents/upload | document.upload | ✅ | Upload tài liệu |
| GET | /api/documents/search | document.search | ❌ | Tìm kiếm |
| GET | /api/documents/:id | document.getById | ❌ | Chi tiết |
| GET | /api/documents/:id/download | document.download | ✅ | Tải về |
| POST | /api/comments | comment.create | ✅ | Bình luận |
| POST | /api/chatbot/chat | chatbot.chat | ❌ | Chat |
| GET | /api/chatbot/history | chatbot.getHistory | ✅ | Lịch sử |

---

**Tài liệu được tạo bởi:** Hệ thống DocShare Design Team  
**Phiên bản:** 2.0  
**Ngày cập nhật:** 20/11/2025
