import React, { useState } from "react";
import { useSelector } from "react-redux";

interface EducationItem {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  percentage: string;
  startYear: string;
  endYear: string;
}

interface SkillItem {
  name: string;
  level: string;
}

interface ExperienceItem {
  position: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  technologies: string[];
}

interface ProjectItem {
  title: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate: string;
  url?: string;
}

interface ResumeFormProps {
  initialData?: any;
  onSave: (data: any) => void;
  onClose: () => void;
  isCreating?: boolean;
}

const ResumeForm: React.FC<ResumeFormProps> = ({ 
  initialData = {}, 
  onSave,
  onClose,
  isCreating = false
}) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [fullName, setFullName] = useState(initialData?.fullName || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [location, setLocation] = useState(initialData?.location || "");
  const [portfolioUrl, setPortfolioUrl] = useState(initialData?.portfolioUrl || "");
  const [linkedInUrl, setLinkedInUrl] = useState(initialData?.linkedInUrl || "");
  const [githubUrl, setGithubUrl] = useState(initialData?.githubUrl || "");
  const [summary, setSummary] = useState(initialData?.summary || "");
  
  const [education, setEducation] = useState<EducationItem[]>(
    initialData?.education || [{
      institution: "",
      degree: "",
      fieldOfStudy: "",
      percentage: "",
      startYear: "",
      endYear: ""
    }]
  );
  
  const [experience, setExperience] = useState<ExperienceItem[]>(
    initialData?.experience || [{
      position: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
      technologies: []
    }]
  );
  
  const [skills, setSkills] = useState<SkillItem[]>(
    initialData?.skills || [{
      name: "",
      level: ""
    }]
  );
  
  const [projects, setProjects] = useState<ProjectItem[]>(
    initialData?.projects || [{
      title: "",
      description: "",
      technologies: [],
      startDate: "",
      endDate: "",
      url: ""
    }]
  );

  const { user } = useSelector((state: any) => state.auth);

  // Education handlers
  const handleAddEducation = () => {
    setEducation([...education, {
      institution: "",
      degree: "",
      fieldOfStudy: "",
      percentage: "",
      startYear: "",
      endYear: ""
    }]);
  };

  const handleRemoveEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const handleEducationChange = (
    index: number,
    field: keyof EducationItem,
    value: string
  ) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    setEducation(updated);
  };

  // Experience handlers
  const handleAddExperience = () => {
    setExperience([...experience, {
      position: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
      technologies: []
    }]);
  };

  const handleRemoveExperience = (index: number) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  const handleAddExperienceTech = (expIndex: number) => {
    const updated = [...experience];
    updated[expIndex].technologies = [...updated[expIndex].technologies, ""];
    setExperience(updated);
  };

  const handleRemoveExperienceTech = (expIndex: number, techIndex: number) => {
    const updated = [...experience];
    updated[expIndex].technologies = updated[expIndex].technologies.filter(
      (_, i) => i !== techIndex
    );
    setExperience(updated);
  };

  // Skills handlers
  const handleAddSkill = () => {
    setSkills([...skills, {
      name: "",
      level: ""
    }]);
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSkillChange = (
    index: number,
    field: keyof SkillItem,
    value: string
  ) => {
    const updated = [...skills];
    updated[index] = { ...updated[index], [field]: value };
    setSkills(updated);
  };

  // Projects handlers
  const handleAddProject = () => {
    setProjects([...projects, {
      title: "",
      description: "",
      technologies: [],
      startDate: "",
      endDate: "",
      url: ""
    }]);
  };

  const handleRemoveProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const handleAddTechnology = (projectIndex: number) => {
    const updated = [...projects];
    updated[projectIndex].technologies = [...updated[projectIndex].technologies, ""];
    setProjects(updated);
  };

  const handleRemoveTechnology = (projectIndex: number, techIndex: number) => {
    const updated = [...projects];
    updated[projectIndex].technologies = updated[projectIndex].technologies.filter(
      (_, i) => i !== techIndex
    );
    setProjects(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resumePayload = {
      title,
      fullName,
      email,
      phone,
      location,
      portfolioUrl,
      linkedInUrl,
      githubUrl,
      summary,
      education,
      experience,
      skills,
      projects
    };
    onSave(resumePayload);
  };

  return (
    <div className="bg-white rounded-lg shadow-md max-h-[90vh] overflow-y-auto">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-indigo-600">
            {isCreating ? 'Create New Resume' : 'Edit Resume'}
          </h2>
          <button 
            type="button" 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Resume Title */}
        <div>
          <label className="block mb-1 font-medium">Resume Title*</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="My Professional Resume"
          />
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Full Name*</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email*</label>
            <input
              type="email"
              className="w-full p-2 border rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Phone</label>
            <input
              type="tel"
              className="w-full p-2 border rounded-md"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Location</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, Country"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">LinkedIn URL</label>
            <input
              type="url"
              className="w-full p-2 border rounded-md"
              value={linkedInUrl}
              onChange={(e) => setLinkedInUrl(e.target.value)}
              placeholder="https://linkedin.com/in/username"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">GitHub URL</label>
            <input
              type="url"
              className="w-full p-2 border rounded-md"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Portfolio URL</label>
            <input
              type="url"
              className="w-full p-2 border rounded-md"
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
              placeholder="https://yourportfolio.com"
            />
          </div>
        </div>

        {/* Summary */}
        <div>
          <label className="block mb-1 font-medium">Professional Summary</label>
          <textarea
            className="w-full p-2 border rounded-md"
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Briefly describe your professional background and skills..."
          />
        </div>

        {/* Experience Section */}
        <div className="border-t pt-4">
          <label className="block mb-2 font-semibold text-indigo-600">
            Work Experience
          </label>
          {experience.map((exp, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1 font-medium">Position*</label>
                  <input
                    type="text"
                    placeholder="Software Engineer"
                    value={exp.position}
                    onChange={(e) => {
                      const updated = [...experience];
                      updated[index].position = e.target.value;
                      setExperience(updated);
                    }}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Company*</label>
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={exp.company}
                    onChange={(e) => {
                      const updated = [...experience];
                      updated[index].company = e.target.value;
                      setExperience(updated);
                    }}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1 font-medium">Location</label>
                  <input
                    type="text"
                    placeholder="City, Country"
                    value={exp.location}
                    onChange={(e) => {
                      const updated = [...experience];
                      updated[index].location = e.target.value;
                      setExperience(updated);
                    }}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1 font-medium">Start Date*</label>
                  <input
                    type="date"
                    value={exp.startDate}
                    onChange={(e) => {
                      const updated = [...experience];
                      updated[index].startDate = e.target.value;
                      setExperience(updated);
                    }}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">End Date</label>
                  <input
                    type="date"
                    value={exp.endDate}
                    onChange={(e) => {
                      const updated = [...experience];
                      updated[index].endDate = e.target.value;
                      setExperience(updated);
                    }}
                    className="w-full p-2 border rounded-md"
                    placeholder="Present if current"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-1 font-medium">Description*</label>
                <textarea
                  placeholder="Describe your responsibilities and achievements..."
                  value={exp.description}
                  onChange={(e) => {
                    const updated = [...experience];
                    updated[index].description = e.target.value;
                    setExperience(updated);
                  }}
                  className="w-full p-2 border rounded-md"
                  rows={3}
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1 font-medium">Technologies Used</label>
                {exp.technologies.map((tech, techIndex) => (
                  <div key={techIndex} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Technology"
                      value={tech}
                      onChange={(e) => {
                        const updated = [...experience];
                        updated[index].technologies[techIndex] = e.target.value;
                        setExperience(updated);
                      }}
                      className="flex-1 p-2 border rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExperienceTech(index, techIndex)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddExperienceTech(index)}
                  className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 mt-1"
                >
                  <span className="mr-1">+</span> Add Technology
                </button>
              </div>

              {experience.length > 1 && (
                <div className="mt-3 text-right">
                  <button
                    type="button"
                    onClick={() => handleRemoveExperience(index)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove Experience
                  </button>
                </div>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddExperience}
            className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 mt-2"
          >
            <span className="mr-1">+</span> Add Experience
          </button>
        </div>

        {/* Education Section */}
        <div className="border-t pt-4">
          <label className="block mb-2 font-semibold text-indigo-600">
            Education
          </label>
          {education.map((edu, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1 font-medium">Institution*</label>
                  <input
                    type="text"
                    placeholder="University/School Name"
                    value={edu.institution}
                    onChange={(e) =>
                      handleEducationChange(index, "institution", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Degree*</label>
                  <input
                    type="text"
                    placeholder="Bachelor of Science, Master's, etc."
                    value={edu.degree}
                    onChange={(e) =>
                      handleEducationChange(index, "degree", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1 font-medium">Field of Study</label>
                  <input
                    type="text"
                    placeholder="Computer Science, Business, etc."
                    value={edu.fieldOfStudy}
                    onChange={(e) =>
                      handleEducationChange(index, "fieldOfStudy", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Percentage/GPA</label>
                  <input
                    type="text"
                    placeholder="3.8 GPA or 85%"
                    value={edu.percentage}
                    onChange={(e) =>
                      handleEducationChange(index, "percentage", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Start Year</label>
                  <input
                    type="number"
                    min="1900"
                    max="2099"
                    placeholder="2015"
                    value={edu.startYear}
                    onChange={(e) =>
                      handleEducationChange(index, "startYear", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">End Year</label>
                  <input
                    type="number"
                    min="1900"
                    max="2099"
                    placeholder="2019"
                    value={edu.endYear}
                    onChange={(e) =>
                      handleEducationChange(index, "endYear", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>

              {education.length > 1 && (
                <div className="mt-3 text-right">
                  <button
                    type="button"
                    onClick={() => handleRemoveEducation(index)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove Education
                  </button>
                </div>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddEducation}
            className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 mt-2"
          >
            <span className="mr-1">+</span> Add Education
          </button>
        </div>

        {/* Skills Section */}
        <div className="border-t pt-4">
          <label className="block mb-2 font-semibold text-indigo-600">
            Skills
          </label>
          {skills.map((skill, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1 font-medium">Skill Name*</label>
                  <input
                    type="text"
                    placeholder="JavaScript, Python, etc."
                    value={skill.name}
                    onChange={(e) =>
                      handleSkillChange(index, "name", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Proficiency Level*</label>
                  <select
                    value={skill.level}
                    onChange={(e) =>
                      handleSkillChange(index, "level", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="">Select level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
              </div>

              {skills.length > 1 && (
                <div className="mt-3 text-right">
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(index)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove Skill
                  </button>
                </div>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddSkill}
            className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 mt-2"
          >
            <span className="mr-1">+</span> Add Skill
          </button>
        </div>

        {/* Projects Section */}
        <div className="border-t pt-4">
          <label className="block mb-2 font-semibold text-indigo-600">
            Projects
          </label>
          {projects.map((project, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg">
              <div className="mb-4">
                <label className="block mb-1 font-medium">Project Title*</label>
                <input
                  type="text"
                  placeholder="Project Name"
                  value={project.title}
                  onChange={(e) => {
                    const updated = [...projects];
                    updated[index].title = e.target.value;
                    setProjects(updated);
                  }}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-1 font-medium">Description*</label>
                <textarea
                  placeholder="Describe the project and your contributions..."
                  value={project.description}
                  onChange={(e) => {
                    const updated = [...projects];
                    updated[index].description = e.target.value;
                    setProjects(updated);
                  }}
                  className="w-full p-2 border rounded-md"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1 font-medium">Start Date</label>
                  <input
                    type="date"
                    value={project.startDate}
                    onChange={(e) => {
                      const updated = [...projects];
                      updated[index].startDate = e.target.value;
                      setProjects(updated);
                    }}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">End Date</label>
                  <input
                    type="date"
                    value={project.endDate}
                    onChange={(e) => {
                      const updated = [...projects];
                      updated[index].endDate = e.target.value;
                      setProjects(updated);
                    }}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-1 font-medium">Technologies Used</label>
                {project.technologies.map((tech, techIndex) => (
                  <div key={techIndex} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Technology"
                      value={tech}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[index].technologies[techIndex] = e.target.value;
                        setProjects(updated);
                      }}
                      className="flex-1 p-2 border rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveTechnology(index, techIndex)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddTechnology(index)}
                  className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 mt-1"
                >
                  <span className="mr-1">+</span> Add Technology
                </button>
              </div>

              <div className="mb-4">
                <label className="block mb-1 font-medium">Project URL</label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={project.url || ""}
                  onChange={(e) => {
                    const updated = [...projects];
                    updated[index].url = e.target.value;
                    setProjects(updated);
                  }}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              {projects.length > 1 && (
                <div className="mt-3 text-right">
                  <button
                    type="button"
                    onClick={() => handleRemoveProject(index)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove Project
                  </button>
                </div>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddProject}
            className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 mt-2"
          >
            <span className="mr-1">+</span> Add Project
          </button>
        </div>

        <div className="flex justify-between pt-6 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            {isCreating ? 'Create Resume' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResumeForm;