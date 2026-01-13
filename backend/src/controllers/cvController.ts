import { Request, Response } from 'express';
import CV from '../models/CV';

// Get all CVs for the authenticated user
export const getAllCVs = async (req: Request, res: Response): Promise<void> => {
    try {
        // Get userId from authenticated user
        const userId = (req as any).user?.userId;
        
        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }

        const cvs = await CV.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: cvs });
    } catch (error) {
        console.error('Error fetching CVs:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch CVs' });
    }
};

// Get a single CV by ID
export const getCVById = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.userId;
        const { id } = req.params;

        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }

        const cv = await CV.findOne({ _id: id, userId });
        if (!cv) {
            res.status(404).json({ success: false, error: 'CV not found' });
            return;
        }

        res.status(200).json({ success: true, data: cv });
    } catch (error) {
        console.error('Error fetching CV:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch CV' });
    }
};

// Create a new CV
export const createCV = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.userId;
        
        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }

        const cvData = { ...req.body, userId };

        // Validate required fields
        if (!cvData.personalInfo || !cvData.personalInfo.fullName || !cvData.personalInfo.email) {
            res.status(400).json({
                success: false,
                error: 'Personal information (name and email) is required',
            });
            return;
        }

        const cv = await CV.create(cvData);
        res.status(201).json({
            success: true,
            data: cv,
            message: 'CV created successfully',
        });
    } catch (error) {
        console.error('Error creating CV:', error);
        res.status(500).json({ success: false, error: 'Failed to create CV' });
    }
};

// Update an existing CV
export const updateCV = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.userId;
        const { id } = req.params;
        const cvData = req.body;

        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }

        const cv = await CV.findOneAndUpdate(
            { _id: id, userId },
            cvData,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!cv) {
            res.status(404).json({ success: false, error: 'CV not found' });
            return;
        }

        res.status(200).json({
            success: true,
            data: cv,
            message: 'CV updated successfully',
        });
    } catch (error) {
        console.error('Error updating CV:', error);
        res.status(500).json({ success: false, error: 'Failed to update CV' });
    }
};

// Delete a CV
export const deleteCV = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.userId;
        const { id } = req.params;

        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }

        const cv = await CV.findOneAndDelete({ _id: id, userId });

        if (!cv) {
            res.status(404).json({ success: false, error: 'CV not found' });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'CV deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting CV:', error);
        res.status(500).json({ success: false, error: 'Failed to delete CV' });
    }
};
