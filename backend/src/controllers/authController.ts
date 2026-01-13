import { Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

// Generate JWT Token
const generateToken = (userId: string): string => {
    return jwt.sign({ userId }, JWT_SECRET as string, {
        expiresIn: JWT_EXPIRE as any,
    });
};

// Register new user
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, name } = req.body;

        // Validate input
        if (!email || !password || !name) {
            res.status(400).json({
                success: false,
                error: 'Please provide email, password, and name',
            });
            return;
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            res.status(400).json({
                success: false,
                error: 'User already exists with this email',
            });
            return;
        }

        // Create user
        const user = await User.create({
            email: email.toLowerCase(),
            password,
            name,
        });

        // Generate token
        const token = generateToken(user._id.toString());

        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                },
                token,
            },
            message: 'User registered successfully',
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ success: false, error: 'Failed to register user' });
    }
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            res.status(400).json({
                success: false,
                error: 'Please provide email and password',
            });
            return;
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user) {
            res.status(401).json({
                success: false,
                error: 'Invalid email or password',
            });
            return;
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                error: 'Invalid email or password',
            });
            return;
        }

        // Generate token
        const token = generateToken(user._id.toString());

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                },
                token,
            },
            message: 'Login successful',
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ success: false, error: 'Failed to login' });
    }
};

// Get current user
export const getMe = async (req: Request, res: Response): Promise<void> => {
    try {
        // req.user is set by auth middleware
        const user = await User.findById((req as any).user.userId);

        if (!user) {
            res.status(404).json({
                success: false,
                error: 'User not found',
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                },
            },
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch user' });
    }
};
