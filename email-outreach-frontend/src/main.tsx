import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"; 
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgetPassword from "./pages/ForgetPassword";
import ProtectedRoute from "./routes/ProtectedRoute";
import Navbar from "./pages/Navbar"; // Import Navbar
import ResetPassword from "./pages/ResetPassword";
import ResumeBuilder from "./pages/ResumeBuilders";
import PortfolioViewer from "./pages/PortfolioViewer";
import { Toaster } from "react-hot-toast";

const App = () => {
  const location = useLocation();  // Get the current route

  // Check if the current route is either Login or Signup
  const showNavbar = false

  return (
    <div>
      {showNavbar && <Navbar />}
      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<ResumeBuilder />} />
        </Route>

        <Route path="/portfolio/:id" element={<PortfolioViewer />} />

        {/* Catch-all route for unknown paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <>
          <Toaster
            position="bottom-left" 
            toastOptions={{
              success: {
                style: {
                  background: '#4ade80', 
                  color: 'white',
                },
              },
              error: {
                style: {
                  background: '#f87171', 
                  color: 'white',
                },
              },
            }}
          />
          <App />
        </>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
