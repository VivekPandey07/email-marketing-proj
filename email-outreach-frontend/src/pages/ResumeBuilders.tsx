import { useEffect, useState } from "react";
import { getResumeData, createResume, updateResume, deleteResume } from "../services/resumeService";
import { useSelector } from "react-redux";
import ResumeForm from "../components/ResumeForm";
import toast from "react-hot-toast";
import {
  DocumentIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  LinkIcon,
  EyeIcon,
  ArrowUpTrayIcon,
  SparklesIcon,
  ChartBarIcon,
  ClockIcon,
  ArrowPathIcon
} from "@heroicons/react/24/solid";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import ResumePDF from "./ResumePDF";

const ResumeBuilder = () => {
  const [resumes, setResumes] = useState<any[]>([]);
  const [selectedResume, setSelectedResume] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const { user, token } = useSelector((state: any) => state.auth);

  useEffect(() => {
    const fetchResumes = async () => {
      if (!user || !token) return;
      setIsLoading(true);
      try {
        const data = await getResumeData(user.id, token);
        setResumes(data);
      } catch (error) {
        toast.error("Failed to load resumes");
      } finally {
        setIsLoading(false);
      }
    };
    fetchResumes();
  }, [user, token]);

  const handleEdit = (resume: any) => {
    setSelectedResume(resume);
    setIsCreating(false);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setSelectedResume(null);
    setIsCreating(true);
    setShowModal(true);
  };

  const handleSave = async (resumeData: any) => {
    try {
      if (isCreating) {
        const newResume = await createResume({ ...resumeData, userId: user.id }, token);
        setResumes([newResume, ...resumes]);
        toast.success("Resume created successfully!");
      } else {
        const updatedResume = await updateResume(selectedResume._id, resumeData, token);
        setResumes(resumes.map(r => r._id === updatedResume._id ? updatedResume : r));
        toast.success("Resume updated successfully!");
      }
      setShowModal(false);
    } catch (error) {
      console.error("Error saving resume:", error);
      toast.error("Failed to save resume");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this resume?")) {
      try {
        await deleteResume(id, token);
        setResumes(resumes.filter(r => r._id !== id));
        toast.success("Resume deleted successfully!");
      } catch (error) {
        console.error("Error deleting resume:", error);
        toast.error("Failed to delete resume");
      }
    }
  };

  const handleViewPDF = async (resume: any) => {
    try {
      const blob = await pdf(<ResumePDF data={resume} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${resume.fullName || "resume"}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF");
    }
  };

  const handleCopyPortfolioLink = async (resumeId: string) => {
    try {
      const templateId = Math.floor(Math.random() * 4) + 1;
      const portfolioLink = `${window.location.origin}/portfolio/${resumeId}?template=${templateId}`;
      await navigator.clipboard.writeText(portfolioLink);
      toast.success("Portfolio link copied to clipboard!");
    } catch (error) {
      console.error("Error copying link:", error);
      toast.error("Failed to copy portfolio link.");
    }
  };

  const calculateCompletion = (resume: any) => {
    const requiredFields = ['fullName', 'email', 'experience', 'education', 'skills'];
    const completedFields = requiredFields.filter(field => {
      if (Array.isArray(resume[field])) {
        return resume[field].length > 0;
      }
      return resume[field] && resume[field].trim() !== '';
    });
    return Math.round((completedFields.length / requiredFields.length) * 100);
  };

  const filteredResumes = activeTab === 'all' 
    ? resumes 
    : resumes.filter(resume => calculateCompletion(resume) >= 80);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
              VITACRAFT
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Build, customize, and manage professional resumes that stand out
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Resumes</p>
                <p className="text-2xl font-bold text-indigo-600 mt-1">{resumes.length}</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-lg">
                <DocumentIcon className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Complete Profiles</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {resumes.filter(r => calculateCompletion(r) >= 80).length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <SparklesIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Last Updated</p>
                <p className="text-xl font-semibold text-gray-700 mt-1">
                  {resumes.length > 0 ? 
                    new Date(resumes[0].updatedAt).toLocaleDateString() : 
                    "Never"}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <ClockIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Portfolio Views</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">24</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-2 px-4 font-medium text-sm ${activeTab === 'all' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('all')}
          >
            All Resumes ({resumes.length})
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${activeTab === 'complete' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('complete')}
          >
            Complete Profiles ({resumes.filter(r => calculateCompletion(r) >= 80).length})
          </button>
        </div>

        {/* Main Content */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <ArrowPathIcon className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : (
          <>
            {/* Resumes Grid */}
            {filteredResumes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredResumes.map((resume) => {
                  const completion = calculateCompletion(resume);
                  return (
                    <div
                      key={resume._id}
                      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border overflow-hidden"
                    >
                      <div className="p-5">
                        <div className="flex items-start mb-4">
                          <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                            <DocumentIcon className="w-6 h-6 text-indigo-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800 truncate">
                              {resume.fullName || "Untitled Resume"}
                            </h3>
                            <p className="text-gray-500 text-sm truncate">{resume.email}</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-500">Completion</span>
                            <span className={`font-medium ${
                              completion >= 80 ? 'text-green-600' : 'text-yellow-600'
                            }`}>
                              {completion}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                completion >= 80 ? 'bg-green-500' : 'bg-yellow-500'
                              }`}
                              style={{ width: `${completion}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <span>Created: {new Date(resume.createdAt).toLocaleDateString()}</span>
                          <span>Updated: {new Date(resume.updatedAt).toLocaleDateString()}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleViewPDF(resume)}
                            className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 text-sm rounded-lg hover:bg-blue-100"
                          >
                            <EyeIcon className="w-4 h-4" /> Preview
                          </button>
                          <button
                            onClick={() => handleCopyPortfolioLink(resume._id)}
                            className="flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 text-sm rounded-lg hover:bg-green-100"
                          >
                            <LinkIcon className="w-4 h-4" /> Share
                          </button>
                          <button
                            onClick={() => handleEdit(resume)}
                            className="flex items-center justify-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-600 text-sm rounded-lg hover:bg-indigo-100"
                          >
                            <PencilIcon className="w-4 h-4" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(resume._id)}
                            className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 text-sm rounded-lg hover:bg-red-100"
                          >
                            <TrashIcon className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm border mb-8">
                <PlusIcon className="mx-auto h-12 w-12 text-indigo-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {activeTab === 'complete' ? 
                    "No complete resumes yet" : 
                    "No resumes created yet"}
                </h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  {activeTab === 'complete' ?
                    "Complete your resumes to see them here" :
                    "Get started by creating your first professional resume"}
                </p>
                <button
                  onClick={handleAddNew}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                  Create New Resume
                </button>
              </div>
            )}

            {/* Quick Tips */}
            {filteredResumes.length > 0 && (
              <div className="bg-indigo-50 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-indigo-800 mb-3">Quick Tips</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <SparklesIcon className="w-5 h-5 text-indigo-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">
                      Complete all sections to make your resume ATS-friendly and increase interview chances
                    </span>
                  </li>
                  <li className="flex items-start">
                    <LinkIcon className="w-5 h-5 text-indigo-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">
                      Share your portfolio link when applying for remote jobs to showcase your work
                    </span>
                  </li>
                  <li className="flex items-start">
                    <ArrowUpTrayIcon className="w-5 h-5 text-indigo-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">
                      Update your resumes regularly to reflect your latest skills and experiences
                    </span>
                  </li>
                </ul>
              </div>
            )}

            {/* Create New Button */}
            <div className="text-center">
              <button
                onClick={handleAddNew}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <PlusIcon className="w-5 h-5" />
                Create New Resume
              </button>
            </div>
          </>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <ResumeForm
                initialData={selectedResume || {}}
                onSave={handleSave}
                onClose={() => setShowModal(false)}
                isCreating={isCreating}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeBuilder;