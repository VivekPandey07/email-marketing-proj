import { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../store";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resultAction = await dispatch(registerUser({ name, email, password }));
  
    if (registerUser.fulfilled.match(resultAction)) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-green-100 to-white">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-400 transition-all"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-400 transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-400 transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white py-3 rounded-lg text-lg font-semibold transition-transform transform hover:scale-105"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-700">
          Already have an account?{" "}
          <a href="/" className="text-green-500 font-medium hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
