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

// Helper function to check token expiration
const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch (e) {
    return true;
  }
};

// Helper function to get user from localStorage with expiration check
const getStoredUser = () => {
  const token = localStorage.getItem("token");
  if (isTokenExpired(token)) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return null;
  }
  
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

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
    user: getStoredUser(),
    token: localStorage.getItem("token") && !isTokenExpired(localStorage.getItem("token")) 
      ? localStorage.getItem("token") 
      : null,
    error: null,
  } as AuthState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    checkAuth: (state) => {
      if (isTokenExpired(state.token)) {
        state.user = null;
        state.token = null;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload as string;
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

export const { logout, checkAuth } = authSlice.actions;
export default authSlice.reducer;