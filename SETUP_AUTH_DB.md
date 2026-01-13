# Authentication & Database Setup Guide

## ✅ What's Been Implemented

### Backend (JWT Authentication)
1. **User Model** (`backend/src/models/User.ts`)
   - Email, password (hashed with bcrypt), name
   - Password comparison method

2. **Authentication Controller** (`backend/src/controllers/authController.ts`)
   - `/api/auth/register` - Register new user
   - `/api/auth/login` - Login user
   - `/api/auth/me` - Get current user (protected)

3. **JWT Middleware** (`backend/src/middleware/auth.ts`)
   - Validates JWT tokens
   - Attaches user info to requests

4. **Protected CV Routes**
   - All CV operations now require authentication
   - CVs are automatically linked to the authenticated user

### Frontend (Auto-save & Auth)
1. **Auth Context** (`frontend/src/contexts/AuthContext.tsx`)
   - Manages user state and JWT tokens
   - Login/Register functions
   - Token stored in localStorage

2. **Auto-save to Database**
   - Automatically saves CV changes to DB after 1 second of inactivity
   - Works silently in the background
   - Only saves when user is authenticated

3. **Login/Register Pages**
   - `/login` - User login page
   - `/register` - User registration page

## 🔧 Configuration Required

### 1. Backend Environment Variables

Create `backend/.env` file:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
CORS_ORIGIN=http://localhost:9002
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
```

**Important:** Change `JWT_SECRET` to a strong random string in production!

### 2. Frontend Environment Variables

Create `frontend/.env.local` file:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

### 3. MongoDB Setup

Make sure your MongoDB connection string is correct in `backend/.env`:
- Local MongoDB: `mongodb://127.0.0.1:27017/cv-builder`
- MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/cv-builder`

## 🚀 How to Use

### 1. Start Backend
```powershell
cd backend
npm run dev
```

### 2. Start Frontend
```powershell
cd frontend
npm run dev
```

### 3. Register/Login
- Go to `http://localhost:9002/register` to create an account
- Or go to `http://localhost:9002/login` if you already have an account
- After login, you'll be redirected to the dashboard

### 4. Auto-save
- Once logged in, any changes you make in the CV editor will automatically save to the database
- Saves happen 1 second after you stop typing (debounced)
- No loading states shown - it works silently in the background

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### CV Operations (All require authentication)
- `GET /api/cv` - Get all CVs for current user
- `GET /api/cv/:id` - Get single CV
- `POST /api/cv` - Create new CV
- `PUT /api/cv/:id` - Update CV
- `DELETE /api/cv/:id` - Delete CV

All CV endpoints require `Authorization: Bearer <token>` header.

## 🔒 Security Notes

1. **JWT Secret**: Use a strong, random string for `JWT_SECRET` in production
2. **Password Hashing**: Passwords are automatically hashed with bcrypt before saving
3. **Token Storage**: Tokens are stored in localStorage (consider httpOnly cookies for production)
4. **CORS**: Make sure `CORS_ORIGIN` matches your frontend URL

## 🐛 Troubleshooting

### "Unauthorized" errors
- Make sure you're logged in
- Check that the JWT token is being sent in the Authorization header
- Verify `JWT_SECRET` matches between token creation and verification

### Auto-save not working
- Check browser console for errors
- Verify you're logged in (check localStorage for `auth_token`)
- Make sure backend is running and accessible
- Check `NEXT_PUBLIC_BACKEND_URL` is set correctly

### Database connection issues
- Verify MongoDB is running (if local)
- Check `MONGODB_URI` in backend `.env` file
- Ensure network access if using MongoDB Atlas
