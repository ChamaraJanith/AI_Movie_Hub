import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/authContext';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import { Sparkles, Loader, Film } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchMovieDetails } from '../lib/tmdb';

const Watchlist = () => {
    const { user } = useContext(AuthContext);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [recommendations, setRecommendations] = useState([]);
    const [aiLoading, setAiLoading] = useState(false);

    const fetchWatchlistData = async () => {
        try {
            // 1. Get IDs from backend
            const res = await axios.get("http://localhost:5000/api/movies/watchlist", {
                headers: { token: "Bearer " + user.accessToken }
            });
            // Deduplicate IDs just in case
            const movieIds = [...new Set(res.data)];

            // 2. Fetch full details for each ID from TMDB
            // We assume IDs are from TMDB for now
            const movieDetails = await Promise.all(
                movieIds.map(async (id) => {
                    try {
                        return await fetchMovieDetails(id);
                    } catch (err) {
                        console.error(`Error fetching movie ${id}`, err);
                        return null;
                    }
                })
            );

            setMovies(movieDetails.filter(m => m !== null));
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchWatchlistData();
        } else {
            setLoading(false);
        }
    }, [user]);

    const handleRemoveFromState = (id) => {
        setMovies(prev => prev.filter(m => (m.id || m._id) !== id));
    };

    const getAiSuggestions = async () => {
        if (movies.length === 0) return;
        setAiLoading(true);
        try {
            const movieTitles = movies.map(m => m.title);
            const res = await axios.post("http://localhost:5000/api/ai/suggest",
                { movies: movieTitles },
                { headers: { token: "Bearer " + user.accessToken } }
            );

            // Fetch movie details with posters for each AI recommendation
            const recommendationsWithPosters = await Promise.all(
                res.data.map(async (rec) => {
                    try {
                        const searchRes = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
                            params: {
                                api_key: import.meta.env.VITE_TMDB_API_KEY,
                                query: rec.title
                            }
                        });
                        const movieData = searchRes.data.results[0];
                        return {
                            ...rec,
                            poster_path: movieData?.poster_path,
                            backdrop_path: movieData?.backdrop_path,
                            vote_average: movieData?.vote_average,
                            release_date: movieData?.release_date
                        };
                    } catch (err) {
                        console.error(`Error fetching poster for ${rec.title}`, err);
                        return rec;
                    }
                })
            );

            setRecommendations(recommendationsWithPosters);
        } catch (err) {
            console.error("AI Error", err);
        } finally {
            setAiLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#050505]">
                <Loader className="animate-spin text-neonRed w-12 h-12" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12 bg-[#050505]">
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black font-outfit text-white uppercase tracking-tighter mb-2">
                            My <span className="text-neonRed">Watchlist</span>
                        </h2>
                        <p className="text-gray-500 font-medium uppercase tracking-widest text-xs">
                            {movies.length} Movies Saved
                        </p>
                    </div>

                    {movies.length > 0 && (
                        <button
                            onClick={getAiSuggestions}
                            disabled={aiLoading}
                            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-neonPurple to-blue-600 rounded-2xl text-white font-black uppercase tracking-widest text-xs shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:scale-105 transition-all disabled:opacity-50 group"
                        >
                            {aiLoading ? <Loader className="animate-spin" size={18} /> : <Sparkles size={18} className="group-hover:animate-pulse" />}
                            {aiLoading ? "AI is Thinking..." : "Get AI Recommendations"}
                        </button>
                    )}
                </header>

                {/* Watchlist Grid */}
                {movies.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 mb-16">
                        {movies.map((movie, i) => (
                            <MovieCard
                                key={movie.id || movie._id}
                                movie={movie}
                                index={i}
                                isWatchlist={true}
                                onRemove={handleRemoveFromState}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-center border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.02]">
                        <div className="p-6 bg-white/5 rounded-full mb-6">
                            <Film size={48} className="text-gray-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Your watchlist is empty</h3>
                        <p className="text-gray-500 max-w-xs mx-auto mb-8 text-sm">Start adding movies to your list and our AI will help you find what to watch next!</p>
                        <a href="/" className="px-8 py-3 bg-white text-black rounded-xl font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-colors">
                            Browse Movies
                        </a>
                    </div>
                )}

                {/* AI Recommendations Section */}
                <AnimatePresence>
                    {recommendations.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="mt-20 border-t border-white/5 pt-16"
                        >
                            <h3 className="text-3xl font-black font-outfit text-white uppercase tracking-tighter mb-10 flex items-center gap-4">
                                <Sparkles className="text-neonPurple" size={32} />
                                AI Personalized <span className="text-neonPurple">Picks</span>
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {recommendations.map((rec, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-neonPurple/50 transition-all duration-500"
                                    >
                                        {/* Movie Poster Background */}
                                        {rec.backdrop_path && (
                                            <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                                                <img
                                                    src={`https://image.tmdb.org/t/p/w500${rec.backdrop_path}`}
                                                    alt={rec.title}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                                            </div>
                                        )}

                                        <div className="relative p-6 flex gap-4">
                                            {/* Poster */}
                                            {rec.poster_path && (
                                                <div className="shrink-0 w-24 h-36 rounded-lg overflow-hidden shadow-2xl border border-white/10">
                                                    <img
                                                        src={`https://image.tmdb.org/t/p/w200${rec.poster_path}`}
                                                        alt={rec.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-3">
                                                    <h4 className="text-lg font-black text-white uppercase tracking-tight leading-tight group-hover:text-neonPurple transition-colors line-clamp-2">
                                                        {rec.title}
                                                    </h4>
                                                    {rec.vote_average && (
                                                        <div className="shrink-0 flex items-center gap-1 px-2 py-1 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                                                            <span className="text-yellow-400 text-xs font-bold">★</span>
                                                            <span className="text-yellow-400 text-xs font-bold">{rec.vote_average.toFixed(1)}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {rec.release_date && (
                                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-3">
                                                        {new Date(rec.release_date).getFullYear()}
                                                    </p>
                                                )}

                                                <p className="text-gray-400 text-sm leading-relaxed font-medium line-clamp-3 mb-4">
                                                    {rec.reason}
                                                </p>

                                                <div className="flex items-center gap-2 text-neonPurple">
                                                    <Sparkles size={14} />
                                                    <span className="text-xs font-black uppercase tracking-widest">AI Recommended</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Watchlist;
