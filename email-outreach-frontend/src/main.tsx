import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"; 
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Campaign from "./pages/Campaign";
import Navbar from "./pages/Navbar"; // Import Navbar

const App = () => {
  const location = useLocation();  // Get the current route

  // Check if the current route is either Login or Signup
  const showNavbar = !['/', '/signup'].includes(location.pathname);

  return (
    <div>
      {/* Conditionally render the Navbar based on the current route */}
      {showNavbar && <Navbar />}
      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/campaigns" element={<Campaign />} />
        </Route>
        {/* <Route element={<ProtectedRoute />}>
          <Route path="/templates" element={<Templates />} />
        </Route> */}

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
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
