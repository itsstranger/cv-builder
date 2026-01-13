import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import CV from '../models/CV';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const generateCareerPath = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.userId;
        const { cvId } = req.body;

        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }

        if (!process.env.GEMINI_API_KEY) {
            res.status(500).json({ success: false, error: 'Gemini API Key is missing in backend configuration.' });
            return;
        }

        // Fetch CV Data
        const cv = await CV.findOne({ _id: cvId, userId });
        if (!cv) {
            res.status(404).json({ success: false, error: 'CV not found' });
            return;
        }

        // Construct Prompt
        const cvContext = JSON.stringify({
            skills: cv.skills,
            experience: cv.experience,
            education: cv.education,
            projects: cv.projects,
            summary: cv.personalInfo.summary,
            jobTitle: cv.personalInfo.jobTitle
        });

        const prompt = `
        You are an expert Career Advisor AI.
        Analyze the following CV data provided in JSON format:
        ${cvContext}

        Based on this data, generate a comprehensive Career Path Plan.
        The response MUST be in Markdown format.
        Include:
        1. **Current Profile Analysis**: Strengths and key skills.
        2. **Recommended Roles**: Job titles to target now and in the future.
        3. **Gap Analysis**: Missing skills or areas for improvement.
        4. **5-Year Career Roadmap**: Year-by-year actionable steps.
        5. **Learning Path**: specific technologies or certifications to acquire.

        Keep the tone professional yet encouraging.
        `;

        // Generate Content
        // Use a model safe for text. 'gemini-pro' is standard.
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({
            success: true,
            data: text
        });

    } catch (error: any) {
        console.error('AI Generation Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to generate career path'
        });
    }
};
