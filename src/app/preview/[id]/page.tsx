
"use client";

import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Edit } from 'lucide-react';

import type { CvData } from '@/lib/types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import Preview from '@/components/preview';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface PreviewPageProps {
  params: {
    id: string;
  };
}

const PreviewPage: FC<PreviewPageProps> = ({ params: { id } }) => {
  const router = useRouter();
  const [cvs] = useLocalStorage<CvData[]>('cv-list', []);
  const [cvData, setCvData] = useState<CvData | null>(null);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    const currentCv = cvs.find(cv => cv.id === id);
    if (currentCv) {
      setCvData(currentCv);
    } else if (cvs.length > 0) {
      // router.push('/');
    }
  }, [id, cvs]);

  const handlePrint = () => {
    window.print();
  };

  if (!isClient || !cvData) {
    return (
       <div className="min-h-screen w-full bg-background p-4 md:p-6 flex items-center justify-center">
          <Skeleton className="h-[80vh] w-full aspect-[210/297] max-w-[800px] rounded-lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background/80 relative">
       <header className="p-4 md:p-6 backdrop-blur-sm sticky top-0 z-10 no-print">
        <div className="container mx-auto flex items-center justify-between">
            <Button variant="outline" onClick={() => router.push('/')} className="rounded-full">
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={() => router.push(`/editor/${id}`)} className="rounded-full">
                    <Edit />
                    Edit
                </Button>
                <Button onClick={handlePrint} className="rounded-full">
                    <Download />
                    Download PDF
                </Button>
            </div>
        </div>
      </header>
      <main className="p-4 md:p-6">
          <div id="cv-preview-container">
             <Preview cvData={cvData} />
          </div>
      </main>
    </div>
  );
}

export default PreviewPage;
