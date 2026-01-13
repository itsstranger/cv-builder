import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/database';
import cvRoutes from './routes/cvRoutes';
import templateRoutes from './routes/templateRoutes';
import authRoutes from './routes/authRoutes';
import aiRoutes from './routes/aiRoutes';
import pdfRoutes from './routes/pdfRoutes';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
    origin: [
        'http://localhost:9002',
        'http://127.0.0.1:9002',
        'http://localhost:3000',
        process.env.CORS_ORIGIN || 'http://localhost:9002'
    ],
    credentials: true,
}));
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/pdf', pdfRoutes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    // Touch req so TypeScript doesn't complain about it being unused
    const requestPath = req.path;

    res.status(200).json({
        success: true,
        message: 'CV Builder API is running',
        path: requestPath,
        timestamp: new Date().toISOString(),
    });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
    const userAgent = req.headers['user-agent'];

    res.status(200).json({
        success: true,
        message: 'Welcome to CV Builder API',
        version: '1.0.0',
        userAgent,
        endpoints: {
            cv: '/api/cv',
            templates: '/api/templates',
            health: '/health',
        },
    });
});

// 404 handler
app.use((req: Request, res: Response) => {
    const method = req.method;
    const url = req.originalUrl || req.url;

    res.status(404).json({
        success: false,
        error: 'Route not found',
        method,
        url,
    });
});

// Error handler
app.use((err: Error, req: Request, res: Response) => {
    const method = req.method;
    const url = req.originalUrl || req.url;

    console.error('Error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        method,
        url,
        message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📍 API URL: http://localhost:${PORT}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

export default app;
// Trigger restart for env update
