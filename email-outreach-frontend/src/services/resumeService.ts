import axios from "axios";

const API_URL = "http://localhost:5000/resume"; // Set this in .env

export const getResumeData = async (userId: string, token: string) => {
  try {
    const res = await axios.get(`${API_URL}/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.resumes; // Changed to access the 'resumes' array
  } catch (error) {
    console.error("Error fetching resumes:", error);
    return [];
  }
};

export const createResume = async (resumeData: any, token: string) => {
  try {
    const res = await axios.post(`${API_URL}`, resumeData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.resume;
  } catch (error) {
    console.error("Error creating resume:", error);
    throw error;
  }
};

export const updateResume = async (id: string, resumeData: any, token: string) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, resumeData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.resume;
  } catch (error) {
    console.error("Error updating resume:", error);
    throw error;
  }
};

export const deleteResume = async (id: string, token: string) => {
  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error deleting resume:", error);
    throw error;
  }
};