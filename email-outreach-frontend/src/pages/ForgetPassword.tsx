import { useState } from "react";
import { Link } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store"; // Update path as per your structure
import { forgotPassword } from "../store/authSlice";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(forgotPassword({ email })).unwrap();
      setMessage("✅ Reset link sent! Please check your email.");
      setIsError(false);
    } catch (err: any) {
      setMessage(err || "❌ Something went wrong");
      setIsError(true);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-100 to-white px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        <div className="text-center mb-6">
          <FaLock className="text-4xl text-blue-500 mx-auto mb-2" />
          <h2 className="text-3xl font-bold text-gray-800">Forgot Password?</h2>
          <p className="text-sm text-gray-600 mt-1">No worries! We'll help you reset it.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email address"
            className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white py-3 rounded-lg font-semibold hover:scale-105 transition-transform"
          >
            Send Reset Link
          </button>
        </form>
        {message && (
          <p className={`text-center text-sm mt-4 ${isError ? "text-red-500" : "text-green-600"}`}>
            {message}
          </p>
        )}
        <p className="text-sm text-center mt-6 text-gray-700">
          Back to{" "}
          <Link to="/" className="text-blue-500 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
