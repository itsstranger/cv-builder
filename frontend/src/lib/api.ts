import { ICV } from '@/models/CV';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
const API_BASE_URL = `${BACKEND_URL}/api/cv`;
const AI_API_URL = `${BACKEND_URL}/api/ai`;

// Get auth token from localStorage
const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('auth_token');
    }
    return null;
};

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

/**
 * Fetch all CVs or filter by userId
 */
export async function getAllCVs(): Promise<ApiResponse<ICV[]>> {
    try {
        const token = getAuthToken();
        const response = await fetch(API_BASE_URL, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
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
/**
 * Fetch a single CV by ID
 */
export async function getCVById(id: string, tokenOverride?: string | null): Promise<ApiResponse<ICV>> {
    try {
        const token = tokenOverride || getAuthToken();
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching CV:', error);
        return { success: false, error: 'Failed to fetch CV' };
    }
}

/**
 * Download CV as PDF
 */
export async function downloadCV(id: string): Promise<void> {
    try {
        const token = getAuthToken();
        const url = `${BACKEND_URL}/api/pdf/${id}?token=${token}`;

        // Trigger download via hidden link
        const a = document.createElement('a');
        a.href = url;
        a.download = `cv-${id}.pdf`; // Browser might prioritize Content-Disposition
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Return resolved (we can't easily track success of direct link download without extra logic, but this is standard)
        return Promise.resolve();
    } catch (error) {
        console.error('Error initiating download:', error);
        throw error;
    }
}

/**
 * Create a new CV
 */
export async function createCV(cvData: Partial<ICV>): Promise<ApiResponse<ICV>> {
    try {
        const token = getAuthToken();
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
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
        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
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
        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error deleting CV:', error);
        return { success: false, error: 'Failed to delete CV' };
    }
}

/**
 * Generate Career Path
 */
export async function generateCareerPath(cvId: string): Promise<ApiResponse<string>> {
    try {
        const token = getAuthToken();
        const response = await fetch(`${AI_API_URL}/career-path`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cvId }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error generating career path:', error);
        return { success: false, error: 'Failed to generate career path' };
    }
}
