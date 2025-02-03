import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/auth";

interface loginData {
  email: string;
  password: string;
}

interface registerData {
  name: string;
  email: string;
  password: string;
}

interface AuthState {
  user: any | null;
  token: string | null;
  error: string | null; 
}

export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData: loginData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, userData);
      console.log(response.data.access_token)
      localStorage.setItem("token", response.data.access_token);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return rejectWithValue("Unauthorized: Invalid email or password.");
      }
      return rejectWithValue("An unexpected error occurred.");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData: registerData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/signup`, userData);
      localStorage.setItem("token", response.data.access_token);
      return response.data;
    } catch (error) {
      return rejectWithValue("Registration failed. Please try again.");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null,
    error: null, // Initialize error state
  } as AuthState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null; // Reset error on logout
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null; // Clear error on successful login
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null; // Clear error on successful registration
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload as string; // Set error message
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload as string; // Set error message
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
