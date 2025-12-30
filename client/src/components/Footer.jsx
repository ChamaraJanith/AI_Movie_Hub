import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Github, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-darkBg border-t border-white/5 pt-12 sm:pt-16 md:pt-20 pb-6 sm:pb-8 md:pb-10 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[30%] bg-neonRed/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-10 sm:mb-12 md:mb-16">

                    {/* Brand Section */}
                    <div className="space-y-4 sm:space-y-6 text-center sm:text-left">
                        <Link to="/" className="text-2xl sm:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-neonRed to-neonPurple font-outfit uppercase tracking-tighter inline-block">
                            CinemaVerse
                        </Link>
                        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-xs mx-auto sm:mx-0">
                            Experience the future of cinema with AI-powered recommendations and a premium 3D interface. Your ultimate destination for movies and series.
                        </p>
                        <div className="flex gap-3 sm:gap-4 justify-center sm:justify-start">
                            {[Facebook, Twitter, Instagram, Youtube, Github].map((Icon, i) => (
                                <a key={i} href="#" className="p-2 bg-white/5 hover:bg-neonRed/20 hover:text-neonRed rounded-lg transition-all border border-white/5 hover:border-neonRed/30 group">
                                    <Icon size={16} className="sm:w-[18px] sm:h-[18px] group-hover:scale-110 transition-transform" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="text-center sm:text-left">
                        <h4 className="text-white font-black uppercase tracking-widest text-xs sm:text-sm mb-4 sm:mb-6">Navigation</h4>
                        <ul className="space-y-3 sm:space-y-4">
                            {['Home', 'Search', 'Watchlist', 'Ask AI', 'Top Rated'].map((item) => (
                                <li key={item}>
                                    <Link
                                        to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                                        className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm font-medium inline-flex items-center gap-2 group"
                                    >
                                        <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-neonRed group-hover:shadow-[0_0_8px_var(--neon-red)] transition-all"></span>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="text-center sm:text-left">
                        <h4 className="text-white font-black uppercase tracking-widest text-xs sm:text-sm mb-4 sm:mb-6">Contact Us</h4>
                        <ul className="space-y-3 sm:space-y-4">
                            <li className="flex items-start gap-3 sm:gap-4 text-gray-400 text-xs sm:text-sm justify-center sm:justify-start">
                                <MapPin size={16} className="sm:w-[18px] sm:h-[18px] text-neonPurple shrink-0 mt-0.5" />
                                <span className="text-left">123 Cinema Plaza, Movie City,<br />California, USA</span>
                            </li>
                            <li className="flex items-center gap-3 sm:gap-4 text-gray-400 text-xs sm:text-sm justify-center sm:justify-start">
                                <Phone size={16} className="sm:w-[18px] sm:h-[18px] text-neonPurple shrink-0" />
                                <span>+1 (234) 567-890</span>
                            </li>
                            <li className="flex items-center gap-3 sm:gap-4 text-gray-400 text-xs sm:text-sm justify-center sm:justify-start">
                                <Mail size={16} className="sm:w-[18px] sm:h-[18px] text-neonPurple shrink-0" />
                                <span>support@cinemaverse.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="text-center sm:text-left">
                        <h4 className="text-white font-black uppercase tracking-widest text-xs sm:text-sm mb-4 sm:mb-6">Newsletter</h4>
                        <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">Subscribe to get the latest movie updates and AI features.</p>
                        <form className="relative group">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm focus:outline-none focus:border-[var(--neon-purple)] transition-all"
                            />
                            <button className="absolute right-1 sm:right-1.5 top-1 sm:top-1.5 bottom-1 sm:bottom-1.5 px-3 sm:px-4 bg-[var(--neon-purple)] hover:opacity-80 text-white rounded-lg text-[10px] sm:text-xs font-black uppercase transition-all shadow-[0_0_15px_var(--neon-purple)]">
                                Join
                            </button>
                        </form>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-6 sm:pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
                    <p className="text-gray-500 text-[10px] sm:text-xs font-medium uppercase tracking-widest text-center md:text-left">
                        © 2025 CinemaVerse. All rights reserved. Developed by Antigravity AI.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
