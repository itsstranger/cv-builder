import mongoose, { Schema, Model, Document } from 'mongoose';

// Personal Information Interface
export interface IPersonalInfo {
    fullName: string;
    email: string;
    phone?: string;
    jobTitle?: string;
    avatarUrl?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    website?: string;
    summary?: string;
}

// Education Interface
export interface IEducation {
    institution: string;
    degree: string;
    field: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    gpa?: string;
    description?: string;
}

// Experience Interface
export interface IExperience {
    company: string;
    position: string;
    location?: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    description: string;
    achievements?: string[];
}

// Project Interface
export interface IProject {
    name: string;
    description: string;
    technologies: string[];
    url?: string;
    github?: string;
    startDate?: Date;
    endDate?: Date;
}

// Skill Interface
export interface ISkill {
    category: string;
    skills: string[];
}

// Certificate Interface
export interface ICertificate {
    name: string;
    issuer: string;
    date: Date;
    url?: string;
    description?: string;
}

// Main CV Interface
export interface ICV extends Document {
    userId?: string;
    personalInfo: IPersonalInfo;
    education: IEducation[];
    experience: IExperience[];
    projects: IProject[];
    skills: ISkill[];
    certificates: ICertificate[];
    languages?: { language: string; proficiency: string }[];
    template?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Mongoose Schemas
const PersonalInfoSchema = new Schema<IPersonalInfo>({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    jobTitle: String,
    avatarUrl: String,
    location: String,
    linkedin: String,
    github: String,
    website: String,
    summary: String,
});

const EducationSchema = new Schema<IEducation>({
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    field: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: Date,
    current: { type: Boolean, default: false },
    gpa: String,
    description: String,
});

const ExperienceSchema = new Schema<IExperience>({
    company: { type: String, required: true },
    position: { type: String, required: true },
    location: String,
    startDate: { type: Date, required: true },
    endDate: Date,
    current: { type: Boolean, default: false },
    description: { type: String, required: true },
    achievements: [String],
});

const ProjectSchema = new Schema<IProject>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    technologies: [{ type: String, required: true }],
    url: String,
    github: String,
    startDate: Date,
    endDate: Date,
});

const SkillSchema = new Schema<ISkill>({
    category: { type: String, required: true },
    skills: [{ type: String, required: true }],
});

const CertificateSchema = new Schema<ICertificate>({
    name: { type: String, required: true },
    issuer: { type: String, required: true },
    date: { type: Date, required: true },
    url: String,
    description: String,
});

const CVSchema = new Schema<ICV>(
    {
        userId: { type: String, index: true },
        personalInfo: { type: PersonalInfoSchema, required: true },
        education: [EducationSchema],
        experience: [ExperienceSchema],
        projects: [ProjectSchema],
        skills: [SkillSchema],
        certificates: [CertificateSchema],
        languages: [
            {
                language: String,
                proficiency: String,
            },
        ],
        template: { type: String, default: 'modern' },
    },
    {
        timestamps: true,
    }
);

// Create indexes for better query performance
CVSchema.index({ 'personalInfo.email': 1 });
CVSchema.index({ createdAt: -1 });

const CV: Model<ICV> = mongoose.models.CV || mongoose.model<ICV>('CV', CVSchema);

export default CV;
