import React, { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { fetchTrending, fetchTopRated, fetchUpcoming } from '../lib/tmdb';
import MovieCard from '../components/MovieCard';
import Hero from '../components/Hero';
import { Loader, Star, Flame, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';

// Custom CSS to hide scrollbars
const scrollbarHideStyles = `
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

const MovieRow = ({ title, movies = [], icon: Icon, colorClass, shadowClass }) => {
    const rowRef = useRef(null);

    const scroll = (direction) => {
        if (rowRef.current) {
            const { scrollLeft, clientWidth } = rowRef.current;
            const scrollTo = direction === "left"
                ? scrollLeft - clientWidth * 0.8
                : scrollLeft + clientWidth * 0.8;

            rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
        }
    };

    return (
        <div className="mb-12 sm:mb-16 md:mb-20 px-4 sm:px-6 md:px-8 lg:px-12 [perspective:2000px] group/row relative">
            <header className="mb-4 sm:mb-6 flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-outfit flex items-center gap-2 sm:gap-3 md:gap-4 text-white uppercase tracking-tighter">
                    <span className={`w-1 sm:w-1.5 h-6 sm:h-8 ${colorClass} rounded-full ${shadowClass}`}></span>
                    <span className="flex items-center gap-2 sm:gap-3">
                        {Icon && <Icon className={`${colorClass.replace('bg-', 'text-')} w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7`} />}
                        {title}
                    </span>
                </h2>
                <button className="hidden sm:flex text-gray-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors items-center gap-2 group">
                    View All <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </header>

            <div className="relative flex items-center">
                {/* Arrow Left - Hidden on mobile */}
                <button
                    onClick={() => scroll("left")}
                    className="hidden md:block absolute left-[-20px] lg:left-[-40px] z-30 p-2 lg:p-3 bg-black/60 hover:bg-neonRed text-white rounded-full border border-white/10 opacity-0 group-hover/row:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-md"
                >
                    <ChevronLeft size={20} className="lg:w-6 lg:h-6" />
                </button>

                {/* Horizontal Scroll Layout with 3D Effect */}
                <div
                    ref={rowRef}
                    className="flex overflow-x-auto pb-8 sm:pb-10 md:pb-12 pt-2 sm:pt-4 gap-4 sm:gap-6 md:gap-8 no-scrollbar snap-x snap-mandatory scroll-smooth px-2 sm:px-4 w-full"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {movies.slice(0, 15).map((movie, i) => (
                        <motion.div
                            key={movie.id}
                            className="min-w-[200px] sm:min-w-[240px] md:min-w-[280px] lg:min-w-[320px] snap-start"
                            initial={{ opacity: 0, scale: 0.8, rotateY: 30 }}
                            whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                            viewport={{ once: false, amount: 0.3 }}
                            transition={{
                                duration: 0.8,
                                delay: i * 0.05,
                                type: "spring",
                                stiffness: 50
                            }}
                        >
                            <MovieCard movie={movie} index={i} />
                        </motion.div>
                    ))}
                </div>

                {/* Arrow Right - Hidden on mobile */}
                <button
                    onClick={() => scroll("right")}
                    className="hidden md:block absolute right-[-20px] lg:right-[-40px] z-30 p-2 lg:p-3 bg-black/60 hover:bg-neonRed text-white rounded-full border border-white/10 opacity-0 group-hover/row:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-md"
                >
                    <ChevronRight size={20} className="lg:w-6 lg:h-6" />
                </button>
            </div>
        </div>
    );
};

const Home = () => {
    const { data: trending, isLoading: trendingLoading } = useQuery({
        queryKey: ['trending'],
        queryFn: async () => {
            const res = await fetchTrending({ pageParam: 1 });
            return res.results;
        }
    });

    const { data: topRated, isLoading: topLoading } = useQuery({
        queryKey: ['topRated'],
        queryFn: fetchTopRated
    });

    const { data: upcoming, isLoading: upcomingLoading } = useQuery({
        queryKey: ['upcoming'],
        queryFn: fetchUpcoming
    });

    if (trendingLoading || topLoading || upcomingLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-darkBg">
                <div className="flex flex-col items-center gap-4">
                    <Loader className="animate-spin text-neonRed w-12 h-12" />
                    <p className="text-gray-500 font-medium animate-pulse">Entering the Cinema...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-20 bg-darkBg min-h-screen overflow-x-hidden">
            <style>{scrollbarHideStyles}</style>
            {/* HERO - Slideshow of Upcoming Movies */}
            <Hero movies={upcoming} />

            <div className="mt-[-150px] relative z-20 space-y-4">
                <MovieRow
                    title="Trending Now"
                    movies={trending}
                    icon={Flame}
                    colorClass="bg-neonRed"
                    shadowClass="shadow-[0_0_20px_var(--neon-red)]"
                />

                <MovieRow
                    title="New Releases"
                    movies={upcoming}
                    icon={Sparkles}
                    colorClass="bg-neonPurple"
                    shadowClass="shadow-[0_0_20px_var(--neon-purple)]"
                />

                <MovieRow
                    title="Top Rated"
                    movies={topRated}
                    icon={Star}
                    colorClass="bg-yellow-500"
                    shadowClass="shadow-[0_0_20px_#eab308]"
                />
            </div>
        </div>
    );
};

export default Home;