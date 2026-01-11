export interface PersonalInfo {
  name: string;
  jobTitle: string;
  phone: string;
  email: string;
  linkedin: string;
  avatarUrl: string;
}

export interface WorkExperience {
  jobTitle: string;
  company: string;
  date: string;
  description: string;
}

export interface Education {
  degree: string;
  school: string;
  date: string;
}

export interface Project {
  name: string;
  description: string;
}

export interface CvData {
  id?: string;
  name?: string;
  template?: 'classic' | 'modern';
  personalInfo: PersonalInfo;
  profile: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string;
  projects: Project[];
}
