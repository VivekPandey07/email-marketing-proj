import React, { useEffect, useState } from "react";
import { FaGithub, FaLinkedin, FaGlobe, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { useParams } from "react-router-dom";
import { getResumeById } from "../services/resumeService";

const PortfolioViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [templateId, setTemplateId] = useState(1);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const t = urlParams.get("template");
    if (t) setTemplateId(parseInt(t));

    const fetchResume = async () => {
      try {
        const data = await getResumeById(id || "");
        setResume(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!resume) return <div className="text-center py-20">Resume not found</div>;

  switch (templateId) {
    case 1:
      return <TemplateCleanPortfolio resume={resume} />;
    case 2:
      return <TemplateTopNav resume={resume} />;
    case 3:
      return <TemplateGridCards resume={resume} />;
    case 4:
      return <TemplateModernDark resume={resume} />;
    default:
      return <TemplateCleanPortfolio resume={resume} />;
  }
};

export default PortfolioViewer;

/* ------------------- Templates Below ------------------- */

// Template 1: Sidebar Layout
const TemplateCleanPortfolio = ({ resume }: { resume: any }) => {
    return (
      <div className="min-h-screen bg-white text-gray-900 font-sans scroll-smooth">
        {/* Navbar */}
        <header className="sticky top-0 bg-white border-b shadow-sm z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="text-2xl font-bold text-indigo-600">
              {resume.fullName || "Portfolio"}
            </div>
            <nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-700">
              <a href="#about" className="hover:text-indigo-600 transition">About</a>
              <a href="#experience" className="hover:text-indigo-600 transition">Experience</a>
              <a href="#projects" className="hover:text-indigo-600 transition">Projects</a>
              <a href="#education" className="hover:text-indigo-600 transition">Education</a>
              <a href="#contact" className="hover:text-indigo-600 transition">Contact</a>
            </nav>
          </div>
        </header>
  
        <main className="max-w-6xl mx-auto px-6 py-20 space-y-28">
          {/* About Section */}
          <section id="about" className="text-center">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-4xl font-bold shadow-inner">
              {resume.fullName?.charAt(0)}
            </div>
            <h1 className="text-4xl font-bold mb-2 text-gray-800">{resume.fullName}</h1>
            <p className="text-lg text-indigo-600 mb-4">{resume.title}</p>
            <p className="max-w-2xl mx-auto text-gray-600 leading-relaxed">{resume.summary}</p>
  
            {/* Social Icons */}
            <div className="mt-6 flex justify-center space-x-6 text-indigo-600 text-xl">
              {resume.linkedinUrl && (
                <a href={resume.linkedinUrl} target="_blank" rel="noreferrer" className="hover:text-indigo-800 transition">
                  <FaLinkedin />
                </a>
              )}
              {resume.githubUrl && (
                <a href={resume.githubUrl} target="_blank" rel="noreferrer" className="hover:text-indigo-800 transition">
                  <FaGithub />
                </a>
              )}
              {resume.portfolioUrl && (
                <a href={resume.portfolioUrl} target="_blank" rel="noreferrer" className="hover:text-indigo-800 transition">
                  <FaGlobe />
                </a>
              )}
            </div>
          </section>
  
          {/* Experience */}
          {resume.experience?.length > 0 && (
            <section id="experience">
              <h2 className="text-3xl font-bold mb-10 text-indigo-600">Experience</h2>
              <div className="space-y-8">
                {resume.experience.map((exp: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-white border border-gray-200 p-6 rounded-lg shadow hover:shadow-md transition"
                  >
                    <h3 className="text-xl font-semibold text-gray-800">{exp.jobTitle}</h3>
                    <p className="text-indigo-600 font-medium">{exp.company}</p>
                    <p className="text-sm text-gray-500">{exp.startDate} – {exp.endDate || "Present"}</p>
                    <p className="mt-2 text-gray-600">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
  
          {/* Projects */}
          {resume.projects?.length > 0 && (
            <section id="projects">
              <h2 className="text-3xl font-bold mb-10 text-indigo-600">Projects</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {resume.projects.map((project: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-white border border-gray-200 p-6 rounded-lg shadow hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">{project.title}</h3>
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-600 text-sm hover:underline"
                        >
                          Visit
                        </a>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{project.description}</p>
                    {project.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech: string, i: number) => (
                          <span
                            key={i}
                            className="bg-indigo-100 text-indigo-800 px-3 py-1 text-xs rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
  
          {/* Education */}
          {resume.education?.length > 0 && (
            <section id="education">
              <h2 className="text-3xl font-bold mb-10 text-indigo-600">Education</h2>
              <div className="space-y-6">
                {resume.education.map((edu: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-white border border-gray-200 p-6 rounded-lg shadow hover:shadow-md transition"
                  >
                    <h3 className="text-lg font-semibold text-gray-800">{edu.degree}</h3>
                    <p className="text-indigo-600 font-medium">{edu.institution}</p>
                    <p className="text-gray-600">{edu.fieldOfStudy}</p>
                    <p className="text-sm text-gray-500">{edu.startYear} - {edu.endYear || "Present"}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
  
          {/* Contact */}
          <section id="contact" className="text-center">
            <h2 className="text-3xl font-bold mb-6 text-indigo-600">Contact</h2>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-lg text-gray-700">
              {resume.email && (
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-indigo-600" />
                  <a href={`mailto:${resume.email}`} className="hover:text-indigo-800 transition">{resume.email}</a>
                </div>
              )}
              {resume.phone && (
                <div className="flex items-center gap-2">
                  <FaPhone className="text-indigo-600" />
                  <span>{resume.phone}</span>
                </div>
              )}
            </div>
          </section>
        </main>
  
        {/* Footer */}
        <footer className="bg-gray-100 border-t text-center text-sm py-6 text-gray-600">
          © {new Date().getFullYear()} {resume.fullName}. All rights reserved.
        </footer>
      </div>
    );
  };

// Template 2: Top Nav & Sections Layout
const TemplateTopNav = ({ resume }: { resume: any }) => {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900">
        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 bg-white shadow z-50">
          <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
            <div className="font-bold text-xl text-indigo-600">
              {resume.fullName || "Portfolio"}
            </div>
            <ul className="hidden md:flex space-x-6 font-semibold text-gray-700">
              <li><a href="#about" className="hover:text-indigo-600">About</a></li>
              <li><a href="#skills" className="hover:text-indigo-600">Skills</a></li>
              <li><a href="#experience" className="hover:text-indigo-600">Experience</a></li>
              <li><a href="#projects" className="hover:text-indigo-600">Projects</a></li>
              <li><a href="#education" className="hover:text-indigo-600">Education</a></li>
              <li><a href="#contact" className="hover:text-indigo-600">Contact</a></li>
            </ul>
          </div>
        </nav>
  
        {/* Hero / About Section */}
        <header id="about" className="pt-24 pb-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center md:text-left">
            <h1 className="text-5xl font-extrabold mb-2">{resume.fullName}</h1>
            <p className="text-2xl opacity-90 mb-4">{resume.title || "Professional"}</p>
            {resume.location && (
              <p className="flex items-center gap-2 justify-center md:justify-start text-sm text-indigo-100 mb-4">
                <FaMapMarkerAlt /> {resume.location}
              </p>
            )}
            {resume.summary && (
              <p className="max-w-xl mx-auto md:mx-0 text-lg text-white/90">
                {resume.summary}
              </p>
            )}
            {/* Social Links */}
            <div className="mt-6 flex gap-6 text-white text-xl justify-center md:justify-start">
              {resume.linkedInUrl && (
                <a href={resume.linkedInUrl} target="_blank" rel="noreferrer" className="hover:text-gray-200 transition">
                  <FaLinkedin />
                </a>
              )}
              {resume.githubUrl && (
                <a href={resume.githubUrl} target="_blank" rel="noreferrer" className="hover:text-gray-200 transition">
                  <FaGithub />
                </a>
              )}
              {resume.portfolioUrl && (
                <a href={resume.portfolioUrl} target="_blank" rel="noreferrer" className="hover:text-gray-200 transition">
                  <FaGlobe />
                </a>
              )}
            </div>
          </div>
        </header>
  
        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-16 space-y-24">
          {/* Skills */}
          <section id="skills">
            <h2 className="text-3xl font-bold mb-8 border-b-4 border-indigo-600 inline-block pb-1">Skills</h2>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              {resume.skills?.map((skill: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full font-semibold text-sm shadow-sm"
                  title={skill.level}
                >
                  {skill.name}
                </div>
              ))}
            </div>
          </section>
  
          {/* Experience */}
          {resume.experience?.length > 0 && (
            <section id="experience">
              <h2 className="text-3xl font-bold mb-8 border-b-4 border-indigo-600 inline-block pb-1">Experience</h2>
              <div className="space-y-8">
                {resume.experience.map((exp: any, idx: number) => (
                  <div key={idx} className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition">
                    <h3 className="text-xl font-semibold">{exp.jobTitle}</h3>
                    <p className="text-indigo-600 font-medium">{exp.company}</p>
                    <p className="text-sm text-gray-500 mb-2">
                      {exp.startDate} – {exp.endDate || "Present"}
                    </p>
                    <p className="text-gray-700">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
  
          {/* Projects */}
          <section id="projects">
            <h2 className="text-3xl font-bold mb-8 border-b-4 border-indigo-600 inline-block pb-1">Projects</h2>
            <div className="space-y-8">
              {resume.projects?.map((project: any, idx: number) => (
                <div key={idx} className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-semibold">{project.title}</h3>
                    {project.url && (
                      <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline text-sm">Visit</a>
                    )}
                  </div>
                  <p className="text-gray-700 mb-3">{project.description}</p>
                  {project.technologies && (
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech: string, i: number) => (
                        <span key={i} className="bg-indigo-50 text-indigo-700 text-xs px-3 py-1 rounded-full font-mono">{tech}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
  
          {/* Education */}
          <section id="education">
            <h2 className="text-3xl font-bold mb-8 border-b-4 border-indigo-600 inline-block pb-1">Education</h2>
            <div className="space-y-8">
              {resume.education?.map((edu: any, idx: number) => (
                <div key={idx} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                  <h3 className="font-semibold text-lg">{edu.degree}</h3>
                  <p className="text-indigo-700 font-medium">{edu.institution}</p>
                  <p className="text-gray-600">{edu.fieldOfStudy}</p>
                  <p className="text-gray-500 text-sm mt-1">{edu.startYear} - {edu.endYear || "Present"}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
  
        {/* Footer / Contact */}
        <footer id="contact" className="bg-indigo-700 text-indigo-100 py-12 mt-24 text-center">
          <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
          <div className="flex flex-col md:flex-row md:justify-center md:space-x-12 space-y-4 md:space-y-0 text-lg">
            {resume.email && (
              <a href={`mailto:${resume.email}`} className="hover:underline">{resume.email}</a>
            )}
            {resume.phone && <span>{resume.phone}</span>}
          </div>
          <p className="mt-6 text-sm opacity-80">© {new Date().getFullYear()} {resume.fullName}. All rights reserved.</p>
        </footer>
      </div>
    );
  };

// Template 3: Grid Cards Layout
const TemplateGridCards = ({ resume }: { resume: any }) => (
    <div className="min-h-screen bg-gray-50 p-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="text-center mb-16">
        <h1 className="text-5xl font-extrabold mb-2 text-gray-800">{resume.fullName}</h1>
        <p className="text-2xl text-indigo-700 mb-4">{resume.title || "Professional"}</p>
        {resume.location && (
          <p className="text-sm text-gray-600 mb-2 flex justify-center items-center gap-2">
            <FaMapMarkerAlt /> {resume.location}
          </p>
        )}
        {resume.summary && (
          <p className="max-w-3xl mx-auto text-gray-700">{resume.summary}</p>
        )}
        {/* Social Icons */}
        <div className="mt-6 flex justify-center gap-6 text-indigo-600 text-xl">
          {resume.linkedInUrl && (
            <a href={resume.linkedInUrl} target="_blank" rel="noreferrer" className="hover:text-indigo-800 transition">
              <FaLinkedin />
            </a>
          )}
          {resume.githubUrl && (
            <a href={resume.githubUrl} target="_blank" rel="noreferrer" className="hover:text-indigo-800 transition">
              <FaGithub />
            </a>
          )}
          {resume.portfolioUrl && (
            <a href={resume.portfolioUrl} target="_blank" rel="noreferrer" className="hover:text-indigo-800 transition">
              <FaGlobe />
            </a>
          )}
        </div>
      </header>
  
      {/* Skills */}
      <section className="mb-20">
        <h2 className="text-4xl font-bold mb-8 border-b-4 border-indigo-600 inline-block pb-1 text-center">
          Skills
        </h2>
        <div className="flex flex-wrap justify-center gap-6">
          {resume.skills?.map((skill: any, i: number) => (
            <div
              key={i}
              className="bg-indigo-100 px-5 py-2 rounded-full font-semibold text-indigo-800 shadow"
              title={skill.level}
            >
              {skill.name}
            </div>
          ))}
        </div>
      </section>
  
      {/* Experience */}
      {resume.experience?.length > 0 && (
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-8 border-b-4 border-indigo-600 inline-block pb-1 text-center">
            Experience
          </h2>
          <div className="space-y-8">
            {resume.experience.map((exp: any, idx: number) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold text-gray-800">{exp.jobTitle}</h3>
                <p className="text-indigo-700 font-medium">{exp.company}</p>
                <p className="text-sm text-gray-500">{exp.startDate} – {exp.endDate || "Present"}</p>
                <p className="text-gray-700 mt-2">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
  
      {/* Projects and Education Grid */}
      <div className="grid md:grid-cols-2 gap-12">
        {/* Projects */}
        <section>
          <h2 className="text-4xl font-bold mb-8 border-b-4 border-indigo-600 inline-block pb-1">
            Projects
          </h2>
          <div className="grid gap-8">
            {resume.projects?.map((project: any, idx: number) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-700 mb-3">{project.description}</p>
                {project.technologies && (
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech: string, i: number) => (
                      <span
                        key={i}
                        className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 text-indigo-600 hover:underline"
                  >
                    View Project
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
  
        {/* Education */}
        <section>
          <h2 className="text-4xl font-bold mb-8 border-b-4 border-indigo-600 inline-block pb-1">
            Education
          </h2>
          <div className="space-y-6">
            {resume.education?.map((edu: any, idx: number) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold">{edu.degree}</h3>
                <p className="text-indigo-700 font-medium">{edu.institution}</p>
                <p className="text-gray-600">{edu.fieldOfStudy}</p>
                <p className="text-gray-500 text-sm mt-1">
                  {edu.startYear} - {edu.endYear || "Present"}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
  
      {/* Footer */}
      <footer className="mt-24 text-center text-indigo-600">
        <h2 className="text-3xl font-bold mb-6">Contact Me</h2>
        <div className="flex flex-col md:flex-row justify-center gap-10 text-lg">
          {resume.email && (
            <a href={`mailto:${resume.email}`} className="hover:underline">
              {resume.email}
            </a>
          )}
          {resume.phone && <span>{resume.phone}</span>}
        </div>
        <p className="mt-8 text-sm opacity-70">
          © {new Date().getFullYear()} {resume.fullName}. All rights reserved.
        </p>
      </footer>
    </div>
  );

  const TemplateModernDark = ({ resume }: { resume: any }) => {
    return (
      <div className="bg-gray-950 text-white font-sans scroll-smooth">
        {/* Navbar */}
        <header className="sticky top-0 z-50 bg-gray-900 shadow">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-indigo-400">
              {resume.fullName}
            </h1>
            <nav className="space-x-6 text-sm font-medium text-indigo-200">
              <a href="#about" className="hover:text-white transition">About</a>
              <a href="#skills" className="hover:text-white transition">Skills</a>
              <a href="#experience" className="hover:text-white transition">Experience</a>
              <a href="#projects" className="hover:text-white transition">Projects</a>
              <a href="#education" className="hover:text-white transition">Education</a>
              <a href="#contact" className="hover:text-white transition">Contact</a>
            </nav>
          </div>
        </header>
  
        {/* Hero / About */}
        <section
          id="about"
          className="bg-gradient-to-b from-indigo-800 to-gray-900 py-20 text-center animate-fade-in"
        >
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-5xl font-extrabold text-white mb-2">{resume.fullName}</h2>
            <p className="text-xl text-indigo-300 mb-4">{resume.title}</p>
            {resume.location && (
              <p className="flex justify-center items-center gap-2 text-indigo-200 text-sm mb-4">
                <FaMapMarkerAlt /> {resume.location}
              </p>
            )}
            <p className="max-w-2xl mx-auto text-gray-300 text-lg">{resume.summary}</p>
  
            {/* Social Links */}
            <div className="mt-6 flex justify-center space-x-5 text-xl text-indigo-300">
              {resume.linkedInUrl && (
                <a href={resume.linkedInUrl} target="_blank" rel="noreferrer" className="hover:text-white">
                  <FaLinkedin />
                </a>
              )}
              {resume.githubUrl && (
                <a href={resume.githubUrl} target="_blank" rel="noreferrer" className="hover:text-white">
                  <FaGithub />
                </a>
              )}
              {resume.portfolioUrl && (
                <a href={resume.portfolioUrl} target="_blank" rel="noreferrer" className="hover:text-white">
                  <FaGlobe />
                </a>
              )}
            </div>
          </div>
        </section>
  
        <main className="max-w-6xl mx-auto px-6 py-20 space-y-24">
          {/* Skills */}
          <section id="skills" className="animate-slide-in">
            <h2 className="text-3xl font-bold text-indigo-400 mb-6">Skills</h2>
            <div className="flex flex-wrap gap-4">
              {resume.skills?.map((skill: any, idx: number) => (
                <span
                  key={idx}
                  title={skill.level}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:scale-105 transition-transform"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
  
          {/* Experience */}
          {resume.experience?.length > 0 && (
            <section id="experience" className="animate-slide-in">
              <h2 className="text-3xl font-bold text-indigo-400 mb-6">Experience</h2>
              <div className="space-y-6">
                {resume.experience.map((exp: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-xl transition"
                  >
                    <h3 className="text-xl font-semibold">{exp.jobTitle}</h3>
                    <p className="text-indigo-300">{exp.company}</p>
                    <p className="text-sm text-gray-400">
                      {exp.startDate} – {exp.endDate || "Present"}
                    </p>
                    <p className="text-gray-300 mt-2">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
  
          {/* Projects */}
          {resume.projects?.length > 0 && (
            <section id="projects" className="animate-slide-in">
              <h2 className="text-3xl font-bold text-indigo-400 mb-6">Projects</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {resume.projects.map((project: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-xl transition"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-300 hover:underline text-sm"
                        >
                          Visit
                        </a>
                      )}
                    </div>
                    <p className="text-gray-300">{project.description}</p>
                    {project.technologies && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {project.technologies.map((tech: string, i: number) => (
                          <span
                            key={i}
                            className="bg-indigo-500 text-white px-3 py-1 text-xs rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
  
          {/* Education */}
          {resume.education?.length > 0 && (
            <section id="education" className="animate-slide-in">
              <h2 className="text-3xl font-bold text-indigo-400 mb-6">Education</h2>
              <div className="space-y-6">
                {resume.education.map((edu: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-xl transition"
                  >
                    <h3 className="text-lg font-semibold text-white">{edu.degree}</h3>
                    <p className="text-indigo-300">{edu.institution}</p>
                    <p className="text-gray-300">{edu.fieldOfStudy}</p>
                    <p className="text-sm text-gray-400">
                      {edu.startYear} – {edu.endYear || "Present"}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
  
          {/* Contact */}
          <section id="contact" className="animate-fade-in text-center">
            <h2 className="text-3xl font-bold text-indigo-400 mb-6">Get in Touch</h2>
            <div className="flex flex-col md:flex-row justify-center gap-8 text-lg text-indigo-200">
              {resume.email && (
                <a
                  href={`mailto:${resume.email}`}
                  className="flex items-center gap-2 hover:underline"
                >
                  <FaEnvelope /> {resume.email}
                </a>
              )}
              {resume.phone && (
                <div className="flex items-center gap-2">
                  <FaPhone /> {resume.phone}
                </div>
              )}
            </div>
          </section>
        </main>
  
        <footer className="text-center py-6 bg-gray-900 text-gray-400 text-sm">
          © {new Date().getFullYear()} {resume.fullName}. All rights reserved.
        </footer>
      </div>
    );
  };
