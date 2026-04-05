import { useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import bgImage from "../assets/bgimg.jpg";


import { useEffect, useRef } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
        setError('All fields are required')
        return
    }

    try {
        const response = await API.post('/auth/login', { email, password })
        login(response.data.user, response.data.token)
        navigate('/')
    } catch (error) {
        setError(error.response?.data?.message || 'Something went wrong')
    }
}

  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);

  useEffect(() => {
    vantaEffect.current = window.VANTA.HALO({
      el: vantaRef.current,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      backgroundColor: 0x0a0a1a,
      baseColor: 0x1a59,
    });
    return () => {
      if (vantaEffect.current) vantaEffect.current.destroy();
    };
  }, []);

  return (
    <div
      ref={vantaRef}
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Top left logo */}
      <div className="absolute top-6 left-8 z-20">
        <h1 className="text-4xl font-bold" style={{ color: "#ffffff" }}>
          Docket.
        </h1>
      </div>

      {/* Glass card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 p-8 rounded-2xl w-full max-w-sm"
        style={{
          background: "rgba(10, 10, 30, 0.55)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <h2 className="text-2xl font-semibold text-white mb-1">Sign In</h2>
        <p className="text-sm mb-8" style={{ color: "#ffffff" }}>
          Your tasks, your rules.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Email or Phone"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 rounded-lg text-white text-sm outline-none transition-all"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 rounded-lg text-white text-sm outline-none transition-all"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          />

            {error && (
            <p className="text-sm text-center" style={{ color: "#ef4444" }}>
              {error}
            </p>
          )}

          <motion.button
            initial={{
              background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
            }}
            whileHover={{
              background: "linear-gradient(135deg, #3afcff, #48ACF0)",
              scale: 1.02,
              boxShadow: "0 0 30px rgba(56, 189, 248, 0.5)",
            }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="py-3 rounded-lg font-semibold text-white text-sm mt-2 w-full"
          >
            Sign In
          </motion.button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: "#ffffff" }}>
          New here?{" "}
          <span
            className="cursor-pointer font-semibold hover:underline"
            style={{ color: "#a78bfa" }}
            onClick={() => navigate("/register")}
          >
            Join Now
          </span>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;
