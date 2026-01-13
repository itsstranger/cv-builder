# Backend Setup - Quick Start Guide

## ✅ What's Been Set Up

Your CV Builder backend is now fully configured with:

1. **MongoDB Connection** (`src/lib/mongodb.ts`)
   - Connection pooling for optimal performance
   - Automatic reconnection handling
   - Environment variable configuration

2. **Data Models** (`src/models/CV.ts`)
   - Complete CV schema with TypeScript types
   - Sections: Personal Info, Education, Experience, Projects, Skills, Certificates, Languages
   - Database indexes for performance

3. **API Routes** (`src/app/api/`)
   - `/api/cv` - Full CRUD operations for CVs
   - `/api/templates` - CV template management
   - Proper error handling and validation

4. **Frontend Utilities** (`src/lib/api.ts`)
   - Type-safe API functions
   - Easy-to-use wrapper functions for all endpoints

5. **Sample Component** (`src/components/CVManager.tsx`)
   - Demonstrates all CRUD operations
   - Ready to use or customize

## 🚀 Getting Started

### 1. Environment Setup
The `.env.local` file has been created with your MongoDB connection string:
```
MONGODB_URI=mongodb+srv://rizvan:nfcbusiness@cluster0.23xn1ay.mongodb.net/cv_maker
```

### 2. Start the Development Server
```bash
npm run dev
```

Your app will be available at: `http://localhost:9002`

### 3. Test the API

#### Using the Sample Component
Add the CVManager component to any page:

```tsx
import CVManager from '@/components/CVManager';

export default function TestPage() {
  return <CVManager />;
}
```

#### Using API Directly
```typescript
import { createCV, getAllCVs } from '@/lib/api';

// Create a CV
const response = await createCV({
  personalInfo: {
    fullName: 'Your Name',
    email: 'your.email@example.com',
    phone: '+1234567890'
  },
  education: [],
  experience: [],
  projects: [],
  skills: [],
  certificates: []
});

// Get all CVs
const cvs = await getAllCVs();
```

## 📡 API Endpoints

### CV Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cv` | Get all CVs |
| GET | `/api/cv?id={id}` | Get specific CV |
| GET | `/api/cv?userId={userId}` | Get user's CVs |
| POST | `/api/cv` | Create new CV |
| PUT | `/api/cv?id={id}` | Update CV |
| DELETE | `/api/cv?id={id}` | Delete CV |

### Templates

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/templates` | Get all templates |

## 🧪 Testing the Backend

### Using cURL

**Create a CV:**
```bash
curl -X POST http://localhost:9002/api/cv \
  -H "Content-Type: application/json" \
  -d '{
    "personalInfo": {
      "fullName": "Test User",
      "email": "test@example.com",
      "phone": "+1234567890"
    },
    "education": [],
    "experience": [],
    "projects": [],
    "skills": [],
    "certificates": []
  }'
```

**Get all CVs:**
```bash
curl http://localhost:9002/api/cv
```

### Using Browser
Simply navigate to:
- `http://localhost:9002/api/cv` - View all CVs
- `http://localhost:9002/api/templates` - View templates

## 📊 Data Structure

### Minimal CV Example
```json
{
  "personalInfo": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  },
  "education": [],
  "experience": [],
  "projects": [],
  "skills": [],
  "certificates": []
}
```

### Complete CV Example
See `docs/BACKEND.md` for a full example with all fields.

## 🔧 Common Tasks

### Add a New CV Field
1. Update the interface in `src/models/CV.ts`
2. Update the schema in the same file
3. TypeScript will automatically enforce the new field

### Create Custom API Endpoint
1. Create a new file in `src/app/api/[endpoint-name]/route.ts`
2. Export GET, POST, PUT, or DELETE functions
3. Use the `connectDB()` utility to access the database

### Query CVs with Custom Filters
```typescript
import connectDB from '@/lib/mongodb';
import CV from '@/models/CV';

await connectDB();
const cvs = await CV.find({ 
  'personalInfo.location': 'New York' 
}).sort({ createdAt: -1 });
```

## 🐛 Troubleshooting

### Connection Issues
- Verify `.env.local` exists and contains the MongoDB URI
- Check your MongoDB Atlas network access settings
- Ensure your IP is whitelisted in MongoDB Atlas

### API Not Working
- Make sure the dev server is running (`npm run dev`)
- Check the browser console for errors
- Verify the API route path is correct

### TypeScript Errors
- Run `npm run typecheck` to see all type errors
- Ensure all required fields are provided when creating/updating CVs

## 📚 Next Steps

1. **Add Authentication**: Implement user authentication to associate CVs with users
2. **PDF Generation**: Add PDF export functionality
3. **File Uploads**: Integrate Cloudinary or AWS S3 for profile pictures
4. **Email Features**: Add CV sharing via email
5. **Analytics**: Track CV views and downloads

## 📖 Documentation

For detailed API documentation, see: `docs/BACKEND.md`

## 🎉 You're All Set!

Your backend is ready to use. Start building your CV builder frontend and integrate with these APIs!
