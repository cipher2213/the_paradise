# Paradise Cafe

A full-stack web application for Paradise Cafe, featuring a modern event landing page, online menu, order management, user authentication (Google & admin), real-time admin dashboard, and visitor analytics.

---

## 🌟 Features

- **Modern Landing Page:** Beautiful, responsive homepage built with Next.js, Tailwind CSS, and Material Tailwind.
- **Online Menu & Ordering:** Customers can browse the menu and place orders from any device.
- **User Authentication:** Google OAuth for users, secure admin login for staff.
- **Admin Dashboard:** Real-time stats, order management, user management, and visitor analytics.
- **Order History:** Users and admins can view past orders.
- **Visitor Tracking:** Unique visitor count tracked and displayed.
- **Mobile Friendly:** Fully responsive design.
- **Tech Stack:** Next.js, React, Tailwind CSS, Material Tailwind, Express, MongoDB, Mongoose, NextAuth.

---

## 🗂️ Project Structure

```
paradise/
  backend/         # Express + MongoDB API
    models/        # Mongoose models (User, Order, Visitor, etc.)
    routes/        # API routes (orders, users, admin, etc.)
    middleware/    # Custom middleware (visitor tracking, uploads)
    server.js      # Express app entry point
    ...
  frontend/        # Next.js app (UI, SSR, API routes)
    src/
      app/         # Next.js app directory (pages, layouts, API)
      components/  # Reusable React components
      models/      # Mongoose models for API routes
      lib/         # DB connection utility
    ...
```

---

## 🚀 Getting Started

### 1. **Clone the Repository**

```bash
git clone https://github.com/yourusername/paradise-cafe.git
cd paradise-cafe
```

### 2. **Set Up the Backend**

```bash
cd backend
npm install
```

- Create a `.env` file in `/backend` with:

  ```
  MONGODB_URI=your_mongodb_connection_string
  PORT=5000
  ```

- Start the backend server:
  ```bash
  npm start
  ```

### 3. **Set Up the Frontend**

```bash
cd ../frontend
npm install
```

- Create a `.env.local` file in `/frontend` with:

  ```
  NEXT_PUBLIC_API_URL=http://localhost:5000
  MONGODB_URI=your_mongodb_connection_string
  GOOGLE_CLIENT_ID=your_google_client_id
  GOOGLE_CLIENT_SECRET=your_google_client_secret
  NEXTAUTH_SECRET=your_nextauth_secret
  ```

- Start the frontend dev server:

  ```bash
  npm run dev
  ```

- Visit [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Backend API Overview

- **/api/orders**: Place and manage orders
- **/api/users**: User management
- **/api/admin/stats**: Dashboard stats (orders, revenue, visitors, etc.)
- **/api/admin/users**: Admin user management
- **/api/menu**: Menu management

---

## 🔒 Authentication

- **Google Sign-In:** Users can sign in with Google (NextAuth).
- **Admin Login:** Use the credentials set in the backend for admin access.

---

## 📊 Admin Dashboard

- **Live Stats:** Total orders, pending orders, revenue, active users, total visitors.
- **Order Management:** View, complete, or cancel orders in real time.
- **User Management:** View all users, their order history, and total spent.
- **Visitor Analytics:** See total unique visitors.

---

## 🌐 Deployment

- **Frontend:** Deploy on Vercel, Netlify, or any Node.js host.
- **Backend:** Deploy on Render, Railway, Heroku, or any Node.js server.
- **MongoDB:** Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for cloud hosting.

**Environment Variables:**  
Set all secrets and connection strings in your deployment dashboard.

---

## 📝 Customization

- **Branding:** Update images, colors, and text in `/frontend/src/app/hero.tsx` and other components.
- **Menu:** Manage menu items via the admin dashboard or directly in the database.
- **Analytics:** Visitor tracking is built-in; you can add Google Analytics or similar if needed.

---

## 🤝 Credits

- UI Template: [Creative Tim - NextJS Tailwind Event Landing Page](https://www.creative-tim.com/product/nextjs-tailwind-event-landing-page)
- Backend: Custom Express/MongoDB API

---

## 📄 License

This project is for educational and demonstration purposes.  
For commercial use, please check the licenses of all dependencies and templates.

---

## 💬 Support

For issues, open a GitHub issue or contact the maintainer.
