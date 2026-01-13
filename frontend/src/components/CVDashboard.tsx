'use client';

import { useEffect } from 'react';
import { useCV } from '@/hooks/useCV';

export default function CVDashboard() {
    const {
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
    } = useCV();

    useEffect(() => {
        // Fetch all CVs when component mounts
        fetchAllCVs();
    }, [fetchAllCVs]);

    const handleCreateSampleCV = async () => {
        const success = await createNewCV({
            personalInfo: {
                fullName: 'Sample User',
                email: 'sample@example.com',
                phone: '+1234567890',
                location: 'San Francisco, CA',
                summary: 'Passionate software developer with expertise in full-stack development',
            },
            education: [
                {
                    institution: 'Tech University',
                    degree: 'Bachelor of Science',
                    field: 'Computer Science',
                    startDate: new Date('2016-09-01'),
                    endDate: new Date('2020-05-31'),
                    current: false,
                    gpa: '3.9',
                },
            ],
            experience: [
                {
                    company: 'Innovative Tech Co.',
                    position: 'Full Stack Developer',
                    location: 'San Francisco, CA',
                    startDate: new Date('2020-06-01'),
                    current: true,
                    description: 'Developing scalable web applications using modern technologies',
                    achievements: [
                        'Led migration to microservices architecture',
                        'Reduced API response time by 60%',
                        'Mentored 5 junior developers',
                    ],
                },
            ],
            projects: [
                {
                    name: 'Task Management App',
                    description: 'A collaborative task management platform with real-time updates',
                    technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
                    url: 'https://taskapp.example.com',
                    github: 'https://github.com/user/taskapp',
                },
            ],
            skills: [
                {
                    category: 'Frontend',
                    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
                },
                {
                    category: 'Backend',
                    skills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL'],
                },
                {
                    category: 'DevOps',
                    skills: ['Docker', 'AWS', 'CI/CD', 'Git'],
                },
            ],
            certificates: [
                {
                    name: 'AWS Certified Solutions Architect',
                    issuer: 'Amazon Web Services',
                    date: new Date('2023-03-15'),
                    url: 'https://aws.amazon.com/certification/',
                },
            ],
            languages: [
                { language: 'English', proficiency: 'Native' },
                { language: 'French', proficiency: 'Intermediate' },
            ],
            template: 'modern-1',
        });

        if (success) {
            alert('Sample CV created successfully!');
        }
    };

    const handleUpdate = async (id: string) => {
        const success = await updateExistingCV(id, {
            personalInfo: {
                fullName: 'Updated Name',
                email: 'updated@example.com',
                phone: '+1234567890',
            },
        });

        if (success) {
            alert('CV updated successfully!');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this CV?')) return;

        const success = await deleteExistingCV(id);
        if (success) {
            alert('CV deleted successfully!');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        CV Dashboard
                    </h1>
                    <p className="text-gray-600">
                        Manage your CVs with ease using the backend API
                    </p>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <svg
                                className="w-5 h-5 text-red-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="text-red-700">{error}</span>
                        </div>
                        <button
                            onClick={clearError}
                            className="text-red-500 hover:text-red-700"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="mb-8 flex gap-4">
                    <button
                        onClick={handleCreateSampleCV}
                        disabled={loading}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        {loading ? 'Creating...' : '+ Create Sample CV'}
                    </button>
                    <button
                        onClick={() => fetchAllCVs()}
                        disabled={loading}
                        className="bg-white text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 shadow"
                    >
                        {loading ? 'Refreshing...' : '🔄 Refresh'}
                    </button>
                </div>

                {/* Loading State */}
                {loading && cvs.length === 0 && (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                            <p className="text-gray-600">Loading CVs...</p>
                        </div>
                    </div>
                )}

                {/* CV Grid */}
                {!loading && cvs.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="text-6xl mb-4">📄</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No CVs Yet
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Create your first CV to get started!
                        </p>
                        <button
                            onClick={handleCreateSampleCV}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Create Sample CV
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {cvs.map((cv) => (
                            <div
                                key={cv._id?.toString()}
                                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                            >
                                {/* Card Header */}
                                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                                    <h2 className="text-2xl font-bold mb-1">
                                        {cv.personalInfo.fullName}
                                    </h2>
                                    <p className="text-blue-100 text-sm">
                                        {cv.personalInfo.email}
                                    </p>
                                </div>

                                {/* Card Body */}
                                <div className="p-6">
                                    <div className="space-y-2 mb-6">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <span className="text-lg">📞</span>
                                            <span className="text-sm">{cv.personalInfo.phone}</span>
                                        </div>
                                        {cv.personalInfo.location && (
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <span className="text-lg">📍</span>
                                                <span className="text-sm">
                                                    {cv.personalInfo.location}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {cv.experience?.length || 0}
                                            </div>
                                            <div className="text-xs text-gray-600">Experience</div>
                                        </div>
                                        <div className="bg-purple-50 rounded-lg p-3 text-center">
                                            <div className="text-2xl font-bold text-purple-600">
                                                {cv.projects?.length || 0}
                                            </div>
                                            <div className="text-xs text-gray-600">Projects</div>
                                        </div>
                                        <div className="bg-green-50 rounded-lg p-3 text-center">
                                            <div className="text-2xl font-bold text-green-600">
                                                {cv.education?.length || 0}
                                            </div>
                                            <div className="text-xs text-gray-600">Education</div>
                                        </div>
                                        <div className="bg-orange-50 rounded-lg p-3 text-center">
                                            <div className="text-2xl font-bold text-orange-600">
                                                {cv.skills?.length || 0}
                                            </div>
                                            <div className="text-xs text-gray-600">Skills</div>
                                        </div>
                                    </div>

                                    {/* Template Badge */}
                                    <div className="mb-4">
                                        <span className="inline-block bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                                            Template: {cv.template || 'default'}
                                        </span>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleUpdate(cv._id?.toString() || '')}
                                            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cv._id?.toString() || '')}
                                            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-medium"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
