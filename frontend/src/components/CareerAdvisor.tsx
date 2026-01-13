"use client";

import React, { useState } from 'react';
import { Sparkles, Loader2, BookOpen, Briefcase, GraduationCap, TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { generateCareerPath } from '@/lib/api';

interface CareerAdvisorProps {
    cvId: string;
}

const CareerAdvisor: React.FC<CareerAdvisorProps> = ({ cvId }) => {
    const [loading, setLoading] = useState(false);
    const [plan, setPlan] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await generateCareerPath(cvId);
            if (result.success && result.data) {
                setPlan(result.data);
            } else {
                setError(result.error || 'Failed to generate plan.');
            }
        } catch (err) {
            setError('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    // Helper to render markdown-like text with basic formatting
    const renderContent = (text: string) => {
        if (!text) return null;

        // Simple splitter for sections roughly based on markdown headers or bold text
        const lines = text.split('\n');
        return lines.map((line, index) => {
            if (line.trim().startsWith('**') || line.trim().startsWith('##')) {
                return <h3 key={index} className="text-lg font-semibold mt-4 mb-2 text-primary">{line.replace(/[*#]/g, '')}</h3>;
            }
            if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
                return <li key={index} className="ml-4 mb-1 text-sm list-disc">{line.replace(/^[-*]\s/, '')}</li>;
            }
            return <p key={index} className="mb-2 text-sm text-muted-foreground whitespace-pre-wrap">{line}</p>;
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="default" className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0">
                    <Sparkles className="h-4 w-4" />
                    Career Advisor
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl text-primary">
                        <TrendingUp className="h-6 w-6" />
                        AI Career Path Advisor
                    </DialogTitle>
                    <DialogDescription>
                        Get a personalized career roadmap based on your current CV.
                        Discover strengths, recommended roles, and a 5-year growth plan.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-hidden p-1">
                    {!plan && !loading && !error && (
                        <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                            <div className="p-4 rounded-full bg-primary/10">
                                <Sparkles className="h-12 w-12 text-primary animate-pulse" />
                            </div>
                            <h3 className="text-lg font-medium">Ready to Plan Your Future?</h3>
                            <p className="text-muted-foreground max-w-md">
                                Our AI will analyze your skills, experience, and education to build a custom career strategy.
                            </p>
                            <Button onClick={handleGenerate} size="lg" className="mt-4">
                                Generate Career Plan
                            </Button>
                        </div>
                    )}

                    {loading && (
                        <div className="flex flex-col items-center justify-center h-64 space-y-4">
                            <Loader2 className="h-10 w-10 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground animate-pulse">Analyzing your profile...</p>
                        </div>
                    )}

                    {error && (
                        <div className="flex flex-col items-center justify-center h-64 space-y-4 text-destructive">
                            <AlertCircle className="h-10 w-10" />
                            <p>{error}</p>
                            <Button variant="outline" onClick={handleGenerate}>Try Again</Button>
                        </div>
                    )}

                    {plan && (
                        <ScrollArea className="h-[60vh] pr-4 rounded-md border p-4 bg-card/50">
                            <div className="prose dark:prose-invert max-w-none">
                                {renderContent(plan)}
                            </div>
                        </ScrollArea>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CareerAdvisor;
