import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Extend Request interface to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
            };
        }
    }
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    try {
        // Get token from header or query
        const authHeader = req.headers.authorization;
        let token: string | undefined;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        } else if (req.query.token) {
            token = req.query.token as string;
        }

        if (!token) {
            res.status(401).json({
                success: false,
                error: 'No token provided. Please login first.',
            });
            return;
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

        // Attach user to request
        req.user = { userId: decoded.userId };

        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            error: 'Invalid or expired token. Please login again.',
        });
    }
};
