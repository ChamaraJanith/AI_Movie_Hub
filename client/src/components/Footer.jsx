import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Github, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-darkBg border-t border-white/5 pt-20 pb-10 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[30%] bg-neonRed/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link to="/" className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-neonRed to-neonPurple font-outfit uppercase tracking-tighter">
                            CinemaVerse
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                            Experience the future of cinema with AI-powered recommendations and a premium 3D interface. Your ultimate destination for movies and series.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Youtube, Github].map((Icon, i) => (
                                <a key={i} href="#" className="p-2 bg-white/5 hover:bg-neonRed/20 hover:text-neonRed rounded-lg transition-all border border-white/5 hover:border-neonRed/30 group">
                                    <Icon size={18} className="group-hover:scale-110 transition-transform" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-black uppercase tracking-widest text-sm mb-6">Navigation</h4>
                        <ul className="space-y-4">
                            {['Home', 'Search', 'Watchlist', 'Ask AI', 'Top Rated'].map((item) => (
                                <li key={item}>
                                    <Link
                                        to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                                        className="text-gray-400 hover:text-white transition-colors text-sm font-medium flex items-center gap-2 group"
                                    >
                                        <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-neonRed group-hover:shadow-[0_0_8px_var(--neon-red)] transition-all"></span>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-black uppercase tracking-widest text-sm mb-6">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-4 text-gray-400 text-sm">
                                <MapPin size={18} className="text-neonPurple shrink-0" />
                                <span>123 Cinema Plaza, Movie City,<br />California, USA</span>
                            </li>
                            <li className="flex items-center gap-4 text-gray-400 text-sm">
                                <Phone size={18} className="text-neonPurple shrink-0" />
                                <span>+1 (234) 567-890</span>
                            </li>
                            <li className="flex items-center gap-4 text-gray-400 text-sm">
                                <Mail size={18} className="text-neonPurple shrink-0" />
                                <span>support@cinemaverse.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-white font-black uppercase tracking-widest text-sm mb-6">Newsletter</h4>
                        <p className="text-gray-400 text-sm mb-4">Subscribe to get the latest movie updates and AI features.</p>
                        <form className="relative group">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[var(--neon-purple)] transition-all"
                            />
                            <button className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-[var(--neon-purple)] hover:opacity-80 text-white rounded-lg text-xs font-black uppercase transition-all shadow-[0_0_15px_var(--neon-purple)]">
                                Join
                            </button>
                        </form>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-widest">
                        © 2025 CinemaVerse. All rights reserved. Developed by Antigravity AI.
                    </p>
                    <div className="flex gap-8 text-xs font-bold text-gray-500 uppercase tracking-widest">
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
