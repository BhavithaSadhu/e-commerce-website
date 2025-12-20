# 🛒 MERN E-Commerce Platform (Production Deployed)

A **production-ready full-stack e-commerce application** built using the **MERN stack**, featuring secure authentication, online payments, complete order lifecycle management, and **live deployment on Vercel** with separate user and admin applications.

🔗 **Live User App:** https://e-commerce-frontend-gold-mu.vercel.app/  
🔗 **Admin Panel:** https://e-commerce-admin-umber-alpha.vercel.app/  
🔗 **Source Code:** https://github.com/rahulya43/E-COMMERCE

---

## 🚀 Features

### 👤 User Features
- Secure user authentication using **JWT**
- Browse products and view detailed product pages
- Add/remove items from cart
- **Online payment integration (Stripe / Razorpay)**
- Place orders and track **real-time order status**
  *(Placed → Shipped → Delivered)*
- View complete order history

### 🛠 Admin Features
- Secure **admin-only authentication**
- Add, update, and delete products
- Upload product images using **Cloudinary**
- View and manage all user orders
- Update order status across lifecycle stages
- Role-based access control using backend middleware

---

## 💳 Payment Integration

- Integrated **Razorpay** for secure online payments
- Implemented server-side payment verification
- Handled payment success and failure scenarios
- Ensured order creation only after successful payment confirmation

---

## 📦 Order Lifecycle Management

Implemented a complete **order workflow**:

1. **Placed** – Order successfully created after payment/COD  
2. **Shipped** – Order dispatched by admin  
3. **Delivered** – Order completed and closed  

This ensures accurate order tracking, admin control, and consistent state management.

---

## 🧰 Tech Stack

**Frontend**
- React (Vite)
- React Router
- Tailwind CSS
- Axios

**Backend**
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

**Infrastructure & Tools**
- Cloudinary (Image uploads)
- Stripe / Razorpay (Payments)
- Vercel (Frontend, Admin & Backend deployment)

---

## 🔐 Authentication & Authorization

- Implemented **JWT-based authentication**
- Protected routes using backend middleware
- Admin access validated via secure token verification
- Tokens passed via request headers for authorization

---

## ⚙️ Deployment & Production Challenges

This project is fully deployed on **Vercel (serverless)**.

### Key challenges solved:
- JWT tokens not being read correctly in production headers
- Admin login failures due to incorrect middleware token parsing
- Environment variable mismatches between local and Vercel
- CORS configuration for frontend–backend communication

✅ These issues were debugged using server-side logging and resolved by aligning frontend headers, backend middleware logic, and Vercel environment variables.

---


## 🧪 Environment Variables

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

ADMIN_EMAIL=admin_email
ADMIN_PASS=admin_password

CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret

STRIPE_SECRET_KEY=your_stripe_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret


cd backend
npm install
npm run server

cd frontend
npm install
npm run dev

cd admin
npm install
npm run dev


