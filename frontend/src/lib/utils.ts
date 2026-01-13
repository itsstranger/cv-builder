import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { CvData } from './types'
import { ICV } from '@/models/CV'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function mapCVToData(cv: ICV): CvData {
  return {
    id: cv._id?.toString(),
    name: cv.personalInfo.fullName || 'Untitled CV',
    template: (cv.template as any) || 'modern',
    personalInfo: {
      name: cv.personalInfo.fullName,
      jobTitle: cv.personalInfo.jobTitle || '',
      phone: cv.personalInfo.phone,
      email: cv.personalInfo.email,
      linkedin: cv.personalInfo.linkedin || '',
      avatarUrl: cv.personalInfo.avatarUrl || '',
    },
    profile: cv.personalInfo.summary || '',
    experience: cv.experience.map(exp => {
      const start = exp.startDate ? new Date(exp.startDate).getFullYear() : '';
      const end = exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).getFullYear() : '');
      return {
        jobTitle: exp.position,
        company: exp.company,
        date: start && end ? `${start} - ${end}` : (start ? `${start}` : ''),
        description: exp.description
      };
    }),
    education: cv.education.map(edu => {
      const start = edu.startDate ? new Date(edu.startDate).getFullYear() : '';
      const end = edu.current ? 'Present' : (edu.endDate ? new Date(edu.endDate).getFullYear() : '');
      return {
        degree: edu.degree,
        school: edu.institution,
        date: start && end ? `${start} - ${end}` : (start ? `${start}` : '')
      };
    }),
    skills: cv.skills.map(s => s.skills.join(', ')).join(', '),
    projects: cv.projects.map(p => ({
      name: p.name,
      description: p.description
    }))
  };
}
