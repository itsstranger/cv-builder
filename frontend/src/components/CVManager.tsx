'use client';

import { useState, useEffect } from 'react';
import { getAllCVs, createCV, updateCV, deleteCV } from '@/lib/api';
import { ICV } from '@/models/CV';

export default function CVManager() {
    const [cvs, setCvs] = useState<ICV[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch all CVs on component mount
    useEffect(() => {
        fetchCVs();
    }, []);

    const fetchCVs = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllCVs();
            if (response.success && response.data) {
                setCvs(response.data);
            } else {
                setError(response.error || 'Failed to fetch CVs');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCV = async () => {
        const newCV = {
            personalInfo: {
                fullName: 'John Doe',
                email: 'john.doe@example.com',
                phone: '+1234567890',
                location: 'New York, USA',
                summary: 'Experienced software developer with 5+ years of experience',
            },
            education: [
                {
                    institution: 'University of Technology',
                    degree: 'Bachelor of Science',
                    field: 'Computer Science',
                    startDate: new Date('2015-09-01'),
                    endDate: new Date('2019-05-31'),
                    current: false,
                    gpa: '3.8',
                },
            ],
            experience: [
                {
                    company: 'Tech Corp',
                    position: 'Senior Developer',
                    location: 'San Francisco, CA',
                    startDate: new Date('2019-06-01'),
                    current: true,
                    description: 'Leading development of web applications',
                    achievements: [
                        'Improved application performance by 40%',
                        'Mentored 3 junior developers',
                    ],
                },
            ],
            projects: [
                {
                    name: 'E-commerce Platform',
                    description: 'Built a scalable e-commerce solution',
                    technologies: ['React', 'Node.js', 'MongoDB', 'AWS'],
                    url: 'https://example.com',
                },
            ],
            skills: [
                {
                    category: 'Programming Languages',
                    skills: ['JavaScript', 'TypeScript', 'Python', 'Java'],
                },
                {
                    category: 'Frameworks & Libraries',
                    skills: ['React', 'Next.js', 'Express', 'Django'],
                },
            ],
            certificates: [],
            languages: [
                { language: 'English', proficiency: 'Native' },
                { language: 'Spanish', proficiency: 'Intermediate' },
            ],
            template: 'modern-1',
        };

        const response = await createCV(newCV);
        if (response.success) {
            fetchCVs(); // Refresh the list
            alert('CV created successfully!');
        } else {
            alert(`Error: ${response.error}`);
        }
    };

    const handleUpdateCV = async (id: string) => {
        const response = await updateCV(id, {
            personalInfo: {
                fullName: 'Jane Doe (Updated)',
                email: 'jane.doe@example.com',
                phone: '+1234567890',
            },
        });

        if (response.success) {
            fetchCVs(); // Refresh the list
            alert('CV updated successfully!');
        } else {
            alert(`Error: ${response.error}`);
        }
    };

    const handleDeleteCV = async (id: string) => {
        if (!confirm('Are you sure you want to delete this CV?')) return;

        const response = await deleteCV(id);
        if (response.success) {
            fetchCVs(); // Refresh the list
            alert('CV deleted successfully!');
        } else {
            alert(`Error: ${response.error}`);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading CVs...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">CV Manager</h1>
                <button
                    onClick={handleCreateCV}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Create Sample CV
                </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {cvs.length === 0 ? (
                    <div className="col-span-full text-center text-gray-500 py-12">
                        No CVs found. Create one to get started!
                    </div>
                ) : (
                    cvs.map((cv) => (
                        <div
                            key={cv._id?.toString()}
                            className="border rounded-lg p-6 shadow-lg hover:shadow-xl transition"
                        >
                            <h2 className="text-xl font-semibold mb-2">
                                {cv.personalInfo.fullName}
                            </h2>
                            <p className="text-gray-600 mb-1">{cv.personalInfo.email}</p>
                            <p className="text-gray-600 mb-1">{cv.personalInfo.phone}</p>
                            {cv.personalInfo.location && (
                                <p className="text-gray-500 text-sm mb-4">
                                    {cv.personalInfo.location}
                                </p>
                            )}

                            <div className="mb-4">
                                <p className="text-sm text-gray-500">
                                    Template: <span className="font-medium">{cv.template}</span>
                                </p>
                                <p className="text-sm text-gray-500">
                                    Experience: {cv.experience?.length || 0} positions
                                </p>
                                <p className="text-sm text-gray-500">
                                    Education: {cv.education?.length || 0} entries
                                </p>
                                <p className="text-sm text-gray-500">
                                    Projects: {cv.projects?.length || 0} projects
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleUpdateCV(cv._id?.toString() || '')}
                                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm"
                                >
                                    Update
                                </button>
                                <button
                                    onClick={() => handleDeleteCV(cv._id?.toString() || '')}
                                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
