# PharmaNest 🌿
A production-grade, full-stack healthcare and pharmacy marketplace built with a modern tech stack. PharmaNest enables a seamless connection between healthcare providers (Hosts) and patients (Users), featuring AI-driven consultations, secure payment processing, and real-time order tracking.

---

## 🚀 Key Features

### 👤 Dual Role Architecture
- **Users**: Browse products, manage health profiles, book AI consultations, and track orders.
- **Hosts (Sellers/Doctors)**: Manage inventory, process orders, provide professional consultations, and view real-time sales analytics.

### 🤖 AI-Powered Consultations
- Integrated with **OpenAI** and **Google Gemini** for intelligent healthcare assistance.
- AI-driven diagnostics and virtual medical advice.

### 💳 Secure Transactions
- Full **Razorpay** integration for frictionless payments.
- Order history and secure billing management.

### 📊 Advanced Analytics
- Real-time dashboard for Hosts using **Recharts**.
- Visualizations for sales trends, inventory health, and revenue growth.

### 🔔 Real-time & Automated Tasks
- **Socket.io** integration for instant notifications and live updates.
- **Automated Cron Jobs** for inventory monitoring and order progression checks.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) with [Vite](https://vitejs.dev/) & [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
- **State Management**: [Axios](https://axios-http.com/) for API calls
- **Visualization**: [Recharts](https://recharts.org/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) with [Express 5](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Real-time**: [Socket.io](https://socket.io/)
- **Authentication**: JWT (JSON Web Tokens) with Refresh Token logic
- **Utility**: [Cloudinary](https://cloudinary.com/) (Images), [Resend](https://resend.com/) (Transactional Emails)

---

## 📂 Project Structure

```bash
 Pharmanest/
 ├── backend/                 # Node.js Server
 │   ├── controllers/         # Business logic
 │   ├── modules/             # Database schemas (Mongoose)
 │   ├── routes/              # API endpoints (v1)
 │   ├── jobs/                # Cron jobs (Inventory/Orders)
 │   └── app.js               # Entry point
 └── frontend/                # React Vite Application
     ├── src/
     │   ├── components/      # UI Components
     │   ├── pages/           # View layouts
     │   ├── services/        # API integration layer
     │   └── assets/          # Static files
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Cloudinary, Resend, and Razorpay API keys

### Installation
1. Clone the repository:
   ```bash
   git clone <repo-url>
   ```
2. Setup **Backend**:
   ```bash
   cd backend
   npm install
   # Create a .env file with your credentials
   npm start
   ```
3. Setup **Frontend**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

---

## 🛡 Security & Best Practices
- **Helmet**: Secure HTTP headers.
- **Rate Limiting**: Protection against brute-force attacks.
- **Input Sanitization**: XSS filters and MongoSanitize to prevent injection.
- **Bcrypt**: Advanced password hashing.

---

## 📧 Support
For support or inquiries, please contact the development team via the project dashboard.
