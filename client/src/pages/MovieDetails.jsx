import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Plus, Star, Calendar, Clock, Globe, ArrowLeft, X } from 'lucide-react';
import axios from 'axios';
import { fetchMovieDetails } from '../lib/tmdb';
import MovieCard from '../components/MovieCard';
import { useTheme } from '../context/ThemeContext';
const Cast3D = React.lazy(() => import('../components/Cast3D'));

const MovieDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [similar, setSimilar] = useState([]);
    const [cast, setCast] = useState([]);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTrailer, setShowTrailer] = useState(false);

    const { extractPalette, resetDynamicPalette } = useTheme();
    const location = useLocation();
    const autoplayHandledRef = useRef(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        autoplayHandledRef.current = false; // Reset on movie change

        const fetchData = async () => {
            try {
                setLoading(true);
                setShowTrailer(false);

                // Fetch movie details
                const movieData = await fetchMovieDetails(id);
                setMovie(movieData);

                // Trigger palette extraction
                if (movieData.poster_path) {
                    extractPalette(`https://image.tmdb.org/t/p/w200${movieData.poster_path}`);
                }

                // Fetch similar movies
                const similarRes = await axios.get(`https://api.themoviedb.org/3/movie/${id}/similar`, {
                    params: { api_key: import.meta.env.VITE_TMDB_API_KEY }
                });
                setSimilar(similarRes.data.results.slice(0, 10));

                // Fetch cast
                const creditsRes = await axios.get(`https://api.themoviedb.org/3/movie/${id}/credits`, {
                    params: { api_key: import.meta.env.VITE_TMDB_API_KEY }
                });
                setCast(creditsRes.data.cast.slice(0, 15));

                // Fetch videos (trailers)
                const videosRes = await axios.get(`https://api.themoviedb.org/3/movie/${id}/videos`, {
                    params: { api_key: import.meta.env.VITE_TMDB_API_KEY }
                });

                const filteredVideos = videosRes.data.results.filter(v =>
                    v.site === 'YouTube' &&
                    (v.type === 'Trailer' || v.type === 'Teaser' || v.type === 'Clip')
                ).sort((a, b) => {
                    // Prioritize Trailer
                    if (a.type === 'Trailer' && b.type !== 'Trailer') return -1;
                    if (a.type !== 'Trailer' && b.type === 'Trailer') return 1;
                    return 0;
                });
                setVideos(filteredVideos);

                // Handle autoplay after data is loaded
                const queryParams = new URLSearchParams(location.search);
                if (queryParams.get('autoplay') === 'true' && !autoplayHandledRef.current && filteredVideos.length > 0) {
                    autoplayHandledRef.current = true;
                    // Small delay for smooth transition
                    setTimeout(() => {
                        setShowTrailer(true);
                    }, 500);
                }

            } catch (err) {
                console.error('Error fetching movie details:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => {
            resetDynamicPalette();
        };
    }, [id]); // Only depend on id - no extractPalette or resetDynamicPalette

    const handleAddToWatchlist = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user) {
                alert("Please login first!");
                return;
            }

            await axios.post("http://localhost:5000/api/movies/watchlist", {
                movieId: id
            }, {
                headers: { token: "Bearer " + user.accessToken }
            });
            alert("Added to watchlist!");
        } catch (err) {
            console.error(err);
            alert("Error adding to watchlist!");
        }
    };

    // Prevent scroll when modal is open
    useEffect(() => {
        if (showTrailer) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showTrailer]);

    // ESC key to close trailer modal
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && showTrailer) {
                setShowTrailer(false);
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [showTrailer]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-darkBg">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[var(--neon-red)]"></div>
            </div>
        );
    }

    if (!movie) return null;

    const trailer = videos[0];

    return (
        <div className="min-h-screen bg-darkBg text-white">
            {/* Hero Section with Backdrop */}
            <div className="relative h-[90vh] overflow-hidden">
                {/* Backdrop Image */}
                <div className="absolute inset-0">
                    <img
                        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-darkBg via-darkBg/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-darkBg via-darkBg/40 to-transparent" />
                </div>

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-24 left-6 lg:left-12 z-20 p-3 bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-full border border-white/10 transition-all hover:scale-110"
                >
                    <ArrowLeft size={24} />
                </button>

                {/* Content */}
                <div className="absolute inset-0 flex items-end">
                    <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-20 w-full">
                        <div className="flex flex-col lg:flex-row gap-12 items-end">
                            {/* Poster */}
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="shrink-0"
                            >
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    alt={movie.title}
                                    className="w-64 lg:w-80 rounded-2xl shadow-2xl border-4 border-white/10"
                                />
                            </motion.div>

                            {/* Info */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex-1 pb-4"
                            >
                                <h1 className="text-5xl lg:text-7xl font-black font-outfit mb-4 leading-tight tracking-tighter">
                                    {movie.title}
                                </h1>

                                <div className="flex flex-wrap items-center gap-4 mb-6">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                                        <Star size={20} className="text-yellow-400 fill-yellow-400" />
                                        <span className="text-yellow-400 font-black text-lg">{movie.vote_average.toFixed(1)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Calendar size={18} />
                                        <span className="font-bold">{movie.release_date?.split('-')[0]}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Clock size={18} />
                                        <span className="font-bold">{movie.runtime} min</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Globe size={18} />
                                        <span className="font-bold uppercase">{movie.original_language}</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {movie.genres?.map(genre => (
                                        <span key={genre.id} className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm font-bold uppercase tracking-wider">
                                            {genre.name}
                                        </span>
                                    ))}
                                </div>

                                <p className="text-lg text-gray-300 leading-relaxed mb-8 max-w-3xl font-medium">
                                    {movie.overview}
                                </p>

                                <div className="flex gap-4">
                                    {trailer && (
                                        <button
                                            onClick={() => setShowTrailer(true)}
                                            className="px-8 py-4 bg-[var(--neon-red)] hover:opacity-80 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center gap-3 transition-all shadow-[0_0_30px_var(--neon-red)] hover:scale-105 active:scale-95"
                                        >
                                            <Play className="fill-white" size={20} /> Watch Trailer
                                        </button>
                                    )}
                                    <button
                                        onClick={handleAddToWatchlist}
                                        className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-xl rounded-2xl font-black uppercase tracking-widest text-sm flex items-center gap-3 transition-all border border-white/10 hover:border-white/20 active:scale-95"
                                    >
                                        <Plus size={20} /> Add to List
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cast Section */}
            {cast.length > 0 && (
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-3xl font-black font-outfit uppercase tracking-tighter">Cast & Characters</h2>
                        <span className="px-4 py-1.5 bg-neonPurple/20 text-neonPurple border border-neonPurple/30 rounded-full text-[10px] font-black tracking-widest uppercase backdrop-blur-md">
                            Interactive 3D View
                        </span>
                    </div>
                    <React.Suspense fallback={<div className="h-[200px] flex items-center justify-center text-gray-500">Loading 3D Experience...</div>}>
                        <Cast3D cast={cast} />
                    </React.Suspense>
                </div>
            )}

            {/* Similar Movies */}
            {similar.length > 0 && (
                <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-20">
                    <h2 className="text-3xl font-black font-outfit uppercase tracking-tighter mb-10">Similar Movies</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                        {similar.map((movie, i) => (
                            <div key={movie.id} onClick={() => navigate(`/movie/${movie.id}`)}>
                                <MovieCard movie={movie} index={i} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Trailer Modal - Modern Premium Design */}
            <AnimatePresence>
                {showTrailer && trailer && (
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
                        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="fixed inset-0 z-[1000] flex items-start justify-center bg-black/90 backdrop-blur-2xl p-4 md:p-8 overflow-y-auto pt-12 md:pt-20"
                        onClick={() => setShowTrailer(false)}
                    >
                        {/* Animated gradient background effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-red)]/5 via-transparent to-[var(--neon-purple)]/5 animate-pulse" />

                        <motion.div
                            initial={{ scale: 0.9, y: 30, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.95, y: 20, opacity: 0 }}
                            transition={{
                                type: "spring",
                                damping: 25,
                                stiffness: 300,
                                mass: 0.8
                            }}
                            className="relative w-full max-w-7xl aspect-video group"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Glowing border effect */}
                            <div className="absolute -inset-[2px] bg-gradient-to-r from-[var(--neon-red)] via-[var(--neon-purple)] to-[var(--neon-red)] rounded-3xl opacity-50 blur-xl group-hover:opacity-75 transition-opacity duration-500 animate-gradient-shift" />

                            {/* Main container with glassmorphism */}
                            <div className="relative h-full bg-gradient-to-br from-black/95 via-black/90 to-black/95 backdrop-blur-3xl rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.9)] border border-white/10">
                                {/* Top gradient accent */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--neon-red)] to-transparent opacity-60" />

                                {/* Close button - Modern design */}
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setShowTrailer(false)}
                                    className="absolute top-6 right-6 z-50 p-3 bg-black/80 hover:bg-[var(--neon-red)] text-white rounded-2xl transition-all duration-300 border border-white/10 hover:border-[var(--neon-red)] shadow-lg hover:shadow-[0_0_20px_var(--neon-red)] backdrop-blur-xl group/btn"
                                >
                                    <X size={22} className="group-hover/btn:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                                </motion.button>

                                {/* Movie title banner */}
                                <div className="absolute top-6 left-6 z-50 px-5 py-2.5 bg-black/70 backdrop-blur-xl rounded-xl border border-white/10 shadow-xl">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-[var(--neon-red)] rounded-full animate-pulse shadow-[0_0_8px_var(--neon-red)]" />
                                        <span className="text-sm font-black uppercase tracking-widest text-white/90">Official Trailer</span>
                                    </div>
                                </div>

                                {/* Video container */}
                                <div className="relative w-full h-full">
                                    {trailer.key ? (
                                        <iframe
                                            className="w-full h-full border-none"
                                            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`}
                                            title="Movie Trailer"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-4">
                                            <div className="w-16 h-16 border-4 border-white/10 border-t-[var(--neon-red)] rounded-full animate-spin" />
                                            <span className="font-bold text-lg">Trailer not available</span>
                                        </div>
                                    )}
                                </div>

                                {/* Bottom gradient accent */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--neon-purple)] to-transparent opacity-60" />
                            </div>
                        </motion.div>

                        {/* Instruction hint */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: 0.3 }}
                            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-black/60 backdrop-blur-xl rounded-full border border-white/10 shadow-xl"
                        >
                            <p className="text-sm text-white/60 font-medium">Press <span className="text-white font-bold">ESC</span> or click outside to close</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MovieDetails;
