import { useState, useContext } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await api.post("/auth/login", form);

      login(res.data);

      navigate(res.data.user.role === "admin" ? "/admin" : "/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary text-white p-4 relative overflow-hidden font-sans">
      
      {/* Background Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-action/5 blur-[120px] pointer-events-none"></div>

      {/* Card */}
      <div className="w-full max-w-md p-8 md:p-10 rounded-2xl bg-secondary/10 border border-secondary/25 backdrop-blur-xl shadow-2xl relative z-10 transition-all duration-300 hover:border-secondary/40">

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-action to-secondary flex items-center justify-center shadow-lg shadow-action/20 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6 text-white animate-pulse">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25V9m-4.5 0h16.5m-16.5 0A2.25 2.25 0 0 0 3 11.25v7.5A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75v-7.5A2.25 2.25 0 0 0 18.75 9m-16.5 0h16.5" />
            </svg>
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-action">
            Foodie App
          </span>

          <h1 className="text-2xl md:text-3xl font-extrabold mt-2 text-center bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Welcome Back
          </h1>

          <p className="text-xs text-gray-400 mt-2 text-center leading-relaxed">
            Sign in to continue ordering your favorite meals.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 tracking-wide block">
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              onChange={handleChange}
              required
              className="w-full bg-primary/40 border border-secondary/30 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-action focus:ring-1 focus:ring-action/30 transition-all duration-200"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 tracking-wide block">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Enter password"
              onChange={handleChange}
              required
              className="w-full bg-primary/40 border border-secondary/30 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-action focus:ring-1 focus:ring-action/30 transition-all duration-200"
            />
          </div>

          {/* Button */}
          <button
            className="w-full bg-action hover:bg-action/90 active:scale-[0.98] text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-action/25 transition-all duration-200 text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner className="w-5 h-5" />
                Signing in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Switch */}
        <div className="mt-8 text-center text-xs text-gray-400">
          New here?{" "}
          <Link
            to="/register"
            className="text-action font-semibold hover:underline hover:text-action/90 transition-colors duration-200"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}