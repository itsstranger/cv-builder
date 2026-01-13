"use client";

import type { FC } from 'react';
import React, { useState, useEffect, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Loader2 } from 'lucide-react';

import type { CvData } from '@/lib/types';
import Editor from '@/components/editor';
import Preview from '@/components/preview';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { updateCV, getCVById, downloadCV } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { mapCVToData } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast'; // Assuming toast hook exists in ui/toast or similar. If not, simple alert or state. 
// I'll check imports for toast. If not sure, I'll use simple state.

interface EditorPageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditorPage: FC<EditorPageProps> = ({ params }) => {
  const { id } = use(params);
  const router = useRouter();
  const [cvData, setCvData] = useState<CvData | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { token } = useAuth();
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch CV from DB on mount
  useEffect(() => {
    const loadCv = async () => {
      if (!id || !token) return;
      try {
        const result = await getCVById(id);
        if (result.success && result.data) {
          const mappedData = mapCVToData(result.data);
          mappedData.id = id;
          setCvData(mappedData);
        } else {
          console.error('CV load error:', result.error);
        }
      } catch (err) {
        console.error('Failed to load CV', err);
      }
    };
    loadCv();
  }, [id, token]);

  // Strict Completion check
  useEffect(() => {
    if (!cvData) {
      setIsComplete(false);
      return;
    }

    const { personalInfo, profile, education, experience, skills } = cvData;

    // Check strict requirements
    const hasPersonalInfo =
      !!personalInfo?.name?.trim() &&
      !!personalInfo?.email?.trim() &&
      !!personalInfo?.phone?.trim();

    // Check if user has at least some content
    const hasContent = (!!profile && profile.trim().length > 10) ||
      (Array.isArray(education) && education.length > 0) ||
      (Array.isArray(experience) && experience.length > 0);

    // Require Personal Info + Some Content
    setIsComplete(hasPersonalInfo && hasContent);
  }, [cvData]);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadCV(id);
      alert('PDF Downloaded successfully!'); // Optional feedback
    } catch (error) {
      console.error('Download failed', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Auto-save to database (debounced)
  const autoSaveToDB = React.useCallback(async (cvToSave: CvData) => {
    if (!token) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        if (!cvToSave.personalInfo) return;

        const parseDate = (d?: string) => {
          if (!d) return new Date();
          const parsed = new Date(d);
          return isNaN(parsed.getTime()) ? new Date() : parsed;
        };

        const backendCv = {
          personalInfo: {
            fullName: cvToSave.personalInfo.name || '',
            email: cvToSave.personalInfo.email || '',
            phone: cvToSave.personalInfo.phone || '',
            jobTitle: cvToSave.personalInfo.jobTitle || '',
            linkedin: cvToSave.personalInfo.linkedin || '',
            avatarUrl: cvToSave.personalInfo.avatarUrl || '',
            summary: cvToSave.profile || '', // Map profile to summary
          },
          // profile field removed as it's not in schema
          experience: (cvToSave.experience || []).map(exp => ({
            company: exp.company || '',
            position: exp.jobTitle || '',
            description: exp.description || '',
            startDate: parseDate(exp.date?.split('-')[0]),
            endDate: exp.date?.includes('-') ? parseDate(exp.date.split('-')[1]) : undefined,
            current: exp.date?.toLowerCase().includes('present') || false,
          })),
          education: (cvToSave.education || []).map(edu => ({
            institution: edu.school || '',
            degree: edu.degree || '',
            field: 'Field',
            startDate: parseDate(edu.date?.split('-')[0]),
            endDate: edu.date?.includes('-') ? parseDate(edu.date.split('-')[1]) : undefined,
            current: false,
          })),
          skills: cvToSave.skills ? [{
            category: 'General',
            skills: cvToSave.skills.split(',').map(s => s.trim()).filter(Boolean),
          }] : [],
          projects: (cvToSave.projects || []).map(proj => ({
            name: proj.name || '',
            description: proj.description || '',
            technologies: [],
            startDate: new Date(),
          })),
          template: cvToSave.template || 'modern',
        };

        await updateCV(id, backendCv);

      } catch (error) {
        console.error('Auto-save error:', error);
      }
    }, 1000);
  }, [token, id]);

  const updateCvData: React.Dispatch<React.SetStateAction<CvData>> = (action) => {
    setCvData((prev) => {
      if (!prev) return null;
      const next = typeof action === 'function'
        ? (action as (prev: CvData) => CvData)(prev)
        : action;

      if (token) {
        autoSaveToDB(next);
      }
      return next;
    });
  };

  React.useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  if (!isClient || !cvData) {
    return (
      <div className="min-h-screen w-full bg-background relative overflow-hidden p-4 md:p-6">
        <header className="container mx-auto flex items-center justify-between p-4 md:p-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-36 rounded-full" />
        </header>
        <main className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          <div className="lg:col-span-5">
            <Skeleton className="h-[80vh] w-full rounded-lg" />
          </div>
          <div className="lg:col-span-7">
            <Skeleton className="h-[80vh] w-full aspect-[210/297] max-w-[800px] rounded-lg" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-accent/20 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

      <header className="p-4 md:p-6 backdrop-blur-sm sticky top-0 z-10 no-print">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => router.push('/')} className="rounded-full">
              Back to Dashboard
            </Button>
            <h1 className="text-2xl md:text-3xl font-headline text-foreground">
              {cvData.personalInfo?.name || 'Untitled CV'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {isComplete && (
              <Button onClick={handleDownload} disabled={isDownloading} className="rounded-full">
                {isDownloading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </>
                )}
              </Button>
            )}
            {!isComplete && (
              <Button disabled variant="ghost" className="rounded-full opacity-50 cursor-not-allowed">
                Complete CV to Download
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 no-print">
          <div className="p-1 rounded-lg bg-card/70 backdrop-blur-lg border border-border/20 shadow-lg sticky top-24">
            <Editor cvData={cvData} setCvData={updateCvData} />
          </div>
        </div>
        <div className="lg:col-span-7">
          <div id="cv-preview-container">
            <Preview cvData={cvData} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default EditorPage;
