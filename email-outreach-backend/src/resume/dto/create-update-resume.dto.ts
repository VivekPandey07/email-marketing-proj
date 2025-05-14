// src/resume/dto/create-update-resume.dto.ts
export class CreateUpdateResumeDto {
  userId: string;
  title?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  education?: Array<{
    institution: string;
    degree: string;
    fieldOfStudy: string;
    percentage: string;
    startYear: string;
    endYear: string;
  }>;
  projects?: Array<{
    title: string;
    description: string;
    technologies: string[];
    startDate: string;
    endDate: string;
    url?: string;
  }>;
  skills?: Array<{
    name: string;
    level: string;
    yearsOfExperience: string;
  }>;
  
  summary?: string;
}