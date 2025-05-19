export class EducationDto {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  percentage: string;
  startYear: string;
  endYear: string;
}

export class ProjectDto {
  title: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate: string;
  url?: string;
}

export class SkillDto {
  name: string;
  level: string;
  yearsOfExperience: string;
}

export class ExperienceDto {
  jobTitle: string;
  company: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export class CreateUpdateResumeDto {
  userId: string;
  publicId?: string;
  title?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  githubUrl?: string;
  linkedInUrl?: string;
  portfolioUrl?: string;
  education?: EducationDto[];
  projects?: ProjectDto[];
  skills?: SkillDto[];
  experience?: ExperienceDto[];
  summary?: string;
}
