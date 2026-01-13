// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// CV Interface (matching backend)
export interface ICV {
    _id?: string;
    userId?: string;
    personalInfo: {
        fullName: string;
        email: string;
        phone: string;
        location?: string;
        linkedin?: string;
        github?: string;
        website?: string;
        summary?: string;
    };
    education: Array<{
        institution: string;
        degree: string;
        field: string;
        startDate: Date | string;
        endDate?: Date | string;
        current: boolean;
        gpa?: string;
        description?: string;
    }>;
    experience: Array<{
        company: string;
        position: string;
        location?: string;
        startDate: Date | string;
        endDate?: Date | string;
        current: boolean;
        description: string;
        achievements?: string[];
    }>;
    projects: Array<{
        name: string;
        description: string;
        technologies: string[];
        url?: string;
        github?: string;
        startDate?: Date | string;
        endDate?: Date | string;
    }>;
    skills: Array<{
        category: string;
        skills: string[];
    }>;
    certificates: Array<{
        name: string;
        issuer: string;
        date: Date | string;
        url?: string;
        description?: string;
    }>;
    languages?: Array<{ language: string; proficiency: string }>;
    template?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

/**
 * Fetch all CVs or filter by userId
 */
export async function getAllCVs(userId?: string): Promise<ApiResponse<ICV[]>> {
    try {
        const url = userId ? `${API_BASE_URL}/cv?userId=${userId}` : `${API_BASE_URL}/cv`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching CVs:', error);
        return { success: false, error: 'Failed to fetch CVs' };
    }
}

/**
 * Fetch a single CV by ID
 */
export async function getCVById(id: string): Promise<ApiResponse<ICV>> {
    try {
        const response = await fetch(`${API_BASE_URL}/cv/${id}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching CV:', error);
        return { success: false, error: 'Failed to fetch CV' };
    }
}

/**
 * Create a new CV
 */
export async function createCV(cvData: Partial<ICV>): Promise<ApiResponse<ICV>> {
    try {
        const response = await fetch(`${API_BASE_URL}/cv`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cvData),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating CV:', error);
        return { success: false, error: 'Failed to create CV' };
    }
}

/**
 * Update an existing CV
 */
export async function updateCV(
    id: string,
    cvData: Partial<ICV>
): Promise<ApiResponse<ICV>> {
    try {
        const response = await fetch(`${API_BASE_URL}/cv/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cvData),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating CV:', error);
        return { success: false, error: 'Failed to update CV' };
    }
}

/**
 * Delete a CV
 */
export async function deleteCV(id: string): Promise<ApiResponse<null>> {
    try {
        const response = await fetch(`${API_BASE_URL}/cv/${id}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error deleting CV:', error);
        return { success: false, error: 'Failed to delete CV' };
    }
}

/**
 * Fetch all templates
 */
export async function getAllTemplates(): Promise<ApiResponse<any[]>> {
    try {
        const response = await fetch(`${API_BASE_URL}/templates`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching templates:', error);
        return { success: false, error: 'Failed to fetch templates' };
    }
}
