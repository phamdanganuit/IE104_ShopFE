# 🛍️ E-Commerce Platform with AI Chatbot

[![Next.js](https://img.shields.io/badge/Next.js-14.0.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.14-007FFF?style=for-the-badge&logo=mui)](https://mui.com/)
[![Groq AI](https://img.shields.io/badge/Groq-AI-orange?style=for-the-badge)](https://groq.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> 🎥 **[Watch Demo Video on YouTube](YOUR_YOUTUBE_DEMO_LINK_HERE)**  
> 🔗 **[Backend Repository (Node.js + MongoDB)](YOUR_BACKEND_GITHUB_LINK_HERE)**

**[English](#english) | [日本語](#japanese) | [Tiếng Việt](#vietnamese)**

---

<a name="english"></a>
## 🌟 English

### Overview

A modern, full-featured e-commerce platform built with Next.js 14, featuring an AI-powered chatbot that leverages real-time product data from MongoDB. This platform offers a seamless shopping experience with multi-language support, advanced product management, and intelligent customer support.

### ✨ Key Features

#### 🤖 **AI-Powered Chatbot**
- **Real-time Product Intelligence**: Chatbot reads directly from MongoDB to provide accurate product information
- **Groq AI Integration**: Powered by Llama 3.3 70B for lightning-fast, intelligent responses
- **Smart Product Search**: Natural language product queries with instant results
- **Visual Product Cards**: Display products with images, prices, and stock status within chat
- **Context-Aware Assistance**: Remembers conversation history for better support

#### 🛒 **E-Commerce Core**
- **Product Management**: Full CRUD operations with image upload
- **Advanced Search & Filters**: Category, price range, availability filters
- **Shopping Cart**: Persistent cart with real-time updates
- **Order Management**: Track orders from checkout to delivery
- **Product Reviews**: Rating and review system with moderation
- **Wishlist**: Save favorite products for later
- **Product Recommendations**: AI-suggested related products

#### 👤 **User Experience**
- **Multi-language Support**: English, Vietnamese, Japanese (i18next)
- **Dark/Light Mode**: Seamless theme switching
- **Responsive Design**: Mobile-first, works on all devices
- **Real-time Notifications**: Firebase Cloud Messaging
- **Social Authentication**: Google & Facebook login
- **User Profiles**: Manage addresses, orders, and preferences

#### 🔐 **Security & Authentication**
- **NextAuth.js**: Secure authentication system
- **Role-based Access Control (RBAC)**: Using CASL
- **JWT Tokens**: Secure session management
- **Environment Variables**: Secure API key management

#### 🎨 **Modern UI/UX**
- **Material-UI 5**: Beautiful, accessible components
- **Glass Morphism**: Modern gradient and blur effects
- **Smooth Animations**: Framer Motion-inspired transitions
- **Custom Components**: Tailored data grids, modals, and forms
- **Professional Color Scheme**: Consistent blue theme (#2563eb)

### 📋 Prerequisites

- **Node.js**: 16.x or higher
- **npm** or **yarn** or **pnpm**
- **Backend API**: Running instance (https://ie104-be.onrender.com)
- **Groq API Key**: Get from [Groq Console](https://console.groq.com/keys)

### 🚀 Quick Start

#### 1. Clone the Repository

```bash
git clone https://github.com/phamdanganuit/IE104_ShopFE.git
cd IE104_ShopFE
```

#### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
# or
yarn install
# or
pnpm install
```

#### 3. Environment Setup

Create `.env` file in root directory:

```env
# Backend API
NEXT_PUBLIC_API_HOST=https://ie104-be.onrender.com

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_SECRET=your_google_secret

# Facebook OAuth
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_SECRET=your_facebook_secret

# NextAuth
NEXT_AUTH_SECRET=your_nextauth_secret

# Firebase
FIREBASE_KEY_PAIR=your_firebase_key_pair

# Groq AI (Required for Chatbot)
GROQ_API_KEY=your_groq_api_key_here
```

#### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

#### 5. Build for Production

```bash
npm run build
npm start
```

### 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── chat-bot-ai/    # AI Chatbot component
│   ├── custom-data-grid/
│   └── ...
├── pages/              # Next.js pages and API routes
│   ├── api/
│   │   └── chat/       # Groq AI endpoints
│   ├── product/
│   ├── my-cart/
│   └── ...
├── services/           # API service layer
├── stores/             # Redux store slices
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── configs/            # Configuration files
└── views/              # Page-specific components

public/
├── images/             # Static images
├── locales/            # i18n translation files
│   ├── en.json
│   ├── vi.json
│   └── ja.json
└── svgs/               # SVG icons
```

### 🧠 AI Chatbot Architecture

```
User Message → Frontend Component
                    ↓
              POST /api/chat/groq
                    ↓
        Detect Keywords (product search)
                    ↓
      Fetch Products from MongoDB
        (via Backend API)
                    ↓
        Build Context with Real Data
                    ↓
        Groq AI (Llama 3.3 70B)
                    ↓
    Smart Response + Product Cards
                    ↓
            Display to User
```

**Features:**
- Automatic product search based on user intent
- Context window includes last 6 messages
- Product display with images, prices, stock status
- Click to view full product details
- Error handling with friendly messages

### 🔧 Configuration

#### API Endpoints (`src/configs/api.ts`)

```typescript
export const API_ENDPOINT = {
  MANAGE_PRODUCT: {
    PRODUCT: {
      INDEX: '/api/products'
    },
    PRODUCT_TYPE: {
      INDEX: '/api/product-types'
    }
  },
  // ... more endpoints
}
```

#### Chatbot Settings (`src/pages/api/chat/groq.ts`)

```typescript
{
  model: 'llama-3.3-70b-versatile',  // Fast, accurate model
  temperature: 0.7,                   // Creativity level
  max_tokens: 1024,                   // Response length
  top_p: 0.9                          // Sampling probability
}
```

### 🌐 Deployment

#### Deploy to Vercel

1. Push code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add environment variables in Settings
4. Deploy!

See detailed guide: [DEPLOYMENT.md](DEPLOYMENT.md)

#### Environment Variables (Vercel)

Required variables:
- `NEXT_PUBLIC_API_HOST`
- `GROQ_API_KEY` ⚡ (Critical for AI chatbot)
- `GOOGLE_CLIENT_ID`, `GOOGLE_SECRET`
- `FACEBOOK_CLIENT_ID`, `FACEBOOK_SECRET`
- `NEXT_AUTH_SECRET`
- `FIREBASE_KEY_PAIR`

### 📊 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier
```

### 🧪 Testing the Chatbot

Try these queries:

**Product Search:**
- "What products do you have?"
- "Show me cheap products"
- "Find iPhone"
- "Products on sale"

**Categories:**
- "What categories are available?"
- "Show product categories"

**General Support:**
- "What's your return policy?"
- "How long is shipping?"
- "Payment methods?"

### 📦 Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| Next.js | 14.0.4 | React framework |
| Material-UI | 5.14.20 | UI components |
| Redux Toolkit | 2.0.1 | State management |
| Groq SDK | 0.34.0 | AI chatbot |
| React Query | 5.39.0 | Data fetching |
| NextAuth.js | 4.24.10 | Authentication |
| i18next | 23.7.8 | Internationalization |
| Firebase | 11.0.1 | Push notifications |
| Socket.io | 4.7.5 | Real-time updates |

### 🎯 Roadmap

- [ ] Voice chatbot interaction
- [ ] Product comparison feature
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] AI-powered product recommendations
- [ ] Live chat with human agents
- [ ] Multi-vendor marketplace

### 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### 👥 Authors

- **Development Team** - [phamdanganuit](https://github.com/phamdanganuit)

### 🙏 Acknowledgments

- Material-UI for beautiful components
- Groq for ultra-fast AI inference
- Next.js team for amazing framework
- Open source community

### 📞 Support

For support, create an issue on GitHub or contact the development team.

---

<a name="japanese"></a>
## 🌟 日本語

### 概要

Next.js 14で構築された、MongoDBからのリアルタイム製品データを活用するAI搭載チャットボットを特徴とする、モダンで多機能なEコマースプラットフォームです。多言語サポート、高度な製品管理、インテリジェントなカスタマーサポートにより、シームレスなショッピング体験を提供します。

### ✨ 主な機能

#### 🤖 **AI搭載チャットボット**
- **リアルタイム製品インテリジェンス**: チャットボットがMongoDBから直接読み取り、正確な製品情報を提供
- **Groq AI統合**: Llama 3.3 70Bを活用した超高速でインテリジェントな応答
- **スマート製品検索**: 自然言語での製品クエリと即座の結果表示
- **ビジュアル製品カード**: チャット内で画像、価格、在庫状況付きの製品表示
- **コンテキスト認識アシスタンス**: より良いサポートのために会話履歴を記憶

#### 🛒 **Eコマースコア機能**
- **製品管理**: 画像アップロード付き完全CRUD操作
- **高度な検索＆フィルター**: カテゴリー、価格帯、在庫状況フィルター
- **ショッピングカート**: リアルタイム更新付き永続カート
- **注文管理**: チェックアウトから配送までの注文追跡
- **製品レビュー**: モデレーション付き評価・レビューシステム
- **ウィッシュリスト**: お気に入り製品の保存
- **製品推奨**: AI提案による関連製品

#### 👤 **ユーザーエクスペリエンス**
- **多言語サポート**: 英語、ベトナム語、日本語（i18next）
- **ダーク/ライトモード**: シームレスなテーマ切り替え
- **レスポンシブデザイン**: モバイルファースト、全デバイス対応
- **リアルタイム通知**: Firebase Cloud Messaging
- **ソーシャル認証**: GoogleとFacebookログイン
- **ユーザープロフィール**: 住所、注文、設定の管理

#### 🔐 **セキュリティ＆認証**
- **NextAuth.js**: 安全な認証システム
- **ロールベースアクセス制御（RBAC）**: CASLを使用
- **JWTトークン**: 安全なセッション管理
- **環境変数**: 安全なAPIキー管理

#### 🎨 **モダンUI/UX**
- **Material-UI 5**: 美しくアクセシブルなコンポーネント
- **グラスモーフィズム**: モダンなグラデーションとブラー効果
- **スムーズアニメーション**: Framer Motionインスパイアのトランジション
- **カスタムコンポーネント**: カスタマイズされたデータグリッド、モーダル、フォーム
- **プロフェッショナルカラースキーム**: 一貫したブルーテーマ（#2563eb）

### 📋 前提条件

- **Node.js**: 16.x以上
- **npm** または **yarn** または **pnpm**
- **バックエンドAPI**: 実行中のインスタンス（https://ie104-be.onrender.com）
- **Groq APIキー**: [Groqコンソール](https://console.groq.com/keys)から取得

### 🚀 クイックスタート

#### 1. リポジトリのクローン

```bash
git clone https://github.com/phamdanganuit/IE104_ShopFE.git
cd IE104_ShopFE
```

#### 2. 依存関係のインストール

```bash
npm install --legacy-peer-deps
# または
yarn install
# または
pnpm install
```

#### 3. 環境設定

ルートディレクトリに`.env`ファイルを作成:

```env
# バックエンドAPI
NEXT_PUBLIC_API_HOST=https://ie104-be.onrender.com

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_SECRET=your_google_secret

# Facebook OAuth
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_SECRET=your_facebook_secret

# NextAuth
NEXT_AUTH_SECRET=your_nextauth_secret

# Firebase
FIREBASE_KEY_PAIR=your_firebase_key_pair

# Groq AI（チャットボットに必須）
GROQ_API_KEY=your_groq_api_key_here
```

#### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで[http://localhost:3000](http://localhost:3000)を開きます。

#### 5. プロダクションビルド

```bash
npm run build
npm start
```

### 📁 プロジェクト構造

```
src/
├── components/          # 再利用可能なUIコンポーネント
│   ├── chat-bot-ai/    # AIチャットボットコンポーネント
│   ├── custom-data-grid/
│   └── ...
├── pages/              # Next.jsページとAPIルート
│   ├── api/
│   │   └── chat/       # Groq AIエンドポイント
│   ├── product/
│   ├── my-cart/
│   └── ...
├── services/           # APIサービスレイヤー
├── stores/             # Reduxストアスライス
├── hooks/              # カスタムReactフック
├── utils/              # ユーティリティ関数
├── types/              # TypeScript型定義
├── configs/            # 設定ファイル
└── views/              # ページ固有のコンポーネント

public/
├── images/             # 静的画像
├── locales/            # i18n翻訳ファイル
│   ├── en.json
│   ├── vi.json
│   └── ja.json
└── svgs/               # SVGアイコン
```

### 🧠 AIチャットボットアーキテクチャ

```
ユーザーメッセージ → フロントエンドコンポーネント
                        ↓
                  POST /api/chat/groq
                        ↓
            キーワード検出（製品検索）
                        ↓
          MongoDBから製品取得
            （バックエンドAPI経由）
                        ↓
          実データでコンテキスト構築
                        ↓
          Groq AI (Llama 3.3 70B)
                        ↓
        スマート応答 + 製品カード
                        ↓
              ユーザーに表示
```

**特徴:**
- ユーザーの意図に基づく自動製品検索
- 直近6メッセージを含むコンテキストウィンドウ
- 画像、価格、在庫状況付きの製品表示
- クリックして製品詳細を表示
- フレンドリーなメッセージでエラー処理

### 🧪 チャットボットのテスト

以下のクエリを試してください:

**製品検索:**
- 「どんな製品がありますか？」
- 「安い製品を見せて」
- 「iPhoneを探して」
- 「セール中の製品」

**カテゴリー:**
- 「どんなカテゴリーがありますか？」
- 「製品カテゴリーを表示」

**一般サポート:**
- 「返品ポリシーは？」
- 「配送にどのくらいかかりますか？」
- 「支払い方法は？」

### 🌐 デプロイ

#### Vercelにデプロイ

1. GitHubにコードをプッシュ
2. [Vercel](https://vercel.com)にプロジェクトをインポート
3. 設定で環境変数を追加
4. デプロイ！

詳細ガイド: [DEPLOYMENT.md](DEPLOYMENT.md)

#### 環境変数（Vercel）

必須変数:
- `NEXT_PUBLIC_API_HOST`
- `GROQ_API_KEY` ⚡ (AIチャットボットに重要)
- `GOOGLE_CLIENT_ID`, `GOOGLE_SECRET`
- `FACEBOOK_CLIENT_ID`, `FACEBOOK_SECRET`
- `NEXT_AUTH_SECRET`
- `FIREBASE_KEY_PAIR`

### 📦 主な依存関係

| パッケージ | バージョン | 目的 |
|---------|---------|---------|
| Next.js | 14.0.4 | Reactフレームワーク |
| Material-UI | 5.14.20 | UIコンポーネント |
| Redux Toolkit | 2.0.1 | 状態管理 |
| Groq SDK | 0.34.0 | AIチャットボット |
| React Query | 5.39.0 | データフェッチング |
| NextAuth.js | 4.24.10 | 認証 |
| i18next | 23.7.8 | 国際化 |
| Firebase | 11.0.1 | プッシュ通知 |
| Socket.io | 4.7.5 | リアルタイム更新 |

### 🎯 ロードマップ

- [ ] 音声チャットボットインタラクション
- [ ] 製品比較機能
- [ ] 高度な分析ダッシュボード
- [ ] モバイルアプリ（React Native）
- [ ] AI搭載製品推奨
- [ ] 人間エージェントとのライブチャット
- [ ] マルチベンダーマーケットプレイス

### 📄 ライセンス

このプロジェクトはMITライセンスの下でライセンスされています - 詳細は[LICENSE](LICENSE)ファイルを参照してください。

### 👥 作成者

- **開発チーム** - [phamdanganuit](https://github.com/phamdanganuit)

### 📞 サポート

サポートについては、GitHubでissueを作成するか、開発チームにお問い合わせください。

---

<a name="vietnamese"></a>
## 🌟 Tiếng Việt

### Tổng quan

Nền tảng thương mại điện tử hiện đại, đầy đủ tính năng được xây dựng với Next.js 14, có chatbot AI tận dụng dữ liệu sản phẩm thời gian thực từ MongoDB. Nền tảng này cung cấp trải nghiệm mua sắm liền mạch với hỗ trợ đa ngôn ngữ, quản lý sản phẩm nâng cao và hỗ trợ khách hàng thông minh.

### ✨ Tính năng chính

#### 🤖 **Chatbot AI thông minh**
- **Thông tin sản phẩm thời gian thực**: Chatbot đọc trực tiếp từ MongoDB để cung cấp thông tin sản phẩm chính xác
- **Tích hợp Groq AI**: Được hỗ trợ bởi Llama 3.3 70B cho phản hồi siêu nhanh và thông minh
- **Tìm kiếm sản phẩm thông minh**: Truy vấn sản phẩm bằng ngôn ngữ tự nhiên với kết quả tức thì
- **Thẻ sản phẩm trực quan**: Hiển thị sản phẩm với hình ảnh, giá và trạng thái kho trong chat
- **Hỗ trợ nhận biết ngữ cảnh**: Ghi nhớ lịch sử trò chuyện để hỗ trợ tốt hơn

#### 🛒 **Tính năng Ecommerce cốt lõi**
- **Quản lý sản phẩm**: Đầy đủ thao tác CRUD với tải lên hình ảnh
- **Tìm kiếm & Lọc nâng cao**: Lọc theo danh mục, khoảng giá, tình trạng có sẵn
- **Giỏ hàng**: Giỏ hàng lưu trữ với cập nhật thời gian thực
- **Quản lý đơn hàng**: Theo dõi đơn hàng từ thanh toán đến giao hàng
- **Đánh giá sản phẩm**: Hệ thống đánh giá với kiểm duyệt
- **Danh sách yêu thích**: Lưu sản phẩm yêu thích
- **Gợi ý sản phẩm**: Sản phẩm liên quan được AI đề xuất

#### 👤 **Trải nghiệm người dùng**
- **Hỗ trợ đa ngôn ngữ**: Tiếng Anh, Tiếng Việt, Tiếng Nhật (i18next)
- **Chế độ Tối/Sáng**: Chuyển đổi giao diện mượt mà
- **Thiết kế responsive**: Mobile-first, hoạt động trên mọi thiết bị
- **Thông báo thời gian thực**: Firebase Cloud Messaging
- **Xác thực mạng xã hội**: Đăng nhập Google & Facebook
- **Hồ sơ người dùng**: Quản lý địa chỉ, đơn hàng và tùy chọn

#### 🔐 **Bảo mật & Xác thực**
- **NextAuth.js**: Hệ thống xác thực an toàn
- **Kiểm soát truy cập dựa trên vai trò (RBAC)**: Sử dụng CASL
- **JWT Tokens**: Quản lý phiên an toàn
- **Biến môi trường**: Quản lý API key an toàn

#### 🎨 **UI/UX hiện đại**
- **Material-UI 5**: Component đẹp, dễ tiếp cận
- **Glass Morphism**: Hiệu ứng gradient và blur hiện đại
- **Hoạt ảnh mượt mà**: Chuyển đổi lấy cảm hứng từ Framer Motion
- **Component tùy chỉnh**: Data grid, modal và form được thiết kế riêng
- **Bảng màu chuyên nghiệp**: Giao diện xanh nhất quán (#2563eb)

### 📋 Yêu cầu

- **Node.js**: 16.x trở lên
- **npm** hoặc **yarn** hoặc **pnpm**
- **Backend API**: Instance đang chạy (https://ie104-be.onrender.com)
- **Groq API Key**: Lấy từ [Groq Console](https://console.groq.com/keys)

### 🚀 Bắt đầu nhanh

#### 1. Clone Repository

```bash
git clone https://github.com/phamdanganuit/IE104_ShopFE.git
cd IE104_ShopFE
```

#### 2. Cài đặt Dependencies

```bash
npm install --legacy-peer-deps
```

#### 3. Thiết lập môi trường

Tạo file `.env` trong thư mục gốc:

```env
# Backend API
NEXT_PUBLIC_API_HOST=https://ie104-be.onrender.com

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_SECRET=your_google_secret

# Facebook OAuth
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_SECRET=your_facebook_secret

# NextAuth
NEXT_AUTH_SECRET=your_nextauth_secret

# Firebase
FIREBASE_KEY_PAIR=your_firebase_key_pair

# Groq AI (Bắt buộc cho Chatbot)
GROQ_API_KEY=your_groq_api_key_here
```

#### 4. Chạy Development Server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt.

#### 5. Build cho Production

```bash
npm run build
npm start
```

### 🧪 Test Chatbot

Thử các câu hỏi sau:

**Tìm kiếm sản phẩm:**
- "Có sản phẩm nào đang bán không?"
- "Tìm sản phẩm giá rẻ"
- "Tìm điện thoại iPhone"
- "Sản phẩm đang giảm giá"

**Danh mục:**
- "Cửa hàng có những loại sản phẩm nào?"
- "Cho tôi xem danh mục sản phẩm"

**Hỗ trợ chung:**
- "Chính sách đổi trả như thế nào?"
- "Thời gian giao hàng bao lâu?"
- "Hỗ trợ thanh toán gì?"

### 📦 Dependencies chính

| Package | Version | Mục đích |
|---------|---------|---------|
| Next.js | 14.0.4 | React framework |
| Material-UI | 5.14.20 | UI components |
| Redux Toolkit | 2.0.1 | Quản lý state |
| Groq SDK | 0.34.0 | AI chatbot |
| React Query | 5.39.0 | Fetch dữ liệu |
| NextAuth.js | 4.24.10 | Xác thực |
| i18next | 23.7.8 | Đa ngôn ngữ |
| Firebase | 11.0.1 | Push notifications |
| Socket.io | 4.7.5 | Cập nhật real-time |

### 📄 Giấy phép

Dự án này được cấp phép theo giấy phép MIT - xem file [LICENSE](LICENSE) để biết chi tiết.

### 👥 Tác giả

- **Development Team** - [phamdanganuit](https://github.com/phamdanganuit)

---

## 📸 Screenshots

### Home Page
![Home](https://github.com/user-attachments/assets/5ca79217-01b4-4e48-be6c-52fd6290f177)

### Product Listing
![Products](https://github.com/user-attachments/assets/7d11fa48-24f2-46b3-b1da-d9d952474993)

### Product Details
![Details](https://github.com/user-attachments/assets/5f0d5564-256e-4f00-b75d-50c4dd829631)

### AI Chatbot
![Chatbot](https://github.com/user-attachments/assets/42669fa6-4604-46bc-931b-ad764973c3a1)

### Shopping Cart
![Cart](https://github.com/user-attachments/assets/1a88cb25-6b54-42da-8326-a07be7a9b9ae)

### User Dashboard
![Dashboard](https://github.com/user-attachments/assets/db410ed2-3211-4937-b41f-c3d230c4f024)

### Order Management
![Orders](https://github.com/user-attachments/assets/aa8067ed-cf08-40d3-a033-5b8f7e5fa3d6)

### Product Management
![Manage](https://github.com/user-attachments/assets/7f48745b-0abf-472b-961f-8d2a3f2b187d)

---

**Made with ❤️ by IE104 Team**
