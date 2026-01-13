"use client";

import type { FC } from 'react';
import type { CvData } from '@/lib/types';
import ClassicPreview from './templates/classic';
import ModernPreview from './templates/modern';

interface PreviewProps {
  cvData: CvData;
}

const Preview: FC<PreviewProps> = ({ cvData }) => {
  const { template = 'classic' } = cvData;

  const renderTemplate = () => {
    switch (template) {
      case 'modern':
        return <ModernPreview cvData={cvData} />;
      case 'classic':
      default:
        return <ClassicPreview cvData={cvData} />;
    }
  };

  return (
    <div
      id="cv-preview"
      className="bg-card shadow-2xl rounded-lg w-full aspect-[210/297] max-w-[800px] mx-auto text-foreground transform scale-[0.9] lg:scale-100 origin-top"
    >
      {renderTemplate()}
    </div>
  );
};

export default Preview;