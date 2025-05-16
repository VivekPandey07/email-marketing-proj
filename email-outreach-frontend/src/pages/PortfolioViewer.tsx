import React, { useEffect, useState } from "react";
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
      return <TemplateSidebar resume={resume} />;
    case 2:
      return <TemplateTopNav resume={resume} />;
    case 3:
      return <TemplateGridCards resume={resume} />;
    case 4:
      return <TemplateSplit resume={resume} />;
    default:
      return <TemplateSidebar resume={resume} />;
  }
};

export default PortfolioViewer;

/* ------------------- Templates Below ------------------- */

// Template 1: Sidebar Layout
const TemplateSidebar = ({ resume }: { resume: any }) => (
  <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
    <aside className="bg-indigo-700 text-white w-full md:w-64 p-8 flex flex-col items-center md:items-start">
      <div className="w-32 h-32 rounded-full bg-indigo-900 mb-6 flex items-center justify-center text-4xl font-bold select-none">
        {resume.fullName?.charAt(0) || "P"}
      </div>
      <h1 className="text-2xl font-bold mb-1">{resume.fullName}</h1>
      <p className="opacity-75 mb-6">{resume.title || "Professional"}</p>

      <div className="space-y-4 w-full">
        {resume.email && (
          <p>
            <strong>Email:</strong> <br />
            <a href={`mailto:${resume.email}`} className="hover:underline">
              {resume.email}
            </a>
          </p>
        )}
        {resume.phone && (
          <p>
            <strong>Phone:</strong> <br />
            {resume.phone}
          </p>
        )}

        <div>
          <h2 className="font-semibold mb-2">Skills</h2>
          <ul className="list-disc list-inside text-sm space-y-1">
            {resume.skills?.map((skill: any, i: number) => (
              <li key={i}>{skill.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </aside>

    <main className="flex-1 p-8 max-w-4xl mx-auto">
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-3 border-b-4 border-indigo-600 inline-block pb-1">
          About Me
        </h2>
        <p className="text-lg leading-relaxed">{resume.summary}</p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 border-b-4 border-indigo-600 inline-block pb-1">
          Projects
        </h2>
        <div className="space-y-6">
          {resume.projects?.map((project: any, idx: number) => (
            <div
              key={idx}
              className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold flex justify-between items-center">
                {project.title}
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline text-sm"
                  >
                    Link
                  </a>
                )}
              </h3>
              <p className="mt-2 text-gray-700">{project.description}</p>
              {project.technologies && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {project.technologies.map((tech: string, i: number) => (
                    <span
                      key={i}
                      className="bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full font-mono"
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

      <section>
        <h2 className="text-3xl font-bold mb-6 border-b-4 border-indigo-600 inline-block pb-1">
          Education
        </h2>
        <div className="space-y-6">
          {resume.education?.map((edu: any, idx: number) => (
            <div
              key={idx}
              className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-lg">{edu.degree}</h3>
              <p className="text-indigo-700 font-medium">{edu.institution}</p>
              <p className="text-gray-600">{edu.fieldOfStudy}</p>
              <p className="text-gray-500 text-sm mt-1">
                {edu.startYear} - {edu.endYear || "Present"}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  </div>
);

// Template 2: Top Nav & Sections Layout
const TemplateTopNav = ({ resume }: { resume: any }) => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="fixed top-0 left-0 right-0 bg-white shadow z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
          <div className="font-bold text-xl">{resume.fullName || "Portfolio"}</div>
          <ul className="hidden md:flex space-x-6 font-semibold">
            <li>
              <a href="#about" className="hover:text-indigo-600">
                About
              </a>
            </li>
            <li>
              <a href="#skills" className="hover:text-indigo-600">
                Skills
              </a>
            </li>
            <li>
              <a href="#projects" className="hover:text-indigo-600">
                Projects
              </a>
            </li>
            <li>
              <a href="#education" className="hover:text-indigo-600">
                Education
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-indigo-600">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <header
        id="about"
        className="pt-24 pb-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
      >
        <div className="max-w-4xl mx-auto px-4 text-center md:text-left">
          <h1 className="text-5xl font-extrabold mb-2">{resume.fullName}</h1>
          <p className="text-2xl opacity-90 mb-6">{resume.title || "Professional"}</p>
          {resume.summary && <p className="max-w-xl mx-auto md:mx-0 text-lg">{resume.summary}</p>}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-16 space-y-24">
        <section id="skills">
          <h2 className="text-3xl font-bold mb-8 border-b-4 border-indigo-600 inline-block pb-1">
            Skills
          </h2>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            {resume.skills?.map((skill: any, idx: number) => (
              <div
                key={idx}
                className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full font-semibold text-sm shadow-sm"
                title={skill.level ? `Level: ${skill.level}` : undefined}
              >
                {skill.name} {skill.yearsOfExperience ? `(${skill.yearsOfExperience} yrs)` : ""}
              </div>
            ))}
          </div>
        </section>

        <section id="projects">
          <h2 className="text-3xl font-bold mb-8 border-b-4 border-indigo-600 inline-block pb-1">
            Projects
          </h2>
          <div className="space-y-8">
            {resume.projects?.map((project: any, idx: number) => (
              <div
                key={idx}
                className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline text-sm"
                    >
                      Visit
                    </a>
                  )}
                </div>
                <p className="text-gray-700 mb-3">{project.description}</p>
                {project.technologies && (
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech: string, i: number) => (
                      <span
                        key={i}
                        className="bg-indigo-50 text-indigo-700 text-xs px-3 py-1 rounded-full font-mono"
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

        <section id="education">
          <h2 className="text-3xl font-bold mb-8 border-b-4 border-indigo-600 inline-block pb-1">
            Education
          </h2>
          <div className="space-y-8">
            {resume.education?.map((edu: any, idx: number) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <h3 className="font-semibold text-lg">{edu.degree}</h3>
                <p className="text-indigo-700 font-medium">{edu.institution}</p>
                <p className="text-gray-600">{edu.fieldOfStudy}</p>
                <p className="text-gray-500 text-sm mt-1">
                  {edu.startYear} - {edu.endYear || "Present"}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer
        id="contact"
        className="bg-indigo-700 text-indigo-100 py-12 mt-24 text-center"
      >
        <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
        <div className="flex flex-col md:flex-row md:justify-center md:space-x-12 space-y-4 md:space-y-0">
          {resume.email && (
            <a
              href={`mailto:${resume.email}`}
              className="hover:underline"
            >
              {resume.email}
            </a>
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
    <header className="text-center mb-16">
      <h1 className="text-5xl font-extrabold mb-2">{resume.fullName}</h1>
      <p className="text-2xl text-indigo-700 mb-6">{resume.title || "Professional"}</p>
      {resume.summary && (
        <p className="max-w-3xl mx-auto text-gray-700">{resume.summary}</p>
      )}
    </header>

    <section className="mb-20">
      <h2 className="text-4xl font-bold mb-8 border-b-4 border-indigo-600 inline-block pb-1 text-center">
        Skills
      </h2>
      <div className="flex flex-wrap justify-center gap-6">
        {resume.skills?.map((skill: any, i: number) => (
          <div
            key={i}
            className="bg-indigo-100 px-5 py-2 rounded-full font-semibold text-indigo-800 shadow"
            title={skill.level ? `Level: ${skill.level}` : undefined}
          >
            {skill.name}
          </div>
        ))}
      </div>
    </section>

    <div className="grid md:grid-cols-2 gap-12">
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

    <footer className="mt-24 text-center text-indigo-600">
      <h2 className="text-3xl font-bold mb-6">Contact Me</h2>
      <div className="flex flex-col md:flex-row justify-center gap-10 text-lg">
        {resume.email && <a href={`mailto:${resume.email}`} className="hover:underline">{resume.email}</a>}
        {resume.phone && <span>{resume.phone}</span>}
      </div>
      <p className="mt-8 text-sm opacity-70">© {new Date().getFullYear()} {resume.fullName}. All rights reserved.</p>
    </footer>
  </div>
);

// Template 4: Split Layout
const TemplateSplit = ({ resume }: { resume: any }) => (
  <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
    <div className="md:w-1/3 bg-gradient-to-b from-purple-700 via-indigo-700 to-indigo-900 text-white p-12 flex flex-col justify-center items-center text-center space-y-6">
      <div className="w-32 h-32 rounded-full bg-indigo-900 flex items-center justify-center text-5xl font-bold">
        {resume.fullName?.charAt(0)}
      </div>
      <h1 className="text-4xl font-extrabold">{resume.fullName}</h1>
      <p className="text-lg opacity-90">{resume.title || "Professional"}</p>
      {resume.summary && <p className="mt-6 max-w-xs">{resume.summary}</p>}

      <div className="mt-8 space-y-4">
        {resume.email && (
          <p>
            <strong>Email: </strong>
            <a href={`mailto:${resume.email}`} className="underline">
              {resume.email}
            </a>
          </p>
        )}
        {resume.phone && (
          <p>
            <strong>Phone: </strong>
            {resume.phone}
          </p>
        )}
      </div>
    </div>

    <div className="md:w-2/3 p-12 overflow-y-auto">
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6 border-b-4 border-indigo-600 pb-2 inline-block">
          Skills
        </h2>
        <div className="flex flex-wrap gap-4">
          {resume.skills?.map((skill: any, idx: number) => (
            <span
              key={idx}
              className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full font-semibold text-sm shadow-sm"
              title={skill.level ? `Level: ${skill.level}` : undefined}
            >
              {skill.name}
            </span>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6 border-b-4 border-indigo-600 pb-2 inline-block">
          Projects
        </h2>
        <div className="space-y-8">
          {resume.projects?.map((project: any, idx: number) => (
            <div
              key={idx}
              className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold flex justify-between items-center">
                {project.title}
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline text-sm"
                  >
                    Link
                  </a>
                )}
              </h3>
              <p className="mt-2 text-gray-700">{project.description}</p>
              {project.technologies && (
                <div className="flex flex-wrap gap-2 mt-3">
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
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 border-b-4 border-indigo-600 pb-2 inline-block">
          Education
        </h2>
        <div className="space-y-6">
          {resume.education?.map((edu: any, idx: number) => (
            <div
              key={idx}
              className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-lg">{edu.degree}</h3>
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
  </div>
);
