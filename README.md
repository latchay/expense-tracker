# Expense Tracker Mobile Application

A full-stack Expense Tracker mobile application built with React Native (Expo) and Node.js, featuring secure authentication, expense management, and backend integration using Supabase (PostgreSQL).

---

## 🚀 Features

- User Registration & Login
- JWT-based Authentication
- Add Expenses (amount, category, description)
- View Expenses in Dashboard
- Delete Expenses
- Total Expense Calculation
- Secure Backend APIs
- Responsive Mobile UI

---

## 🛠️ Tech Stack

### Frontend
- React Native (Expo)
- Expo Router
- AsyncStorage
- Fetch API

### Backend
- Node.js
- Express.js
- JWT Authentication
- Supabase (PostgreSQL)

### Database
- Supabase PostgreSQL

---

## 📱 Application Flow

1. User lands on Home Page
2. Login or Register
3. Redirected to Dashboard after authentication
4. Add expenses
5. View total expenses
6. Delete individual expenses
7. Logout securely

---

## 🔗 Live Deployment Links

### Frontend (Vercel)
https://expense-tracker-tau-gray.vercel.app/

### Backend (Render)
https://<your-backend-render-url>

### GitHub Repository
https://github.com/latchay/expense-tracker

---

## 📦 API Endpoints

### Authentication
- **POST** `/api/register` → Register new user
- **POST** `/api/login` → Login user

### User
- **GET** `/api/me` → Get logged-in user details

### Expenses
- **GET** `/api/expenses` → Get all expenses
- **POST** `/api/expenses` → Add a new expense
- **DELETE** `/api/expenses/:id` → Delete an expense

> All protected routes require:
JWT_Bearer<token>

---

## 🧪 Testing

- APIs tested using Postman
- Frontend tested on Web and Expo Go

---

## ⚙️ Environment Variables

### Backend `.env`
PORT=5000
JWT_SECRET=Your_jwt_secret
SUPABASE_URL=Your_supabase_url
SUPABASE_KEY=Your_supabase_key
DATABASE_URL=Your_supabase_postgress_connection_string


> ⚠️ `.env` and `node_modules` are excluded from GitHub for security.

---

## 🏗️ Project Setup

### Backend
```bash
cd backend
npm install
node server.js

FRONTEND

cd frontend
npm install
npm start

APK FILE

The APK file is generated using expo and google drive

AUTHOR:
Latchaya

