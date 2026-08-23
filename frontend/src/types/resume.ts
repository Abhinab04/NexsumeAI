export interface PersonalInfo {
    fullName: string;
    email: string;
    phone: string;
    linkedin: string | null;
    github: string | null;
    portfolio: string | null;
}

export interface Experience {
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    location: string;
    description: string[];
}

export interface Education {
    institution: string;
    degree: string;
    startDate: string;
    endDate: string;
    location: string;
    gpa: string | null;
}

export interface Skills {
    languages: string[];
    frameworks: string[];
    tools: string[];
}

export interface Project {
    name: string;
    technologies: string[];
    link: string | null;
    description: string[];
}

export interface StructuredResume {
    personalInfo: PersonalInfo;
    summary: string;
    experience: Experience[];
    education: Education[];
    skills: Skills;
    projects: Project[];
}

export interface AnalysisResult {
    atsScore: number;
    scoreJustification: string;
    matchedKeywords: string[];
    missingKeywords: string[];
    buzzwordReplacements: Record<string, string>;
    keyImprovements: string[];
    learningRoadmap: string[];
    structuredResume: StructuredResume;
}
