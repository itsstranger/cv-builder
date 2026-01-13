'use client';

import { useState, useCallback } from 'react';
import { ICV } from '@/models/CV';
import { getAllCVs, getCVById, createCV, updateCV, deleteCV } from '@/lib/api';

interface UseCVReturn {
    cvs: ICV[];
    currentCV: ICV | null;
    loading: boolean;
    error: string | null;
    fetchAllCVs: (userId?: string) => Promise<void>;
    fetchCVById: (id: string) => Promise<void>;
    createNewCV: (cvData: Partial<ICV>) => Promise<boolean>;
    updateExistingCV: (id: string, cvData: Partial<ICV>) => Promise<boolean>;
    deleteExistingCV: (id: string) => Promise<boolean>;
    clearError: () => void;
}

/**
 * Custom React hook for managing CV operations
 * Provides state management and CRUD operations for CVs
 */
export function useCV(): UseCVReturn {
    const [cvs, setCvs] = useState<ICV[]>([]);
    const [currentCV, setCurrentCV] = useState<ICV | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const fetchAllCVs = useCallback(async (userId?: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllCVs(userId);
            if (response.success && response.data) {
                setCvs(response.data);
            } else {
                setError(response.error || 'Failed to fetch CVs');
            }
        } catch (err) {
            setError('An unexpected error occurred while fetching CVs');
            console.error('Error fetching CVs:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCVById = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getCVById(id);
            if (response.success && response.data) {
                setCurrentCV(response.data);
            } else {
                setError(response.error || 'Failed to fetch CV');
            }
        } catch (err) {
            setError('An unexpected error occurred while fetching CV');
            console.error('Error fetching CV:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const createNewCV = useCallback(async (cvData: Partial<ICV>): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const response = await createCV(cvData);
            if (response.success && response.data) {
                setCvs((prev) => [response.data!, ...prev]);
                setCurrentCV(response.data);
                return true;
            } else {
                setError(response.error || 'Failed to create CV');
                return false;
            }
        } catch (err) {
            setError('An unexpected error occurred while creating CV');
            console.error('Error creating CV:', err);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateExistingCV = useCallback(
        async (id: string, cvData: Partial<ICV>): Promise<boolean> => {
            setLoading(true);
            setError(null);
            try {
                const response = await updateCV(id, cvData);
                if (response.success && response.data) {
                    setCvs((prev) =>
                        prev.map((cv) => (cv._id?.toString() === id ? response.data! : cv))
                    );
                    if (currentCV?._id?.toString() === id) {
                        setCurrentCV(response.data);
                    }
                    return true;
                } else {
                    setError(response.error || 'Failed to update CV');
                    return false;
                }
            } catch (err) {
                setError('An unexpected error occurred while updating CV');
                console.error('Error updating CV:', err);
                return false;
            } finally {
                setLoading(false);
            }
        },
        [currentCV]
    );

    const deleteExistingCV = useCallback(
        async (id: string): Promise<boolean> => {
            setLoading(true);
            setError(null);
            try {
                const response = await deleteCV(id);
                if (response.success) {
                    setCvs((prev) => prev.filter((cv) => cv._id?.toString() !== id));
                    if (currentCV?._id?.toString() === id) {
                        setCurrentCV(null);
                    }
                    return true;
                } else {
                    setError(response.error || 'Failed to delete CV');
                    return false;
                }
            } catch (err) {
                setError('An unexpected error occurred while deleting CV');
                console.error('Error deleting CV:', err);
                return false;
            } finally {
                setLoading(false);
            }
        },
        [currentCV]
    );

    return {
        cvs,
        currentCV,
        loading,
        error,
        fetchAllCVs,
        fetchCVById,
        createNewCV,
        updateExistingCV,
        deleteExistingCV,
        clearError,
    };
}
