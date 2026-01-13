# CV Builder Backend

A standalone Express.js backend API for the CV Builder application with MongoDB integration.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)

### Installation

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Update .env with your MongoDB URI
```

### Running the Server

```bash
# Development mode (with hot reload)
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Type check
npm run typecheck
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Health Check
- **GET** `/health` - Check if API is running

### CV Management
- **GET** `/api/cv` - Get all CVs
- **GET** `/api/cv?userId={userId}` - Get CVs by user ID
- **GET** `/api/cv/:id` - Get specific CV by ID
- **POST** `/api/cv` - Create new CV
- **PUT** `/api/cv/:id` - Update CV
- **DELETE** `/api/cv/:id` - Delete CV

### Templates
- **GET** `/api/templates` - Get all CV templates

## 📝 Example Requests

### Create a CV
```bash
curl -X POST http://localhost:5000/api/cv \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

### Get All CVs
```bash
curl http://localhost:5000/api/cv
```

### Get CV by ID
```bash
curl http://localhost:5000/api/cv/{cv_id}
```

### Update CV
```bash
curl -X PUT http://localhost:5000/api/cv/{cv_id} \
  -H "Content-Type: application/json" \
  -d '{
    "personalInfo": {
      "fullName": "Jane Doe"
    }
  }'
```

### Delete CV
```bash
curl -X DELETE http://localhost:5000/api/cv/{cv_id}
```

## 🔧 Environment Variables

Create a `.env` file in the backend directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cv_maker
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:9002
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts       # MongoDB connection
│   ├── controllers/
│   │   ├── cvController.ts   # CV CRUD operations
│   │   └── templateController.ts
│   ├── models/
│   │   └── CV.ts             # Mongoose schema
│   ├── routes/
│   │   ├── cvRoutes.ts       # CV routes
│   │   └── templateRoutes.ts
│   └── server.ts             # Express app setup
├── dist/                     # Compiled JavaScript (generated)
├── .env                      # Environment variables
├── .gitignore
├── nodemon.json              # Nodemon config
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Tech Stack

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security headers
- **Morgan** - HTTP request logger

## 🔒 Security Features

- Helmet.js for security headers
- CORS configuration
- Input validation
- Error handling
- Environment variable protection

## 📊 Database Schema

See the CV model in `src/models/CV.ts` for the complete schema including:
- Personal Information
- Education
- Experience
- Projects
- Skills
- Certificates
- Languages

## 🧪 Testing

Test the API using:
- **Postman** - Import endpoints
- **cURL** - Command line
- **Thunder Client** - VS Code extension

## 🚢 Deployment

### Build for production
```bash
npm run build
```

### Deploy to services like:
- Heroku
- Railway
- Render
- DigitalOcean
- AWS EC2

### Environment Variables for Production
Make sure to set:
- `MONGODB_URI`
- `PORT`
- `NODE_ENV=production`
- `CORS_ORIGIN` (your frontend URL)

## 📝 License

ISC

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
