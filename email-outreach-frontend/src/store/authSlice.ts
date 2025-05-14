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

interface ForgotPasswordData {
  email: string;
}

interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData: loginData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, userData);
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      return {
        token: response.data.access_token,
        user: response.data.user
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return rejectWithValue("Unauthorized: Invalid email or password.");
      }
      return rejectWithValue("An unexpected error occurred.");
    }
  }
);

// Forgot Password Thunk
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (data: ForgotPasswordData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to send reset email.");
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data: ResetPasswordData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/reset-password`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to reset password.");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData: registerData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/signup`, userData);
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return {
        token: response.data.access_token,
        user: response.data.user
      };
    } catch (error) {
      return rejectWithValue("Registration failed. Please try again.");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: localStorage.getItem("user") 
      ? JSON.parse(localStorage.getItem("user") as any)
      : null,
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
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
