
"use client";

import type { FC } from 'react';
import Image from 'next/image';
import type { CvData } from '@/lib/types';
import { Mail, Phone, Linkedin, Briefcase } from 'lucide-react';

interface PreviewProps {
  cvData: CvData;
}

const Section: FC<{ title: string; children: React.ReactNode, icon?: React.ReactNode }> = ({ title, icon, children }) => (
  <section className="mb-6">
    <h2 className="text-xl font-headline text-primary mb-2 border-b-2 border-accent pb-1 flex items-center gap-2">
      {icon} {title}
    </h2>
    <div className="text-sm text-foreground/80">{children}</div>
  </section>
);

const ClassicPreview: FC<PreviewProps> = ({ cvData }) => {
  const { personalInfo, profile, education, skills, projects, experience } = cvData;

  return (
    <div className="p-8 md:p-12" style={{ fontFamily: "'Poppins', sans-serif" }}>
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
        <aside className="col-span-1">
          <Section title="Contact">
             <div className="space-y-2 text-xs">
                {personalInfo.email && <div className="flex items-center gap-2"><Mail className="size-3.5 shrink-0" /><span>{personalInfo.email}</span></div>}
                {personalInfo.phone && <div className="flex items-center gap-2"><Phone className="size-3.5 shrink-0" /><span>{personalInfo.phone}</span></div>}
                {personalInfo.linkedin && <div className="flex items-center gap-2"><Linkedin className="size-3.5 shrink-0" /><span>{personalInfo.linkedin}</span></div>}
             </div>
          </Section>

          <Section title="Education">
            <div className="space-y-3">
              {Array.isArray(education) && education.map((edu, index) => (
                <div key={index} className="text-xs">
                  <p className="font-semibold text-foreground">{edu.degree}</p>
                  <p>{edu.school}</p>
                  <p className="text-muted-foreground">{edu.date}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Skills">
             <div className="flex flex-wrap gap-2 text-xs">
                {skills && skills.split(',').map((skill, index) => {
                    const trimmedSkill = skill.trim();
                    if (trimmedSkill) {
                       return <span key={index} className="bg-primary/10 text-primary-foreground-dark px-2 py-1 rounded-full">{trimmedSkill}</span>
                    }
                    return null;
                })}
             </div>
          </Section>
        </aside>

        <main className="col-span-2">
            <Section title="Profile">
                <p className="text-sm">{profile}</p>
            </Section>
            
            {experience && experience.length > 0 && experience.some(exp => exp.jobTitle) && (
              <Section title="Experience" icon={<Briefcase className="size-5" />}>
                <div className="space-y-4">
                  {experience.map((exp, index) => (
                    exp.jobTitle && (
                      <div key={index}>
                        <h3 className="font-semibold text-base text-foreground">{exp.jobTitle}</h3>
                        <div className="flex justify-between items-center text-sm">
                          <p>{exp.company}</p>
                          <p className="text-muted-foreground">{exp.date}</p>
                        </div>
                        <div className="text-sm mt-1 whitespace-pre-line">{exp.description}</div>
                      </div>
                    )
                  ))}
                </div>
              </Section>
            )}

            <Section title="Projects">
                <div className="space-y-4">
                  {Array.isArray(projects) && projects.map((proj, index) => (
                    proj.name && (
                      <div key={index}>
                        <h3 className="font-semibold text-base text-foreground">{proj.name}</h3>
                        <div className="text-sm mt-1 whitespace-pre-line">{proj.description}</div>
                      </div>
                    )
                  ))}
                </div>
            </Section>
        </main>
      </div>
    </div>
  );
};

export default ClassicPreview;
