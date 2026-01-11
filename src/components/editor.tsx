"use client";

import type { Dispatch, SetStateAction, FC } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { CvData } from '@/lib/types';
import { BrainCircuit, Contact, GraduationCap, Lightbulb, User, Wrench } from 'lucide-react';
import AiSuggestions from './ai-suggestions';

interface EditorProps {
  cvData: CvData;
  setCvData: Dispatch<SetStateAction<CvData>>;
}

const Editor: FC<EditorProps> = ({ cvData, setCvData }) => {
  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCvData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [name]: value },
    }));
  };

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCvData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Accordion type="multiple" defaultValue={['item-1', 'item-6']} className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <div className="flex items-center gap-3">
            <Contact /> Personal Info
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4 p-1">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" value={cvData.personalInfo.name} onChange={handlePersonalInfoChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jobTitle">What are you studying?</Label>
            <Input id="jobTitle" name="jobTitle" value={cvData.personalInfo.jobTitle} onChange={handlePersonalInfoChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" value={cvData.personalInfo.phone} onChange={handlePersonalInfoChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={cvData.personalInfo.email} onChange={handlePersonalInfoChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn/Portfolio Link</Label>
            <Input id="linkedin" name="linkedin" value={cvData.personalInfo.linkedin} onChange={handlePersonalInfoChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="avatarUrl">Avatar Image URL</Label>
            <Input id="avatarUrl" name="avatarUrl" value={cvData.personalInfo.avatarUrl} onChange={handlePersonalInfoChange} />
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>
          <div className="flex items-center gap-3">
            <User /> Profile
          </div>
        </AccordionTrigger>
        <AccordionContent className="p-1">
          <Textarea name="profile" value={cvData.profile} onChange={handleFieldChange} rows={5} placeholder="A short 'About Me' summary..." />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>
          <div className="flex items-center gap-3">
            <GraduationCap /> Education
          </div>
        </AccordionTrigger>
        <AccordionContent className="p-1">
          <Textarea name="education" value={cvData.education} onChange={handleFieldChange} rows={4} placeholder="Degree Name, Institution, Year..." />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4">
        <AccordionTrigger>
          <div className="flex items-center gap-3">
            <Wrench /> Skills
          </div>
        </AccordionTrigger>
        <AccordionContent className="p-1">
          <Textarea name="skills" value={cvData.skills} onChange={handleFieldChange} rows={4} placeholder="Research, Design, Coding..." />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-5">
        <AccordionTrigger>
          <div className="flex items-center gap-3">
            <Lightbulb /> Academic Projects
          </div>
        </AccordionTrigger>
        <AccordionContent className="p-1">
          <Textarea name="projects" value={cvData.projects} onChange={handleFieldChange} rows={6} placeholder="Describe your projects..." />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-6">
        <AccordionTrigger>
          <div className="flex items-center gap-3 text-primary">
            <BrainCircuit /> AI Suggestions
          </div>
        </AccordionTrigger>
        <AccordionContent className="p-1">
          <AiSuggestions />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default Editor;
