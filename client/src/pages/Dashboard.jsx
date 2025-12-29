import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { AuthContext } from '../context/authContext';
import { Trophy, Clock, Film, Heart, Star, Zap, Shield, Target } from 'lucide-react';

const GenreChart = React.lazy(() => import('../components/GenreChart'));

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [watchlist, setWatchlist] = useState([]);
    const [stats, setStats] = useState({
        totalMovies: 0,
        totalHours: 0,
        topGenre: 'N/A',
        badge: 'Newbie'
    });
    const [genreData, setGenreData] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) return;
            try {
                const res = await axios.get("http://localhost:5000/api/movies/watchlist/full", {
                    headers: { token: "Bearer " + user.accessToken }
                });
                const movies = res.data;
                setWatchlist(movies);

                // Calculate stats
                const genres = {};
                let hours = 0;
                movies.forEach(m => {
                    m.genres?.forEach(g => {
                        genres[g.name] = (genres[g.name] || 0) + 1;
                    });
                    hours += (m.runtime || 120) / 60;
                });

                const genreArray = Object.keys(genres).map(key => ({
                    subject: key,
                    A: genres[key],
                    fullMark: Math.max(...Object.values(genres)) + 2
                }));

                setGenreData(genreArray);

                // Determine Badge
                let badge = "Movie Explorer";
                let icon = Film;
                const sortedGenres = Object.entries(genres).sort((a, b) => b[1] - a[1]);
                const topG = sortedGenres[0]?.[0] || "N/A";

                if (topG === "Action") badge = "Action Addict";
                else if (topG === "Science Fiction") badge = "Sci-fi Explorer";
                else if (topG === "Horror") badge = "Fearless Viewer";
                else if (topG === "Drama") badge = "Emotion Seeker";
                else if (topG === "Comedy") badge = "Laughter Lover";

                setStats({
                    totalMovies: movies.length,
                    totalHours: Math.round(hours),
                    topGenre: topG,
                    badge: badge
                });

            } catch (err) {
                console.error(err);
            }
        };
        fetchUserData();
    }, [user]);

    const badgeIcons = {
        "Action Addict": Zap,
        "Sci-fi Explorer": Target,
        "Fearless Viewer": Shield,
        "Emotion Seeker": Heart,
        "Laughter Lover": Star,
        "Movie Explorer": Film
    };

    const BadgeIcon = badgeIcons[stats.badge] || Trophy;

    return (
        <div className="min-h-screen bg-darkBg pt-32 pb-20 px-6 lg:px-12">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-5xl font-black font-outfit uppercase tracking-tighter mb-2">
                        User <span className="text-neonRed">Persona</span>
                    </h1>
                    <p className="text-gray-400 font-medium uppercase tracking-widest text-sm">Your Cinematic Identity Analysis</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Badge & Persona */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-1 bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-neonRed/10 to-neonPurple/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-neonRed to-neonPurple p-1 mb-6 relative z-10 shadow-[0_0_40px_rgba(255,0,51,0.3)]">
                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                                <BadgeIcon size={48} className="text-white" />
                            </div>
                        </div>

                        <h2 className="text-3xl font-black text-white mb-2 relative z-10">{stats.badge}</h2>
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-8 relative z-10">Rank: Elite Critic</p>

                        <div className="grid grid-cols-2 gap-4 w-full relative z-10">
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                <Film size={20} className="text-neonRed mb-2 mx-auto" />
                                <span className="block text-2xl font-black">{stats.totalMovies}</span>
                                <span className="text-[10px] text-gray-500 uppercase font-black">Movies</span>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                <Clock size={20} className="text-neonPurple mb-2 mx-auto" />
                                <span className="block text-2xl font-black">{stats.totalHours}h</span>
                                <span className="text-[10px] text-gray-500 uppercase font-black">Watched</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Middle: Genre Map */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-8"
                    >
                        <h3 className="text-xl font-black uppercase tracking-tighter mb-8 flex items-center gap-2">
                            <Target size={20} className="text-neonRed" /> Genre Preference Map
                        </h3>

                        <div className="h-[400px] w-full">
                            <React.Suspense fallback={<div className="h-full flex items-center justify-center text-gray-500">Loading Persona Insights...</div>}>
                                <GenreChart data={genreData} />
                            </React.Suspense>
                        </div>
                    </motion.div>

                    {/* Bottom: Recommendations or Interests */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-3 bg-white/5 border border-white/10 rounded-3xl p-8"
                    >
                        <h3 className="text-xl font-black uppercase tracking-tighter mb-8">Recent Moods</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {['Intense', 'Nostalgic', 'Curious', 'Brave', 'Dreamy', 'Logical'].map((mood, i) => (
                                <div key={mood} className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center hover:bg-neonRed/10 transition-all cursor-default">
                                    <div className="w-2 h-2 rounded-full bg-neonRed mx-auto mb-2 shadow-[0_0_8px_var(--neon-red)]" />
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{mood}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
