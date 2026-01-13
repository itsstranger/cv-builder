import { Request, Response } from 'express';

export interface CVTemplate {
    id: string;
    name: string;
    description: string;
    thumbnail: string;
    category: 'modern' | 'classic' | 'creative' | 'minimal';
    isPremium: boolean;
}

const templates: CVTemplate[] = [
    {
        id: 'modern-1',
        name: 'Modern Professional',
        description: 'Clean and modern design perfect for tech professionals',
        thumbnail: '/templates/modern-1.png',
        category: 'modern',
        isPremium: false,
    },
    {
        id: 'classic-1',
        name: 'Classic Executive',
        description: 'Traditional layout ideal for corporate positions',
        thumbnail: '/templates/classic-1.png',
        category: 'classic',
        isPremium: false,
    },
    {
        id: 'creative-1',
        name: 'Creative Designer',
        description: 'Bold and creative design for designers and artists',
        thumbnail: '/templates/creative-1.png',
        category: 'creative',
        isPremium: true,
    },
    {
        id: 'minimal-1',
        name: 'Minimal Elegance',
        description: 'Minimalist design with maximum impact',
        thumbnail: '/templates/minimal-1.png',
        category: 'minimal',
        isPremium: false,
    },
    {
        id: 'modern-2',
        name: 'Tech Innovator',
        description: 'Modern layout with tech-focused sections',
        thumbnail: '/templates/modern-2.png',
        category: 'modern',
        isPremium: true,
    },
    {
        id: 'creative-2',
        name: 'Portfolio Showcase',
        description: 'Perfect for showcasing creative work and projects',
        thumbnail: '/templates/creative-2.png',
        category: 'creative',
        isPremium: true,
    },
];

export const getAllTemplates = async (_req: Request, res: Response): Promise<void> => {
    try {
        res.status(200).json({ success: true, data: templates });
    } catch (error) {
        console.error('Error fetching templates:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch templates' });
    }
};
