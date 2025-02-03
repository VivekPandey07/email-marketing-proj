// src/pages/Campaign.tsx
import React, { useState } from 'react';
import axios from 'axios';

const Campaign = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] || null);
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
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('CSV Uploaded Successfully!');
      setFile(null);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
      <div className="w-full max-w-4xl bg-white bg-opacity-10 p-8 rounded-2xl shadow-2xl backdrop-blur-lg mt-16">
        <h2 className="text-3xl font-semibold text-center mb-8">📩 Upload CSV for Email Campaign</h2>

        {/* File Upload Section */}
        <div className="flex flex-col items-center gap-4">
          <label className="bg-green-500 text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-green-600 transition duration-300">
            <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
            📂 Choose CSV File
          </label>

          {file && (
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm text-gray-200">
                Selected File: <span className="font-medium">{file.name}</span>
              </p>
              <button onClick={() => setFile(null)} className="bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600 transition">
                ❌ Remove File
              </button>
            </div>
          )}

          <button
            onClick={handleUpload}
            className={`py-2 px-6 rounded-lg transition duration-300 ${
              file ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-gray-400 text-gray-200 cursor-not-allowed'
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

export default Campaign;
