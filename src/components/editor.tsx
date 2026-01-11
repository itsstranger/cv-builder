"use client";

import type { Dispatch, SetStateAction, FC } from 'react';
import React, { useState } from 'react';
import {
  BrainCircuit,
  Contact,
  GraduationCap,
  Lightbulb,
  User,
  Wrench,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

import type { CvData } from '@/lib/types';
import AiSuggestions from './ai-suggestions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface EditorProps {
  cvData: CvData;
  setCvData: Dispatch<SetStateAction<CvData>>;
}

const steps = [
  { id: 'personal-info', name: 'Personal Info', icon: Contact },
  { id: 'profile', name: 'Profile', icon: User },
  { id: 'education', name: 'Education', icon: GraduationCap },
  { id: 'skills', name: 'Skills', icon: Wrench },
  { id: 'projects', name: 'Projects', icon: Lightbulb },
  { id: 'ai-suggestions', name: 'AI Suggestions', icon: BrainCircuit },
];

const Editor: FC<EditorProps> = ({ cvData, setCvData }) => {
  const [currentStep, setCurrentStep] = useState(0);

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
  
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const progress = ((currentStep + 1) / steps.length) * 100;
  const CurrentIcon = steps[currentStep].icon;

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-2">
         <Progress value={progress} className="h-2" />
         <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                <CurrentIcon className="size-4"/>
                {steps[currentStep].name}
            </p>
            <p className="text-xs text-muted-foreground">Step {currentStep + 1} of {steps.length}</p>
        </div>
      </div>


      <div className="min-h-[40vh]">
        {steps[currentStep].id === 'personal-info' && (
          <div className="space-y-4 p-1 animate-in fade-in-50">
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
          </div>
        )}

        {steps[currentStep].id === 'profile' && (
           <div className="p-1 animate-in fade-in-50">
            <Textarea name="profile" value={cvData.profile} onChange={handleFieldChange} rows={15} placeholder="A short 'About Me' summary..." />
          </div>
        )}

        {steps[currentStep].id === 'education' && (
           <div className="p-1 animate-in fade-in-50">
             <Textarea name="education" value={cvData.education} onChange={handleFieldChange} rows={15} placeholder="Degree Name, Institution, Year..." />
          </div>
        )}

        {steps[currentStep].id === 'skills' && (
           <div className="p-1 animate-in fade-in-50">
            <Textarea name="skills" value={cvData.skills} onChange={handleFieldChange} rows={15} placeholder="Separate skills with a comma: Research, Design, Coding..." />
          </div>
        )}
        
        {steps[currentStep].id === 'projects' && (
           <div className="p-1 animate-in fade-in-50">
            <Textarea name="projects" value={cvData.projects} onChange={handleFieldChange} rows={15} placeholder="Describe your projects. Use bullet points (•) for clarity." />
          </div>
        )}
        
        {steps[currentStep].id === 'ai-suggestions' && (
            <div className="p-1 animate-in fade-in-50">
              <AiSuggestions />
            </div>
        )}
      </div>

      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
          <ArrowLeft /> Previous
        </Button>
        <Button onClick={nextStep} disabled={currentStep === steps.length - 1}>
          Next <ArrowRight />
        </Button>
      </div>
    </div>
  );
};

export default Editor;
