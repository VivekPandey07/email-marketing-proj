import { useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store"; // Adjust the import path if needed
import { resetPassword } from "../store/authSlice";

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setMsg("Invalid or missing token.");
      return;
    }

    try {
      await dispatch(resetPassword({ token, newPassword: password })).unwrap();
      setMsg("✅ Password reset successful. You can now log in.");
    } catch (err: any) {
      setMsg(err || "❌ Failed to reset password");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96 space-y-4">
        <h2 className="text-2xl font-bold text-center">Reset Password</h2>
        <input
          type="password"
          placeholder="New Password"
          className="w-full p-3 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded w-full">
          Reset Password
        </button>
        {msg && <p className="text-center mt-4">{msg}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
