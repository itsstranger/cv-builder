
"use client";

import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Download, FileText } from 'lucide-react';

import type { CvData } from '@/lib/types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import Editor from '@/components/editor';
import Preview from '@/components/preview';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface EditorPageProps {
  params: {
    id: string;
  };
}

const EditorPage: FC<EditorPageProps> = ({ params }) => {
  const router = useRouter();
  const [cvs, setCvs] = useLocalStorage<CvData[]>('cv-list', []);
  const [cvData, setCvData] = useState<CvData | null>(null);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    const currentCv = cvs.find(cv => cv.id === params.id);
    if (currentCv) {
      setCvData(currentCv);
    } else if (cvs.length > 0) {
      // If no CV is found, redirect or handle appropriately
      // For now, let's just use the first one if it exists
      // router.push('/'); 
    }
  }, [params.id, cvs, router]);

  const updateCvData = (updatedCv: CvData) => {
    setCvData(updatedCv);
    setCvs(prevCvs => 
      prevCvs.map(cv => (cv.id === params.id ? updatedCv : cv))
    );
  };

  const handlePrint = () => {
    window.print();
  };

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
              {cvData.name}
            </h1>
          </div>
          <Button onClick={handlePrint} className="rounded-full">
            <Download />
            Download PDF
          </Button>
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
