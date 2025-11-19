# 🔧 HƯỚNG DẪN TEST UPLOAD & XEM TÀI LIỆU

## ✅ ĐÃ SỬA & THÊM MỚI:

1. ✅ **Thêm detailed logging** vào upload controller
   - Log user info
   - Log request body (tieu_de, ma_mon_hoc, etc.)
   - Log file info
   - Log database insert
   - Log errors chi tiết

2. ✅ **Tạo script helper mới**
   - `OPEN-MY-DOCS.bat` - Mở trang "Tài liệu của tôi"

3. ✅ **Server đã restart** với logging mới

---

## 🧪 CÁCH TEST ĐÚNG

### Bước 1: Đăng nhập
**Click:** `OPEN-LOGIN.bat`
- Email: `admin@test.com`
- Password: `admin123`

### Bước 2: Vào trang upload
**Click:** `OPEN-UPLOAD.bat`

### Bước 3: Upload file
1. Chọn file PDF (< 10MB)
2. Điền tiêu đề: "Sách CSDL"
3. **PHẢI CHỌN MÔN HỌC** từ dropdown (VD: "Cơ sở dữ liệu")
4. Click "Tải lên"

### Bước 4: Mở DevTools để xem logs
**Nhấn F12** → Tab **Console**

Bạn sẽ thấy:
```javascript
Upload URL: http://localhost:3000/api/documents
Token: Present
Upload data: { tieu_de: "...", ma_mon_hoc: "2", file: "..." }
Upload response: 200 { message: "Upload tài liệu thành công!", ... }
```

### Bước 5: Xem server logs
**Mở cửa sổ START-SERVER.bat** và xem logs:
```
=== UPLOAD REQUEST ===
User: { ma_nguoi_dung: 4, email: 'admin@test.com', ... }
Body: { tieu_de: 'Sách CSDL', ma_mon_hoc: '2', ... }
File: { filename: '...pdf', size: 8976039, mimetype: 'application/pdf' }
✅ Database connected
Inserting: { tieu_de: 'Sách CSDL', ma_mon_hoc: 2, ... }
✅ Document inserted with ID: 1
```

### Bước 6: Xem tài liệu đã upload
**Click:** `OPEN-MY-DOCS.bat`  
Hoặc vào: http://localhost:3000/sinhvien/my-documents.html

---

## 🔍 KIỂM TRA DATABASE

Mở Command Prompt và chạy:
```bash
cd C:\xampp\mysql\bin
mysql -u root

USE documentsharing_schema;
SELECT ma_tai_lieu, tieu_de, ten_tap, ma_nguoi_dung FROM TaiLieu;
```

Bạn sẽ thấy tài liệu đã upload!

---

## ❌ NẾU VẪN KHÔNG HIỆN

### 1. Kiểm tra server logs
- Mở cửa sổ START-SERVER.bat
- Xem có lỗi ❌ nào không
- Có thấy "✅ Document inserted with ID: X" không?

### 2. Kiểm tra browser console (F12)
- Tab Console: Có lỗi đỏ không?
- Tab Network: Response của POST /api/documents là gì?

### 3. Kiểm tra các trường hợp lỗi phổ biến:

#### ❌ "Vui lòng chọn môn học"
→ Bạn chưa chọn môn học từ dropdown
→ **Fix:** Chọn môn học trước khi upload

#### ❌ "No token found" / "Vui lòng đăng nhập lại"
→ Token hết hạn hoặc bị xóa
→ **Fix:** Đăng xuất → Đăng nhập lại

#### ❌ "Cannot connect to database"
→ MySQL không chạy hoặc database sai
→ **Fix:** Mở XAMPP → Start MySQL

#### ❌ Upload response 401/403
→ Token không hợp lệ hoặc hết hạn
→ **Fix:** Đăng nhập lại

#### ❌ Upload response 400
→ Thiếu field bắt buộc (tieu_de, ma_mon_hoc, file)
→ **Fix:** Điền đầy đủ thông tin

#### ❌ Upload response 500
→ Lỗi server (database, filesystem, etc.)
→ **Fix:** Xem server logs để biết chi tiết

---

## 📋 CHECKLIST

- [ ] XAMPP MySQL đang chạy
- [ ] Server đang chạy (START-SERVER.bat)
- [ ] Đã đăng nhập (có token)
- [ ] Đã chọn file
- [ ] Đã điền tiêu đề
- [ ] **Đã chọn môn học** ⭐ QUAN TRỌNG NHẤT
- [ ] Mở F12 → Console để xem logs
- [ ] Xem server logs trong cửa sổ START-SERVER.bat

---

## 🎯 TEST NGAY

1. **Click:** `OPEN-LOGIN.bat` → Đăng nhập
2. **Click:** `OPEN-UPLOAD.bat` → Upload file (nhớ chọn môn học!)
3. **Click:** `OPEN-MY-DOCS.bat` → Xem tài liệu

Nếu vẫn không hiện, **copy toàn bộ**:
- Server logs (từ cửa sổ START-SERVER.bat)
- Browser console logs (F12 → Console)
- Network response (F12 → Network → POST /api/documents)

Và báo lại! 🚀
