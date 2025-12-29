import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = ({ movies = [] }) => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);

    // Filter movies that have backdrops
    const heroMovies = movies.filter(m => m.backdrop_path).slice(0, 5);

    useEffect(() => {
        if (heroMovies.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % heroMovies.length);
        }, 8000); // 8 seconds per slide

        return () => clearInterval(interval);
    }, [heroMovies.length]);

    if (heroMovies.length === 0) return null;

    const currentMovie = heroMovies[currentIndex];

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % heroMovies.length);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + heroMovies.length) % heroMovies.length);

    return (
        <div className="relative w-full h-[90vh] overflow-hidden mb-12">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentMovie.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 w-full h-full"
                >
                    {/* Background with Ken Burns Effect */}
                    <motion.div
                        className="absolute inset-0 w-full h-full"
                        animate={{ scale: [1, 1.1] }}
                        transition={{ duration: 10, ease: "linear" }}
                    >
                        <img
                            src={`https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`}
                            alt={currentMovie.title}
                            className="w-full h-full object-cover opacity-50"
                        />
                    </motion.div>

                    {/* Gradients */}
                    <div className="absolute inset-0 bg-gradient-to-t from-darkBg via-darkBg/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-darkBg via-darkBg/40 to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-0 flex items-center">
                        <div className="max-w-7xl mx-auto px-6 w-full">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="max-w-2xl"
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-4 flex flex-wrap items-center gap-3"
                                >
                                    <span className="px-3 py-1 bg-neonRed/20 text-neonRed border border-neonRed/30 rounded-full text-[10px] font-black tracking-tighter uppercase backdrop-blur-md flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 bg-neonRed rounded-full animate-pulse"></span>
                                        Featured
                                    </span>
                                    <span className="flex items-center gap-1 text-yellow-400 font-bold text-sm bg-black/40 px-2.5 py-1 rounded-lg backdrop-blur-md border border-white/5">
                                        <Star size={14} fill="currentColor" /> {currentMovie.vote_average?.toFixed(1)}
                                    </span>
                                    <span className="text-gray-400 font-bold text-sm bg-black/40 px-2.5 py-1 rounded-lg backdrop-blur-md border border-white/5">
                                        {currentMovie.release_date?.split('-')[0]}
                                    </span>
                                    <span className="text-gray-400 font-bold text-sm bg-black/40 px-2.5 py-1 rounded-lg backdrop-blur-md border border-white/5">
                                        HD
                                    </span>
                                </motion.div>
                                <h1 className="text-6xl md:text-9xl font-black mb-6 font-outfit leading-[0.9] tracking-tighter drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/70">
                                    {currentMovie.title}
                                </h1>
                                <p className="text-lg md:text-xl text-gray-300/80 mb-10 line-clamp-3 max-w-xl leading-relaxed drop-shadow-md font-medium">
                                    {currentMovie.overview}
                                </p>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => navigate(`/movie/${currentMovie.id}?autoplay=true`)}
                                        className="px-8 py-4 bg-[var(--neon-red)] hover:opacity-80 text-white rounded-2xl font-bold flex items-center gap-2 transition-all shadow-[0_0_30px_var(--neon-red)] hover:scale-105 active:scale-95 group"
                                    >
                                        <Play className="group-hover:fill-white transition-all" size={24} /> Watch Now
                                    </button>
                                    <button
                                        onClick={() => navigate(`/movie/${currentMovie.id}`)}
                                        className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-xl text-white rounded-2xl font-bold flex items-center gap-2 transition-all border border-white/10 hover:border-white/20 active:scale-95"
                                    >
                                        <Info size={24} /> Details
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="absolute bottom-10 right-10 flex gap-4 z-20">
                <button
                    onClick={prevSlide}
                    className="p-3 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-white transition-all hover:scale-110 active:scale-95"
                >
                    <ChevronLeft size={24} />
                </button>
                <button
                    onClick={nextSlide}
                    className="p-3 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-white transition-all hover:scale-110 active:scale-95"
                >
                    <ChevronRight size={24} />
                </button>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-10 left-12 flex gap-2 z-20">
                {heroMovies.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? "w-10 bg-neonRed" : "w-2 bg-white/30"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Hero;
