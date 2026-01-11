import type { CvData } from './types';

export const initialCvData: Omit<CvData, 'id' | 'name'> = {
  personalInfo: {
    name: 'Jane Doe',
    jobTitle: 'Computer Science Student',
    phone: '+1 234 567 890',
    email: 'jane.doe@example.com',
    linkedin: 'linkedin.com/in/janedoe',
    avatarUrl: 'https://picsum.photos/seed/avatar/200/200',
  },
  profile: 'A passionate and driven computer science student with a strong foundation in software development and a keen interest in building innovative solutions. Eager to apply academic knowledge to real-world challenges and contribute to a dynamic team.',
  experience: [
    {
      jobTitle: 'Software Engineer Intern',
      company: 'Tech Solutions Inc.',
      date: 'Summer 2023',
      description: '• Worked on the frontend of the main product using React and TypeScript.\n• Collaborated with the backend team to integrate new APIs.\n• Participated in daily stand-ups and agile sprints.'
    }
  ],
  education: [
    {
      degree: 'B.Sc. in Computer Science',
      school: 'University of Technology',
      date: '2021 - 2025'
    },
  ],
  skills: 'JavaScript, React, Next.js, TypeScript, Node.js, Python, SQL, Git, Figma',
  projects: [
    {
      name: 'AI-Powered CV Builder',
      description: '• Developed a web application using Next.js and Genkit AI to help students create and optimize their CVs.'
    },
    {
      name: 'E-commerce Platform',
      description: '• Built a full-stack e-commerce site with user authentication, product catalog, and payment integration.'
    }
  ],
};
