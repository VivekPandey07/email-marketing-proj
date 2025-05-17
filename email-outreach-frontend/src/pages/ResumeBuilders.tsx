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
} from "@heroicons/react/24/solid";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import ResumePDF from "./ResumePDF";

const ResumeBuilder = () => {
  const [resumes, setResumes] = useState<any[]>([]);
  const [selectedResume, setSelectedResume] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const { user, token } = useSelector((state: any) => state.auth);

  useEffect(() => {
    const fetchResumes = async () => {
      if (!user || !token) return;
      const data = await getResumeData(user.id, token);
      setResumes(data);
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
      } else {
        const updatedResume = await updateResume(selectedResume._id, resumeData, token);
        setResumes(resumes.map(r => r._id === updatedResume._id ? updatedResume : r));
      }
      setShowModal(false);
    } catch (error) {
      console.error("Error saving resume:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteResume(id, token);
      setResumes(resumes.filter(r => r._id !== id));
    } catch (error) {
      console.error("Error deleting resume:", error);
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

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-indigo-700">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
              VITACRAFT
            </span>
          </h1>
          <p className="text-gray-600 text-lg mt-2">
            Build and manage your professional resumes
          </p>

          <div className="flex justify-center gap-6 mt-6">
            <div className="bg-white p-4 rounded-xl shadow border w-40">
              <p className="text-gray-500 text-sm">Total Resumes</p>
              <p className="text-2xl font-bold text-indigo-600">{resumes.length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow border w-40">
              <p className="text-gray-500 text-sm">Last Updated</p>
              <p className="text-lg font-medium text-gray-700">
                {resumes.length > 0 ? new Date(resumes[0].updatedAt).toLocaleDateString() : "Never"}
              </p>
            </div>
          </div>
        </div>

        {/* Section Title */}
        {resumes.length > 0 && (
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Resumes</h2>
        )}

        {/* Resumes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {resumes.map((resume) => (
            <div
              key={resume._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 border"
            >
              <div className="flex items-center mb-4">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                  <DocumentIcon className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{resume.fullName || "Untitled Resume"}</h3>
                  <p className="text-gray-500 text-sm">{resume.email}</p>
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-4">
                Created: {new Date(resume.createdAt).toLocaleDateString()}
              </p>

              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  onClick={() => handleViewPDF(resume)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                >
                  <EyeIcon className="w-4 h-4" /> View PDF
                </button>
                <button
                  onClick={() => handleCopyPortfolioLink(resume._id)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                >
                  <LinkIcon className="w-4 h-4" /> Copy Portfolio Link
                </button>
                <button
                  onClick={() => handleEdit(resume)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
                >
                  <PencilIcon className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(resume._id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                >
                  <TrashIcon className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {resumes.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow border mb-12">
            <PlusIcon className="mx-auto h-12 w-12 text-indigo-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">No resumes yet</h3>
            <p className="text-gray-500">Click below to create your first resume.</p>
            <button
              onClick={handleAddNew}
              className="mt-6 inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
            >
              <PlusIcon className="w-4 h-4" />
              New Resume
            </button>
          </div>
        )}

        {/* Add New Resume Button */}
        {resumes.length > 0 && (
          <div className="text-center">
            <button
              onClick={handleAddNew}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white text-base rounded-lg hover:bg-indigo-700"
            >
              <PlusIcon className="w-5 h-5" />
              Create New Resume
            </button>
          </div>
        )}

        {/* Modal with animation */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-2xl font-bold text-indigo-700 mb-4">
                {/* {isCreating ? "Create New Resume" : "Edit Resume"} */}
              </h2>
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