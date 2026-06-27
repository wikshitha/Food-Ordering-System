import { useState, useContext } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import Spinner from "../components/Spinner";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
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
      const res = await api.post("/auth/register", form);

      // auto login after register
      const loginRes = await api.post("/auth/login", form);

      login(loginRes.data);

      navigate(loginRes.data.user.role === "admin" ? "/admin" : "/");
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary text-white p-4 relative overflow-hidden font-sans">
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-action/5 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md p-8 md:p-10 rounded-2xl bg-secondary/10 border border-secondary/25 backdrop-blur-xl shadow-2xl relative z-10 transition-all duration-300 hover:border-secondary/40">
        
        {/* Branding Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-action to-secondary flex items-center justify-center shadow-lg shadow-action/20 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6 text-white animate-pulse">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
            </svg>
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-action">Foodie App</span>
          <h1 className="text-2xl md:text-3xl font-extrabold mt-2 text-center bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-xs text-gray-400 mt-2 text-center leading-relaxed">
            Register as a customer to place orders and track payments in minutes.
          </p>
        </div>

        {/* Registration Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 tracking-wide block">
              Name
            </label>
            <div className="relative group">
              <input
                name="name"
                placeholder="Your name"
                onChange={handleChange}
                required
                className="w-full bg-primary/40 border border-secondary/30 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-action focus:ring-1 focus:ring-action/30 transition-all duration-200"
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 tracking-wide block">
              Email
            </label>
            <div className="relative group">
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                onChange={handleChange}
                required
                className="w-full bg-primary/40 border border-secondary/30 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-action focus:ring-1 focus:ring-action/30 transition-all duration-200"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 tracking-wide block">
              Password
            </label>
            <div className="relative group">
              <input
                name="password"
                type="password"
                placeholder="Create a password"
                onChange={handleChange}
                required
                className="w-full bg-primary/40 border border-secondary/30 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-action focus:ring-1 focus:ring-action/30 transition-all duration-200"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            className="w-full bg-action hover:bg-action/90 active:scale-[0.98] text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-action/25 transition-all duration-200 text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner className="-ml-1 mr-3 h-5 w-5" />
                Creating account...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>

        {/* Switch to Login Link */}
        <div className="mt-8 text-center text-xs text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-action font-semibold hover:underline hover:text-action/90 transition-colors duration-200"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}