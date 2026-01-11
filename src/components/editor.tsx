
"use client";

import type { Dispatch, SetStateAction, FC } from 'react';
import React, from 'react';
import {
  BrainCircuit,
  Contact,
  GraduationCap,
  Lightbulb,
  User,
  Wrench,
  ArrowLeft,
  ArrowRight,
  PlusCircle,
  Trash2,
  Briefcase,
  LayoutTemplate
} from 'lucide-react';

import type { CvData, Education, Project, WorkExperience } from '@/lib/types';
import AiSuggestions from './ai-suggestions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { cn } from '@/lib/utils';

interface EditorProps {
  cvData: CvData;
  setCvData: Dispatch<SetStateAction<CvData>>;
}

const steps = [
  { id: 'personal-info', name: 'Personal Info', icon: Contact },
  { id: 'template', name: 'Template', icon: LayoutTemplate },
  { id: 'profile', name: 'Profile', icon: User },
  { id: 'experience', name: 'Experience', icon: Briefcase },
  { id: 'education', name: 'Education', icon: GraduationCap },
  { id: 'skills', name: 'Skills', icon: Wrench },
  { id: 'projects', name: 'Projects', icon: Lightbulb },
  { id: 'ai-suggestions', name: 'AI Suggestions', icon: BrainCircuit },
];

const templates = [
  { id: 'classic', name: 'Classic' },
  { id: 'modern', name: 'Modern' },
]

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

  const handleArrayChange = <T extends Education | Project | WorkExperience>(
    section: keyof CvData,
    index: number,
    field: keyof T,
    value: string
  ) => {
    setCvData((prev) => {
      const newArray = [...(prev[section] as T[])];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [section]: newArray };
    });
  };

  const addArrayItem = (section: 'education' | 'projects' | 'experience') => {
    let newItem: Education | Project | WorkExperience;
    if (section === 'education') {
      newItem = { degree: '', school: '', date: '' };
    } else if (section === 'projects') {
      newItem = { name: '', description: '' };
    } else {
      newItem = { jobTitle: '', company: '', date: '', description: '' };
    }
    setCvData((prev) => ({
      ...prev,
      [section]: [...(prev[section] as any[]), newItem],
    }));
  };

  const removeArrayItem = (section: keyof CvData, index: number) => {
    setCvData((prev) => ({
      ...prev,
      [section]: (prev[section] as any[]).filter((_, i) => i !== index),
    }));
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
  
  const CurrentIcon = steps[currentStep].icon;

  const renderListEditor = <T extends Education | Project | WorkExperience>(
    sectionName: 'education' | 'projects' | 'experience', 
    items: T[],
    fields: { key: keyof T; label: string; type?: string, placeholder?: string }[]
  ) => (
    <div className="space-y-4">
      <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
        {items.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border-border/50">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex justify-between items-center w-full">
                <span className="font-medium text-sm capitalize">{sectionName} #{index + 1}</span>
                <Button variant="ghost" size="icon" onClick={() => removeArrayItem(sectionName, index)} className="text-muted-foreground hover:text-destructive size-8">
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-1">
              <div className="space-y-4 px-2 pt-2 pb-4">
                {fields.map(field => (
                   <div key={field.key as string} className="space-y-2">
                    <Label htmlFor={`${sectionName}-${index}-${field.key as string}`}>{field.label}</Label>
                    {field.type === 'textarea' ? (
                      <Textarea
                        id={`${sectionName}-${index}-${field.key as string}`}
                        value={item[field.key] as string}
                        onChange={(e) => handleArrayChange(sectionName, index, field.key, e.target.value)}
                        placeholder={field.placeholder}
                        rows={4}
                      />
                    ) : (
                      <Input
                        id={`${sectionName}-${index}-${field.key as string}`}
                        value={item[field.key] as string}
                        onChange={(e) => handleArrayChange(sectionName, index, field.key, e.target.value)}
                        placeholder={field.placeholder}
                      />
                    )}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Button variant="outline" onClick={() => addArrayItem(sectionName)} className="w-full">
        <PlusCircle /> Add {sectionName}
      </Button>
    </div>
  );


  return (
    <div className="p-4 space-y-6">
      <div className="space-y-2">
         <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                <CurrentIcon className="size-4"/>
                {steps[currentStep].name}
            </p>
            <p className="text-xs text-muted-foreground">Step {currentStep + 1} of {steps.length}</p>
        </div>
      </div>


      <div className="min-h-[40vh] max-h-[65vh] overflow-y-auto pr-2">
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
        
        {steps[currentStep].id === 'template' && (
          <div className="p-1 animate-in fade-in-50">
            <div className="grid grid-cols-2 gap-4">
              {templates.map(template => (
                <div key={template.id} 
                    onClick={() => setCvData(prev => ({ ...prev, template: template.id as 'classic' | 'modern' }))}
                    className={cn(
                        "cursor-pointer rounded-lg border-2 transition-all p-4 flex items-center justify-center h-24",
                        cvData.template === template.id ? "border-primary ring-2 ring-primary/50 bg-primary/5" : "border-border hover:border-primary/50"
                    )}
                >
                  <p className="text-center text-lg font-medium p-2">{template.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {steps[currentStep].id === 'profile' && (
           <div className="p-1 animate-in fade-in-50">
            <Textarea name="profile" value={cvData.profile} onChange={handleFieldChange} rows={15} placeholder="A short 'About Me' summary..." />
          </div>
        )}

        {steps[currentStep].id === 'experience' && (
          <div className="p-1 animate-in fade-in-50">
            {renderListEditor('experience', cvData.experience, [
              { key: 'jobTitle', label: 'Job Title', placeholder: 'e.g., Retail Assistant' },
              { key: 'company', label: 'Company', placeholder: 'e.g., H&M' },
              { key: 'date', label: 'Date', placeholder: 'e.g., Jan 2022 - Present' },
              { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Describe your responsibilities...' },
            ])}
          </div>
        )}

        {steps[currentStep].id === 'education' && (
           <div className="p-1 animate-in fade-in-50">
              {renderListEditor('education', cvData.education, [
                { key: 'degree', label: 'Degree/Course', placeholder: 'e.g., B.Sc. Computer Science' },
                { key: 'school', label: 'School/University', placeholder: 'e.g., University of Technology' },
                { key: 'date', label: 'Date', placeholder: 'e.g., 2021 - 2025' },
              ])}
          </div>
        )}

        {steps[currentStep].id === 'skills' && (
           <div className="p-1 animate-in fade-in-50">
            <Textarea name="skills" value={cvData.skills} onChange={handleFieldChange} rows={15} placeholder="Separate skills with a comma: Research, Design, Coding..." />
          </div>
        )}
        
        {steps[currentStep].id === 'projects' && (
           <div className="p-1 animate-in fade-in-50">
              {renderListEditor('projects', cvData.projects, [
                { key: 'name', label: 'Project Name', placeholder: 'e.g., AI-Powered CV Builder' },
                { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Describe your project...' },
              ])}
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
}

export default Editor;

    