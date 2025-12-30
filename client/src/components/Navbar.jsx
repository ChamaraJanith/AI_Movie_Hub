import React, { useContext, useState, useEffect } from "react";
import { Search, User, LogOut, Palette, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext);
  const { theme, themes, changeTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

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

  // Close mobile menu on route change
  useEffect(() => {
    setShowMobileMenu(false);
    setShowMobileSearch(false);
  }, [navigate]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showMobileMenu]);

  const handleSearch = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      navigate(`/search?q=${encodeURIComponent(e.target.value.trim())}`);
      setShowMobileSearch(false);
    }
  };

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/login");
    setShowMobileMenu(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-black/90 backdrop-blur-lg py-3 md:py-4 shadow-xl"
            : "bg-transparent py-4 md:py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl sm:text-2xl md:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[var(--neon-red)] to-[var(--neon-purple)] font-outfit uppercase tracking-tighter z-50"
          >
            CinemaVerse
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-8">
            {/* Navigation Links */}
            <div className="flex items-center gap-6 xl:gap-8">
              <Link
                to="/"
                className="text-gray-300 hover:text-white transition-all text-sm font-black uppercase tracking-widest hover:scale-110"
              >
                Home
              </Link>
              <Link
                to="/watchlist"
                className="text-gray-300 hover:text-white transition-all text-sm font-black uppercase tracking-widest hover:scale-110"
              >
                Watchlist
              </Link>
              <Link
                to="/ask-ai"
                className="text-gray-400 hover:text-neonPurple transition-all text-sm font-black uppercase tracking-widest flex items-center gap-2 group"
              >
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
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between ${
                        theme === key
                          ? "bg-neonPurple text-white"
                          : "hover:bg-white/5 text-gray-300"
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
                className="bg-white/5 border border-white/10 rounded-full py-2 px-5 pl-12 text-sm focus:outline-none focus:border-neonPurple focus:bg-white/10 transition-all w-48 xl:w-72 text-gray-200 placeholder:text-gray-500"
              />
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-neonPurple transition-colors"
                size={18}
              />
            </div>

            {user ? (
              <div className="flex items-center gap-4 xl:gap-6">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--neon-red)] to-[var(--neon-purple)] p-[2px] group-hover:scale-110 transition-transform">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[10px] font-black text-white uppercase">
                      {user.username[0]}
                    </div>
                  </div>
                  <span className="text-xs font-black text-white uppercase tracking-tighter group-hover:text-[var(--neon-red)] transition-colors">
                    {user.username}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-neonRed transition-all hover:scale-110"
                  title="Logout"
                >
                  <LogOut size={22} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2 bg-[var(--neon-red)] hover:opacity-80 text-white rounded-full transition-all text-xs font-black uppercase tracking-widest shadow-[0_0_20px_var(--neon-red)]"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="flex lg:hidden items-center gap-3">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
            >
              <Search size={18} />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all z-50"
            >
              {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {showMobileSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden border-t border-white/10 bg-black/50 backdrop-blur-lg"
            >
              <div className="px-4 sm:px-6 py-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search movies..."
                    onKeyDown={handleSearch}
                    autoFocus
                    className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-5 pl-12 text-sm focus:outline-none focus:border-neonPurple focus:bg-white/10 transition-all text-gray-200 placeholder:text-gray-500"
                  />
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    size={18}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-40 lg:hidden"
            onClick={() => setShowMobileMenu(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-full sm:w-80 bg-gradient-to-br from-black via-black to-[var(--neon-red)]/10 border-l border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full pt-24 px-6 pb-8">
                {/* User Info */}
                {user && (
                  <div className="mb-8 pb-6 border-b border-white/10">
                    <Link
                      to="/dashboard"
                      onClick={() => setShowMobileMenu(false)}
                      className="flex items-center gap-3 group"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[var(--neon-red)] to-[var(--neon-purple)] p-[2px] group-hover:scale-110 transition-transform">
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-sm font-black text-white uppercase">
                          {user.username[0]}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-black text-white uppercase tracking-tight">
                          {user.username}
                        </p>
                        <p className="text-xs text-gray-400">View Dashboard</p>
                      </div>
                    </Link>
                  </div>
                )}

                {/* Navigation Links */}
                <nav className="flex-1 space-y-2">
                  <Link
                    to="/"
                    onClick={() => setShowMobileMenu(false)}
                    className="block px-4 py-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all text-base font-black uppercase tracking-wide"
                  >
                    Home
                  </Link>
                  <Link
                    to="/watchlist"
                    onClick={() => setShowMobileMenu(false)}
                    className="block px-4 py-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all text-base font-black uppercase tracking-wide"
                  >
                    Watchlist
                  </Link>
                  <Link
                    to="/ask-ai"
                    onClick={() => setShowMobileMenu(false)}
                    className="block px-4 py-4 text-gray-400 hover:text-neonPurple hover:bg-white/5 rounded-xl transition-all text-base font-black uppercase tracking-wide flex items-center gap-2"
                  >
                    <span className="w-2 h-2 bg-neonPurple rounded-full animate-pulse"></span>
                    Ask AI
                  </Link>
                </nav>

                {/* Theme Selector */}
                <div className="mb-6 pb-6 border-t border-white/10 pt-6">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                    Theme
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(themes).map(([key, value]) => (
                      <button
                        key={key}
                        onClick={() => {
                          changeTheme(key);
                        }}
                        className={`px-4 py-3 rounded-lg transition-all text-sm font-bold ${
                          theme === key
                            ? "bg-neonPurple text-white"
                            : "bg-white/5 text-gray-300 hover:bg-white/10"
                        }`}
                      >
                        {value.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {user ? (
                    <button
                      onClick={handleLogout}
                      className="w-full px-6 py-4 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-xl transition-all text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-red-500/30"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setShowMobileMenu(false)}
                      className="block w-full px-6 py-4 bg-[var(--neon-red)] hover:opacity-80 text-white rounded-xl transition-all text-sm font-black uppercase tracking-widest text-center shadow-[0_0_20px_var(--neon-red)]"
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
