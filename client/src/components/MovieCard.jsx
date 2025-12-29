import React from 'react';
import Tilt from 'react-parallax-tilt';
import { motion } from 'framer-motion';
import { Star, Plus, PlayCircle } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({ movie, index, isWatchlist, onRemove }) => {
  const navigate = useNavigate();

  // --- 1. DATA HANDLING (HYBRID LOGIC) ---
  const imageSrc = movie.img
    ? movie.img
    : movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : 'https://images.tmdb.org/t/p/w500/wwemzKWzjKYJFfCeiB57q3r4Bcm.png';

  const ratingValue = movie.rating || movie.vote_average || 0;
  const releaseYear = movie.year || (movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A');

  // --- 2. ADD/REMOVE WATCHLIST FUNCTION ---
  const handleWatchlistAction = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return alert("Please login first!");

      if (isWatchlist) {
        // Remove logic
        await axios.put("http://localhost:5000/api/movies/watchlist/remove", {
          movieId: movie.id || movie._id
        }, {
          headers: { token: "Bearer " + user.accessToken }
        });
        if (onRemove) onRemove(movie.id || movie._id);
        alert("Removed from watchlist!");
      } else {
        // Add logic
        await axios.post("http://localhost:5000/api/movies/watchlist", {
          movieId: movie._id || movie.id
        }, {
          headers: { token: "Bearer " + user.accessToken }
        });
        alert("Movie added to your watchlist!");
      }
    } catch (err) {
      console.log(err);
      alert("Error performing action!");
    }
  };

  // --- 3. ANIMATION VARIANTS ---
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }
    })
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      whileHover={{ scale: 1.05 }}
      className="relative z-10"
    >
      <Tilt
        tiltMaxAngleX={10}
        tiltMaxAngleY={10}
        perspective={1000}
        scale={1.02}
        transitionSpeed={1000}
        glareEnable={true}
        glareMaxOpacity={0.3}
        glareColor="#ffffff"
        glarePosition="all"
        className="transform-gpu rounded-2xl overflow-hidden shadow-2xl glass-effect"
      >
        {/* Movie Poster */}
        <div
          className="relative aspect-[2/3] group cursor-pointer"
          onClick={() => navigate(`/movie/${movie.id || movie._id}`)}
        >
          <img
            src={imageSrc}
            alt={movie.title}
            className="w-full h-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />

          {/* Overlay Content */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">

            <h3 className="text-white font-bold text-lg leading-tight mb-2 font-outfit drop-shadow-md">
              {movie.title}
            </h3>

            <div className="flex items-center justify-between text-gray-300 text-sm mb-3 font-medium">
              <span className="flex items-center text-yellow-400 gap-1 bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm">
                <Star size={14} fill="currentColor" /> {typeof ratingValue === 'number' ? ratingValue.toFixed(1) : ratingValue}
              </span>
              <span className="bg-white/10 px-2 py-1 rounded-md">{releaseYear}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/movie/${movie.id || movie._id}?autoplay=true`);
                }}
                className="flex-1 py-2 bg-white text-black hover:bg-gray-200 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <PlayCircle size={16} /> Play
              </button>
              <button
                onClick={handleWatchlistAction}
                className={`flex-1 py-2 ${isWatchlist ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-white/20 hover:bg-white/30 text-white'} rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors backdrop-blur-md border border-white/10`}
              >
                {isWatchlist ? <Plus size={16} className="rotate-45" /> : <Plus size={16} />}
                {isWatchlist ? 'Remove' : 'List'}
              </button>
            </div>

          </div>
        </div>
      </Tilt>
    </motion.div>
  );
};

export default MovieCard;