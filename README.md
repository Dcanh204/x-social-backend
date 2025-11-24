# 🌐 Twitter Clone – Backend

Twitter-Clone là 1 phần cho ứng dụng mạng xã hội mô phỏng Twitter, cung cấp REST API cho các chức năng: đăng ký/đăng nhập, tweet, like, comment, follow, bookmark, tìm kiếm và upload media.

Dự án này được xây dựng trên nền tảng **Node.js** với **TypeScript** và thiết kế để quản lý các thành phần cốt lõi của một nền tảng xã hội hiện đại như người dùng, bài đăng, tương tác và bảo mật.

***

## ✨ Tính năng chính

Dự án này bao gồm các module chức năng sau:

### 🔐 1. Quản lý Xác thực (Auth)
* **Đăng ký / Đăng nhập / Logout:** Quy trình xác thực tiêu chuẩn.
* **Refresh Token:** Sử dụng Refresh Token để lấy Access Token mới mà không cần đăng nhập lại.
* **Xác thực Email:** Gửi email xác thực và chức năng gửi lại (resend verify email).
* **Google OAuth 2.0:** Đăng nhập thông qua tài khoản Google.
* **Quên & Đặt lại mật khẩu (Forgot/Reset Password):** Quy trình an toàn để đặt lại mật khẩu.

### 👤 2. Quản lý Người dùng (User)
* **Xem Hồ sơ:** API để xem thông tin hồ sơ của người dùng bất kỳ.
* **Xem Hồ sơ cá nhân (`/me`):** API để xem và quản lý hồ sơ của người dùng đang đăng nhập.
* **Cập nhật Thông tin:** Cho phép cập nhật avatar, bio, tên hiển thị, v.v.
* **Theo dõi (Follow/Unfollow):** Chức năng Follow và Unfollow giữa các người dùng.

### 🐦 3. Quản lý Bài đăng (Tweet)
* **Tạo & Xoá Tweet:** Các API để tạo và xoá bài đăng (Tweet).
* **Lấy Tweet theo ID:** Truy vấn một bài đăng cụ thể.
* **Lấy danh sách Replies / Comments:** Lấy tất cả bình luận cho một Tweet.

### ❤️ 4. Tương tác (Likes & Bookmarks)
* **Like / Unlike:** Chức năng Thích và Bỏ thích Tweet.
* **Tạo / Xoá Bookmark:** Lưu trữ và xoá Tweet khỏi danh sách đánh dấu (Bookmark).

### 🔍 5. Tìm kiếm (Search)
* **Tìm kiếm Tổng hợp:** Tìm kiếm Tweet và Người dùng dựa trên từ khóa (keyword).

### 📷 6. Quản lý Media
* **Upload Media:** Cho phép tải lên các tệp ảnh và video.

***
## 🏗 Cấu trúc dự án
```
src/
├─ controllers/ # Logic cho từng route
├─ middlewares/ # Authentication & validation
├─ validations/ # Schema validate dữ liệu
├─ routers/ # Định nghĩa router theo module
├─ models/ # Mongoose models
├─ services/ # Xử lý nghiệp vụ, business logic
├─ configs/ # Cấu hình project (DB, env, ...)
├─ utils/ # Hàm tiện ích, helper
├─ interfaces/ # Type / interface (nếu dùng TS)
├─ constants/ # Hằng số dùng chung
└─ app.js # Khởi tạo server
```
***
## 🚀 Công nghệ sử dụng

- 💻 **Ngôn ngữ & Framework:** Node.js, Express.js  
- 🗄 **Database:** MongoDB, Mongoose  
- 🔑 **Authentication:** JWT, Refresh Token, Google OAuth 2.0  
- 🛡 **Middleware:** Authentication, Validation  
- 📦 **File Upload:** Multer / Cloudinary  
- 🧪 **Testing:** Postman, 
- 🌐 **Source Control:** Git / GitHub
***

## 🚀 Hướng dẫn Cài đặt & Khởi chạy

### 1. Điều kiện tiên quyết

Đảm bảo bạn đã cài đặt các phần mềm sau trên máy của mình:

* [Node.js](https://nodejs.org/en/download/) (Phiên bản đề xuất: 18+)
* Trình quản lý gói: `npm`

### 2. Thiết lập dự án

1.  **Clone kho lưu trữ:**
    ```bash
    git clone git@github.com:Dcanh204/x-social-backend.git
    cd x-social-backend
    ```

2.  **Cài đặt các gói phụ thuộc:**
    ```bash
    npm install
    ```

3.  **Cấu hình Biến môi trường:**
    Tạo một tệp tin mới tên là **`.env`** ở thư mục gốc của dự án và điền các thông tin cần thiết. (Dự án của bạn có tệp `.env` nên bước này rất quan trọng.)

    ```env
    # Cấu hình Server
    PORT=4000 

    # Cấu hình Cơ sở dữ liệu (ví dụ cho MongoDB)
    DB_NAME= YOUR_DB_NAME
    DB_USERNAME= YOUR_DB_USERNAME
    DB_PASSWORD= YOUR_DB_PASSWORD
    
    # Cấu hình JWT
    JWT_SECRET_ACCESS_TOKEN=...
    JWT_SECRET_REFRESH_TOKEN=...
    JWT_SECRET_EMAIL_VERIFY_TOKEN=...
    JWT_SECRET_FORGOT_PASSWORD_TOKEN=...
    ```

### 3. Khởi chạy Server

Chạy lệnh sau để khởi động dự án:

```bash

npm run dev 
```