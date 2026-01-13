# CV Builder Backend Documentation

## Overview
This backend provides a complete REST API for managing CV (Curriculum Vitae) data using MongoDB and Next.js API routes.

## Database Connection
- **Database**: MongoDB Atlas
- **Connection String**: Stored in `.env.local`
- **Database Name**: `cv_maker`

## Environment Setup

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb+srv://rizvan:nfcbusiness@cluster0.23xn1ay.mongodb.net/cv_maker
```

## Data Models

### CV Schema
The CV model includes the following sections:

- **Personal Information**: Name, email, phone, location, social links, summary
- **Education**: Institution, degree, field, dates, GPA, description
- **Experience**: Company, position, location, dates, description, achievements
- **Projects**: Name, description, technologies, URLs, dates
- **Skills**: Categorized skills (e.g., Programming, Languages, Tools)
- **Certificates**: Name, issuer, date, URL, description
- **Languages**: Language and proficiency level
- **Template**: Selected CV template

## API Endpoints

### CV Management

#### GET `/api/cv`
Fetch all CVs or filter by parameters

**Query Parameters:**
- `id` (optional): Get a specific CV by ID
- `userId` (optional): Get all CVs for a specific user

**Response:**
```json
{
  "success": true,
  "data": [...]
}
```

#### POST `/api/cv`
Create a new CV

**Request Body:**
```json
{
  "userId": "user123",
  "personalInfo": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "location": "New York, USA",
    "linkedin": "linkedin.com/in/johndoe",
    "github": "github.com/johndoe",
    "summary": "Experienced software developer..."
  },
  "education": [
    {
      "institution": "University Name",
      "degree": "Bachelor of Science",
      "field": "Computer Science",
      "startDate": "2018-09-01",
      "endDate": "2022-05-31",
      "current": false,
      "gpa": "3.8"
    }
  ],
  "experience": [
    {
      "company": "Tech Company",
      "position": "Software Engineer",
      "location": "San Francisco, CA",
      "startDate": "2022-06-01",
      "current": true,
      "description": "Developed web applications...",
      "achievements": [
        "Improved performance by 40%",
        "Led team of 5 developers"
      ]
    }
  ],
  "projects": [
    {
      "name": "E-commerce Platform",
      "description": "Built a full-stack e-commerce solution",
      "technologies": ["React", "Node.js", "MongoDB"],
      "url": "https://example.com",
      "github": "https://github.com/johndoe/project"
    }
  ],
  "skills": [
    {
      "category": "Programming Languages",
      "skills": ["JavaScript", "TypeScript", "Python"]
    },
    {
      "category": "Frameworks",
      "skills": ["React", "Next.js", "Express"]
    }
  ],
  "certificates": [
    {
      "name": "AWS Certified Developer",
      "issuer": "Amazon Web Services",
      "date": "2023-01-15",
      "url": "https://aws.amazon.com/certification/"
    }
  ],
  "languages": [
    {
      "language": "English",
      "proficiency": "Native"
    },
    {
      "language": "Spanish",
      "proficiency": "Intermediate"
    }
  ],
  "template": "modern-1"
}
```

**Response:**
```json
{
  "success": true,
  "data": {...},
  "message": "CV created successfully"
}
```

#### PUT `/api/cv?id={cvId}`
Update an existing CV

**Query Parameters:**
- `id` (required): CV ID to update

**Request Body:** Same as POST (partial updates supported)

**Response:**
```json
{
  "success": true,
  "data": {...},
  "message": "CV updated successfully"
}
```

#### DELETE `/api/cv?id={cvId}`
Delete a CV

**Query Parameters:**
- `id` (required): CV ID to delete

**Response:**
```json
{
  "success": true,
  "message": "CV deleted successfully"
}
```

### Templates

#### GET `/api/templates`
Get all available CV templates

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "modern-1",
      "name": "Modern Professional",
      "description": "Clean and modern design perfect for tech professionals",
      "thumbnail": "/templates/modern-1.png",
      "category": "modern",
      "isPremium": false
    }
  ]
}
```

## Frontend Integration

### Using the API Utility Functions

```typescript
import { getAllCVs, getCVById, createCV, updateCV, deleteCV } from '@/lib/api';

// Get all CVs for a user
const response = await getAllCVs('user123');
if (response.success) {
  console.log(response.data);
}

// Get a specific CV
const cv = await getCVById('cv_id_here');

// Create a new CV
const newCV = await createCV({
  personalInfo: {
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890'
  },
  education: [],
  experience: [],
  projects: [],
  skills: [],
  certificates: []
});

// Update a CV
const updated = await updateCV('cv_id_here', {
  personalInfo: {
    fullName: 'Jane Doe'
  }
});

// Delete a CV
const deleted = await deleteCV('cv_id_here');
```

## Database Indexes

The following indexes are created for optimal query performance:
- `userId`: For filtering CVs by user
- `personalInfo.email`: For searching by email
- `createdAt`: For sorting by creation date

## Error Handling

All API endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message here"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `404`: Not Found
- `500`: Internal Server Error

## Development

### Running the Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:9002/api`

### Testing the API

You can test the API using tools like:
- **Postman**: Import the endpoints and test
- **cURL**: Command-line testing
- **Thunder Client**: VS Code extension

Example cURL command:
```bash
curl -X POST http://localhost:9002/api/cv \
  -H "Content-Type: application/json" \
  -d '{
    "personalInfo": {
      "fullName": "Test User",
      "email": "test@example.com",
      "phone": "+1234567890"
    }
  }'
```

## Security Considerations

1. **Environment Variables**: Never commit `.env.local` to version control
2. **Input Validation**: All inputs are validated before database operations
3. **Error Messages**: Sensitive information is not exposed in error messages
4. **Connection Pooling**: MongoDB connections are cached for performance

## Future Enhancements

Potential improvements:
- [ ] User authentication and authorization
- [ ] File upload for profile pictures
- [ ] PDF generation from CV data
- [ ] Email sharing functionality
- [ ] CV analytics and tracking
- [ ] Rate limiting for API endpoints
- [ ] Webhook support for CV updates

## Support

For issues or questions, please refer to the main project documentation.
