import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../App.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="w-full fixed top-0 left-0 p-4 flex justify-between bg-white bg-opacity-10 backdrop-blur-lg shadow-lg z-50">
      {/* Logo */}
      <div className="text-white text-2xl font-bold pl-6">📧 Email Manager</div>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center space-x-6">
        <Link to="/dashboard" className="text-white font-semibold hover:text-gray-300 transition">Dashboard</Link>
        <Link to="/campaigns" className="text-white font-semibold hover:text-gray-300 transition">Campaigns</Link>
        <Link to="/templates" className="text-white font-semibold hover:text-gray-300 transition">Templates</Link>
        <Link to="/profile" className="text-white font-semibold hover:text-gray-300 transition">Profile</Link>

        {/* Logout button on desktop */}
        <button
          onClick={handleLogout}
          className="text-white font-semibold hover:text-red-500 transition ml-6"
        >
          Logout
        </button>
      </div>

      {/* Hamburger Menu for Mobile */}
      <div className="relative md:hidden">
        <div
          className="cursor-pointer p-2 bg-white bg-opacity-10 rounded-lg shadow-lg hover:bg-opacity-20 transition-all"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </div>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white bg-opacity-20 backdrop-blur-xl rounded-xl shadow-2xl p-4 transition-all animate-fadeIn">
            <Link to="/dashboard" className="block px-4 py-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg">Dashboard</Link>
            <Link to="/campaigns" className="block px-4 py-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg">Campaigns</Link>
            <Link to="/templates" className="block px-4 py-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg">Templates</Link>
            <Link to="/profile" className="block px-4 py-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg">Profile</Link>
            <button
              onClick={handleLogout}
              className="block w-full px-4 py-2 text-white hover:bg-red-500 hover:bg-opacity-70 rounded-lg mt-2"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
