"use client";

import type { FC } from 'react';
import Image from 'next/image';
import type { CvData } from '@/lib/types';
import { Mail, Phone, Linkedin, Globe } from 'lucide-react';
import { Separator } from './ui/separator';

interface PreviewProps {
  cvData: CvData;
}

const Section: FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mb-6">
    <h2 className="text-xl font-headline text-primary mb-2 border-b-2 border-accent pb-1">{title}</h2>
    <div className="text-sm text-foreground/80">{children}</div>
  </section>
);

const Preview: FC<PreviewProps> = ({ cvData }) => {
  const { personalInfo, profile, education, skills, projects } = cvData;

  const renderWithLineBreaks = (text: string) => {
    return text.split('\n').map((line, index) => (
      <p key={index} className="mb-1">{line}</p>
    ));
  };

  return (
    <div
      id="cv-preview"
      className="bg-card shadow-2xl rounded-lg w-full aspect-[210/297] max-w-[800px] mx-auto p-8 md:p-12 text-foreground transform scale-[0.9] lg:scale-100 origin-top"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-headline text-primary">{personalInfo.name}</h1>
          <p className="text-lg text-foreground/80">{personalInfo.jobTitle}</p>
        </div>
        <div className="w-24 h-24 relative">
          <Image
            src={personalInfo.avatarUrl}
            alt={personalInfo.name}
            width={96}
            height={96}
            className="rounded-full object-cover border-4 border-primary/50"
            data-ai-hint="person portrait"
          />
        </div>
      </header>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-1">
          <Section title="Contact">
             <div className="space-y-2 text-xs">
                {personalInfo.email && <div className="flex items-center gap-2"><Mail className="size-3.5 shrink-0" /><span>{personalInfo.email}</span></div>}
                {personalInfo.phone && <div className="flex items-center gap-2"><Phone className="size-3.5 shrink-0" /><span>{personalInfo.phone}</span></div>}
                {personalInfo.linkedin && <div className="flex items-center gap-2"><Linkedin className="size-3.5 shrink-0" /><span>{personalInfo.linkedin}</span></div>}
             </div>
          </Section>

          <Section title="Education">
            <div className="text-xs">
                {renderWithLineBreaks(education)}
            </div>
          </Section>

          <Section title="Skills">
             <div className="flex flex-wrap gap-2 text-xs">
                {skills.split(',').map((skill, index) => (
                    <span key={index} className="bg-primary/10 text-primary-foreground-dark px-2 py-1 rounded-full">{skill.trim()}</span>
                ))}
             </div>
          </Section>
        </div>

        <div className="col-span-2">
            <Section title="Profile">
                <p className="text-sm">{profile}</p>
            </Section>
            <Section title="Projects">
                <div className="space-y-2 text-sm whitespace-pre-line">{projects}</div>
            </Section>
        </div>
      </div>
    </div>
  );
};

export default Preview;
