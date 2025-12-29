import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/authContext';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { dispatch, isFetching } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        dispatch({ type: "LOGIN_START" });
        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
            dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
            navigate("/");
        } catch (err) {
            dispatch({ type: "LOGIN_FAILURE" });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#050505]">
            {/* Background Ambience */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-neonRed/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-neonPurple/20 blur-[120px] rounded-full" />

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-md p-8 glass-effect rounded-2xl relative z-10 mx-4"
            >
                <h2 className="text-3xl font-bold text-center mb-8 font-outfit text-white">
                    Onboard to <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonRed to-neonPurple">CinemaVerse</span>
                </h2>

                <form className="flex flex-col gap-6" onSubmit={handleLogin}>
                    <div>
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="w-full bg-black/30 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-neonRed transition-colors"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full bg-black/30 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-neonRed transition-colors"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isFetching}
                        className="w-full py-3 bg-neonRed hover:bg-red-700 text-white rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(255,0,51,0.4)] hover:shadow-[0_0_25px_rgba(255,0,51,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isFetching ? "Signing In..." : "Sign In"}
                    </button>

                    <p className="text-center text-gray-400 text-sm mt-2">
                        New here? <Link to="/register" className="text-neonPurple hover:text-white transition-colors">Create an account</Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
