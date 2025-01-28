import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Ensure Tailwind is imported here

const Dashboard = () => {
  const [stats, setStats] = useState({ totalEmails: 0, sentEmails: 0, failedEmails: 0 });
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/email/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      navigate('/');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return alert('Please select a file first');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/email/upload-csv', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('CSV Uploaded Successfully!');
      setFile(null); // ✅ Clear file after upload
      fetchStats();
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
      <div className="w-full max-w-4xl bg-white bg-opacity-10 p-8 rounded-2xl shadow-2xl backdrop-blur-lg">
        <h2 className="text-3xl font-semibold text-center mb-8">📩 Email Campaign Dashboard</h2>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <h3 className="text-xl font-bold">Sent Emails</h3>
            <p className="text-3xl font-semibold">{stats.sentEmails}</p>
          </div>
          <div className="bg-orange-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <h3 className="text-xl font-bold">Failed Emails</h3>
            <p className="text-3xl font-semibold">{stats.failedEmails}</p>
          </div>
          <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <h3 className="text-xl font-bold">Total Emails</h3>
            <p className="text-3xl font-semibold">{stats.totalEmails}</p>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="flex flex-col items-center gap-4">
          <label className="bg-green-500 text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-green-600 transition duration-300">
            <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
            <span className="text-lg">📂 Choose CSV File</span>
          </label>

          {file && (
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm text-gray-200">
                Selected File: <span className="font-medium">{file.name}</span>
              </p>
              <button
                onClick={handleRemoveFile}
                className="bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600 transition duration-300"
              >
                ❌ Remove File
              </button>
            </div>
          )}

          <button
            onClick={handleUpload}
            className={`py-2 px-6 rounded-lg transition duration-300 ${
              file
                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
            disabled={!file}
          >
            🚀 Upload CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
