# Hướng dẫn tích hợp Groq AI vào Chatbot

## 🎯 Tính năng mới

Chatbot giờ đây có khả năng:
- ✅ Đọc dữ liệu sản phẩm **trực tiếp từ MongoDB** qua backend API
- ✅ Trả lời thông minh dựa trên **dữ liệu thực tế** của cửa hàng
- ✅ Tìm kiếm và gợi ý sản phẩm phù hợp
- ✅ Hiển thị sản phẩm ngay trong chat với hình ảnh, giá, tồn kho
- ✅ Sử dụng **Groq AI** (Llama 3.3 70B) - siêu nhanh và thông minh

## 📋 Cách sử dụng

### Bước 1: Lấy API Key từ Groq

1. Truy cập: https://console.groq.com/keys
2. Đăng nhập hoặc tạo tài khoản miễn phí
3. Tạo API Key mới
4. Copy API Key

### Bước 2: Thêm API Key vào dự án

**Môi trường Development (Local):**

Thêm vào file `.env`:
```bash
GROQ_API_KEY=gsk_your_actual_groq_api_key_here
```

**Môi trường Production (Vercel):**

1. Vào Vercel Dashboard
2. Chọn project `app_shop_fe`
3. Settings → Environment Variables
4. Thêm biến mới:
   - Name: `GROQ_API_KEY`
   - Value: `gsk_your_actual_groq_api_key_here`
   - Environment: Production, Preview, Development (chọn tất cả)
5. Save và Redeploy

### Bước 3: Khởi động lại server

```bash
# Dừng server hiện tại (Ctrl + C)
# Khởi động lại
npm run dev
```

## 🧪 Test Chatbot

Mở chatbot và thử các câu hỏi:

### Tìm kiếm sản phẩm:
- "Có sản phẩm nào đang bán không?"
- "Tìm sản phẩm giá rẻ"
- "Sản phẩm bán chạy nhất là gì?"
- "Tìm điện thoại iPhone"

### Hỏi về danh mục:
- "Cửa hàng có những loại sản phẩm nào?"
- "Cho tôi xem danh mục sản phẩm"

### Hỏi chung:
- "Chính sách đổi trả như thế nào?"
- "Thời gian giao hàng bao lâu?"
- "Hỗ trợ thanh toán gì?"

## 🔧 Cấu trúc Code

### File mới được tạo:

1. **`src/pages/api/chat/groq.ts`**
   - API route xử lý chat với Groq AI
   - Tích hợp dữ liệu sản phẩm từ MongoDB
   - Tự động tìm kiếm sản phẩm khi phát hiện từ khóa

2. **`src/pages/api/chat/get-products-context.ts`**
   - Helper functions để lấy dữ liệu từ backend
   - `getProductsContext()` - Lấy danh sách sản phẩm
   - `getProductTypes()` - Lấy danh mục
   - `searchProductByName()` - Tìm kiếm sản phẩm

### File được cập nhật:

1. **`src/components/chat-bot-ai/index.tsx`**
   - Gọi API Groq thay vì câu trả lời giả lập
   - Hiển thị sản phẩm gợi ý trong chat
   - Click vào sản phẩm mở trang chi tiết

## 🎨 Giao diện

Khi AI gợi ý sản phẩm, chatbot sẽ hiển thị:
- 📸 Hình ảnh sản phẩm
- 💰 Giá (có giá gốc nếu đang giảm giá)
- 📦 Tình trạng kho hàng
- 🖱️ Click để xem chi tiết (mở tab mới)

## ⚙️ Cấu hình AI

File: `src/pages/api/chat/groq.ts`

```typescript
// Model sử dụng
model: 'llama-3.3-70b-versatile'

// Tham số
temperature: 0.7  // Độ sáng tạo (0-1)
max_tokens: 1024  // Độ dài câu trả lời
top_p: 0.9        // Xác suất lấy mẫu
```

## 🔍 Cách AI hoạt động

1. **User gửi tin nhắn** → Chatbot component
2. **Phát hiện từ khóa** → Tìm sản phẩm trong MongoDB
3. **Lấy dữ liệu thực tế** → Backend API
4. **Đưa vào context** → System prompt cho AI
5. **Groq AI xử lý** → Trả lời thông minh dựa trên dữ liệu
6. **Hiển thị kết quả** → Tin nhắn + Sản phẩm gợi ý

## 🚀 Ưu điểm

- ⚡ **Siêu nhanh**: Groq tối ưu cho inference speed
- 🎯 **Chính xác**: Dữ liệu thật từ database
- 💰 **Miễn phí**: Groq có free tier rất hào phóng
- 🧠 **Thông minh**: Llama 3.3 70B - model SOTA
- 📱 **Real-time**: Cập nhật tồn kho, giá theo thời gian thực

## 🛡️ Bảo mật

- API Key chỉ sử dụng ở **server-side** (API route)
- Không bao giờ lộ key ra client
- File `.env` đã được thêm vào `.gitignore`

## 📊 Giới hạn

Groq Free Tier:
- 30 requests/phút
- 14,400 requests/ngày

Nếu vượt quá, chatbot sẽ hiển thị lỗi thân thiện.

## 🔄 Update Production

Sau khi thêm `GROQ_API_KEY` vào Vercel:

```bash
# Commit và push code
git add .
git commit -m "Add Groq AI chatbot with MongoDB integration"
git push origin master

# Vercel sẽ tự động deploy
```

## 🎉 Kết quả

Bây giờ chatbot của bạn là một **AI trợ lý thật sự**, không chỉ trả lời câu hỏi mà còn:
- Tìm kiếm sản phẩm trong database
- Gợi ý sản phẩm phù hợp
- Tư vấn mua hàng thông minh
- Hỗ trợ khách hàng 24/7

Chúc bạn thành công! 🚀
