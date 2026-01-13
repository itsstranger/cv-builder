
"use client";

import type { FC } from 'react';
import Image from 'next/image';
import type { CvData } from '@/lib/types';
import { Mail, Phone, Linkedin, Briefcase, GraduationCap, Wrench, Lightbulb, User } from 'lucide-react';

interface PreviewProps {
  cvData: CvData;
}

const Section: FC<{ title: string; children: React.ReactNode, icon: React.ReactNode }> = ({ title, icon, children }) => (
  <section className="mb-6">
    <h2 className="text-lg font-bold text-primary mb-3 flex items-center gap-3">
      <span className="bg-primary/20 p-2 rounded-md">{icon}</span>
      {title}
    </h2>
    <div className="text-sm text-foreground/90">{children}</div>
  </section>
);

const ModernPreview: FC<PreviewProps> = ({ cvData }) => {
  const { personalInfo, profile, education, skills, projects, experience } = cvData;

  return (
    <div className="p-8 grid grid-cols-12 gap-x-10" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Left Column */}
      <aside className="col-span-4 flex flex-col gap-y-8">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 relative mb-4">
            <Image
              src={personalInfo.avatarUrl}
              alt={personalInfo.name}
              width={128}
              height={128}
              className="rounded-full object-cover border-4 border-primary"
              data-ai-hint="person portrait"
            />
          </div>
          <h1 className="text-2xl font-bold text-center text-primary">{personalInfo.name}</h1>
          <p className="text-md text-foreground/80 text-center">{personalInfo.jobTitle}</p>
        </div>

        <div className="space-y-4 text-xs">
          <h3 className="font-bold text-sm uppercase tracking-wider text-foreground/70 border-b pb-1">Contact</h3>
          {personalInfo.email && <div className="flex items-center gap-2"><Mail className="size-4 shrink-0 text-primary" /><span>{personalInfo.email}</span></div>}
          {personalInfo.phone && <div className="flex items-center gap-2"><Phone className="size-4 shrink-0 text-primary" /><span>{personalInfo.phone}</span></div>}
          {personalInfo.linkedin && <div className="flex items-center gap-2"><Linkedin className="size-4 shrink-0 text-primary" /><span>{personalInfo.linkedin}</span></div>}
        </div>
        
        <div>
           <h3 className="font-bold text-sm uppercase tracking-wider text-foreground/70 border-b pb-1 mb-2">Skills</h3>
           <div className="flex flex-wrap gap-2 text-xs">
              {skills && skills.split(',').map((skill, index) => {
                  const trimmedSkill = skill.trim();
                  if (trimmedSkill) {
                     return <span key={index} className="bg-primary/10 text-primary-foreground-dark px-2 py-1 rounded">{trimmedSkill}</span>
                  }
                  return null;
              })}
           </div>
        </div>

      </aside>

      {/* Right Column */}
      <main className="col-span-8">
        <Section title="Profile" icon={<User className="size-4"/>}>
          <p className="text-sm">{profile}</p>
        </Section>
        
        {experience && experience.length > 0 && experience.some(exp => exp.jobTitle) && (
          <Section title="Experience" icon={<Briefcase className="size-4" />}>
            <div className="space-y-5">
              {experience.map((exp, index) => (
                exp.jobTitle && (
                  <div key={index} className="relative pl-4 border-l-2 border-primary/30">
                     <div className="absolute -left-[6px] top-1.5 w-2.5 h-2.5 bg-primary rounded-full"></div>
                    <h3 className="font-semibold text-base text-foreground">{exp.jobTitle}</h3>
                    <div className="flex justify-between items-center text-sm mb-1">
                      <p className="font-medium text-primary/80">{exp.company}</p>
                      <p className="text-muted-foreground text-xs">{exp.date}</p>
                    </div>
                    <div className="text-xs mt-1 whitespace-pre-line text-foreground/80">{exp.description}</div>
                  </div>
                )
              ))}
            </div>
          </Section>
        )}
        
        <Section title="Education" icon={<GraduationCap className="size-4"/>}>
          <div className="space-y-4">
            {Array.isArray(education) && education.map((edu, index) => (
              <div key={index} className="relative pl-4 border-l-2 border-primary/30">
                <div className="absolute -left-[6px] top-1.5 w-2.5 h-2.5 bg-primary rounded-full"></div>
                <p className="font-semibold text-base text-foreground">{edu.degree}</p>
                <p className="text-sm font-medium">{edu.school}</p>
                <p className="text-xs text-muted-foreground">{edu.date}</p>
              </div>
            ))}
          </div>
        </Section>
        
        {projects && projects.length > 0 && projects.some(p => p.name) && (
          <Section title="Projects" icon={<Lightbulb className="size-4"/>}>
              <div className="space-y-5">
                {Array.isArray(projects) && projects.map((proj, index) => (
                  proj.name && (
                    <div key={index} className="relative pl-4 border-l-2 border-primary/30">
                       <div className="absolute -left-[6px] top-1.5 w-2.5 h-2.5 bg-primary rounded-full"></div>
                      <h3 className="font-semibold text-base text-foreground">{proj.name}</h3>
                      <div className="text-xs mt-1 whitespace-pre-line text-foreground/80">{proj.description}</div>
                    </div>
                  )
                ))}
              </div>
          </Section>
        )}
      </main>
    </div>
  );
};

export default ModernPreview;
