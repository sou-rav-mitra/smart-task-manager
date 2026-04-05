import { useState, useEffect, useRef } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await API.post("/auth/register", { name, email, password });
    login(response.data.user, response.data.token);
    navigate("/");
  };

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
        <h2 className="text-2xl font-semibold text-white mb-1">Create Account</h2>
        <p className="text-sm mb-8" style={{ color: "#ffffff" }}>
          Start organizing your life.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-3 rounded-lg text-white text-sm outline-none transition-all"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          />
          <input
            type="text"
            placeholder="Email"
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
            Get Started
          </motion.button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: "#ffffff" }}>
          Already have an account?{" "}
          <span
            className="cursor-pointer font-semibold hover:underline"
            style={{ color: "#a78bfa" }}
            onClick={() => navigate("/login")}
          >
            Sign In
          </span>
        </p>
      </motion.div>
    </div>
  );
}

export default Register;