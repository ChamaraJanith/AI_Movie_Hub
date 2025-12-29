import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post("http://localhost:5000/api/auth/register", { username, email, password });
            navigate("/login");
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#050505]">
            {/* Background Ambience */}
            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-neonPurple/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-neonRed/20 blur-[120px] rounded-full" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md p-8 glass-effect rounded-2xl relative z-10 mx-4"
            >
                <h2 className="text-3xl font-bold text-center mb-8 font-outfit text-white">
                    Join <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonPurple to-neonRed">the Future</span>
                </h2>

                <form className="flex flex-col gap-6" onSubmit={handleRegister}>
                    <div>
                        <input
                            type="text"
                            placeholder="Username"
                            className="w-full bg-black/30 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-neonPurple transition-colors"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="w-full bg-black/30 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-neonPurple transition-colors"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full bg-black/30 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-neonPurple transition-colors"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-neonPurple hover:bg-purple-700 text-white rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(188,19,254,0.4)] hover:shadow-[0_0_25px_rgba(188,19,254,0.6)] disabled:opacity-50"
                    >
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>

                    <p className="text-center text-gray-400 text-sm mt-2">
                        Already have an account? <Link to="/login" className="text-neonRed hover:text-white transition-colors">Login here</Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
};

export default Register;
