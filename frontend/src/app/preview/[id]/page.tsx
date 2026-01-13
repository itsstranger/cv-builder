"use client";

import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Download, Edit } from 'lucide-react';

import type { CvData } from '@/lib/types';
import Preview from '@/components/preview';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getCVById } from '@/lib/api';
import { mapCVToData } from '@/lib/utils';

interface PreviewPageProps {
  params: Promise<{
    id: string;
  }>;
}

const PreviewPage = ({ params }: PreviewPageProps) => {
  const { id } = React.use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [cvData, setCvData] = useState<CvData | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const fetchCV = async () => {
      if (!id) return;
      try {
        const result = await getCVById(id, token);
        if (result.success && result.data) {
          const mapped = mapCVToData(result.data);
          mapped.id = id;
          setCvData(mapped);
        } else {
          console.error("CV not found");
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchCV();
  }, [id, token]);

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
