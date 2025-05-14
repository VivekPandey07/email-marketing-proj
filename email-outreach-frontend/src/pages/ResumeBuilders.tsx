import { useEffect, useState } from "react";
import { getResumeData, createResume, updateResume, deleteResume } from "../services/resumeService";
import { useSelector } from "react-redux";
import ResumeForm from "../components/ResumeForm";

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
        const newResume = await createResume({
          ...resumeData,
          userId: user.id
        }, token);
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Stats */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-indigo-700 mb-2">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
              VITACRAFT
            </span>
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Build and manage your professional resumes
          </p>
          
          <div className="flex justify-center space-x-6 mb-8">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 w-40">
              <p className="text-gray-500 text-sm">Total Resumes</p>
              <p className="text-2xl font-bold text-indigo-600">{resumes.length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 w-40">
              <p className="text-gray-500 text-sm">Last Updated</p>
              <p className="text-lg font-medium text-gray-700">
                {resumes.length > 0 ? 
                  new Date(resumes[0].updatedAt).toLocaleDateString() : 
                  'Never'}
              </p>
            </div>
          </div>
        </div>

        {/* Resumes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {resumes.map((resume) => (
            <div 
              key={resume._id} 
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-indigo-100 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{resume.fullName || 'Untitled Resume'}</h3>
                    <p className="text-gray-500">{resume.email}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-6">
                  <span className="text-sm text-gray-500">
                    Created: {new Date(resume.createdAt).toLocaleDateString()}
                  </span>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(resume)}
                      className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(resume._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {resumes.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No resumes yet</h3>
            <p className="mt-1 text-gray-500">Get started by creating your first resume.</p>
            <div className="mt-6">
              <button
                onClick={handleAddNew}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Resume
              </button>
            </div>
          </div>
        )}

        {/* Add New Resume Button */}
        {resumes.length > 0 && (
          <div className="text-center">
            <button
              onClick={handleAddNew}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create New Resume
            </button>
          </div>
        )}

        {/* Edit/Add Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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