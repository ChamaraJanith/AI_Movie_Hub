import React, { useContext, useState, useEffect } from 'react';
import { Search, User, LogOut, Palette } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const navigate = useNavigate();
    const { user, dispatch } = useContext(AuthContext);
    const { theme, themes, changeTheme } = useTheme();
    const [isScrolled, setIsScrolled] = useState(false);
    const [showThemeMenu, setShowThemeMenu] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSearch = (e) => {
        if (e.key === 'Enter' && e.target.value.trim()) {
            navigate(`/search?q=${encodeURIComponent(e.target.value.trim())}`);
        }
    };

    const handleLogout = () => {
        dispatch({ type: "LOGOUT" });
        navigate("/login");
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "bg-black/80 backdrop-blur-lg py-4 shadow-xl" : "bg-transparent py-6"
            }`}>
            <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
                <Link to="/" className="text-2xl md:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[var(--neon-red)] to-[var(--neon-purple)] font-outfit uppercase tracking-tighter">
                    CinemaVerse
                </Link>

                <div className="flex items-center gap-8">
                    {/* Navigation Links */}
                    <div className="hidden lg:flex items-center gap-8">
                        <Link to="/" className="text-gray-300 hover:text-white transition-all text-sm font-black uppercase tracking-widest hover:scale-110">Home</Link>
                        <Link to="/watchlist" className="text-gray-300 hover:text-white transition-all text-sm font-black uppercase tracking-widest hover:scale-110">Watchlist</Link>
                        <Link to="/ask-ai" className="text-gray-400 hover:text-neonPurple transition-all text-sm font-black uppercase tracking-widest flex items-center gap-2 group">
                            <span className="w-1.5 h-1.5 bg-neonPurple rounded-full group-hover:animate-ping"></span>
                            Ask AI
                        </Link>
                    </div>

                    {/* Theme Toggle */}
                    <div className="relative">
                        <button
                            onClick={() => setShowThemeMenu(!showThemeMenu)}
                            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
                            title="Change Theme"
                        >
                            <Palette size={18} />
                        </button>

                        {showThemeMenu && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl p-2 shadow-2xl z-50">
                                {Object.entries(themes).map(([key, value]) => (
                                    <button
                                        key={key}
                                        onClick={() => {
                                            changeTheme(key);
                                            setShowThemeMenu(false);
                                        }}
                                        className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between ${theme === key ? 'bg-neonPurple text-white' : 'hover:bg-white/5 text-gray-300'
                                            }`}
                                    >
                                        <span className="font-bold text-sm">{value.name}</span>
                                        {theme === key && <span className="text-xs">✓</span>}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Search Bar */}
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Search..."
                            onKeyDown={handleSearch}
                            className="bg-white/5 border border-white/10 rounded-full py-2 px-5 pl-12 text-sm focus:outline-none focus:border-neonPurple focus:bg-white/10 transition-all w-48 lg:w-72 text-gray-200 placeholder:text-gray-500"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-neonPurple transition-colors" size={18} />
                    </div>

                    {user ? (
                        <div className="flex items-center gap-6">
                            <Link to="/dashboard" className="hidden sm:flex items-center gap-2 group cursor-pointer">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--neon-red)] to-[var(--neon-purple)] p-[2px] group-hover:scale-110 transition-transform">
                                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[10px] font-black text-white uppercase">
                                        {user.username[0]}
                                    </div>
                                </div>
                                <span className="text-xs font-black text-white uppercase tracking-tighter group-hover:text-[var(--neon-red)] transition-colors">{user.username}</span>
                            </Link>
                            <button onClick={handleLogout} className="text-gray-400 hover:text-neonRed transition-all hover:scale-110" title="Logout">
                                <LogOut size={22} />
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="px-6 py-2 bg-[var(--neon-red)] hover:opacity-80 text-white rounded-full transition-all text-xs font-black uppercase tracking-widest shadow-[0_0_20px_var(--neon-red)]">
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

