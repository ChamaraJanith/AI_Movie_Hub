import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, X, SlidersHorizontal, Star } from 'lucide-react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import { fetchGenreList } from '../lib/tmdb';

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    // Filter states
    const [genres, setGenres] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [yearRange, setYearRange] = useState({ min: 1900, max: new Date().getFullYear() });
    const [minRating, setMinRating] = useState(0);
    const [sortBy, setSortBy] = useState('popularity.desc');

    useEffect(() => {
        const fetchGenres = async () => {
            const genreList = await fetchGenreList();
            setGenres(genreList);
        };
        fetchGenres();
    }, []);

    useEffect(() => {
        const q = searchParams.get('q');
        if (q) {
            setQuery(q);
            handleSearch(q);
        }
    }, [searchParams]);

    const handleSearch = async (searchQuery = query) => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        try {
            const params = {
                api_key: import.meta.env.VITE_TMDB_API_KEY,
                query: searchQuery,
                'vote_average.gte': minRating,
                'primary_release_date.gte': `${yearRange.min}-01-01`,
                'primary_release_date.lte': `${yearRange.max}-12-31`,
                sort_by: sortBy
            };

            if (selectedGenres.length > 0) {
                params.with_genres = selectedGenres.join(',');
            }

            const response = await axios.get('https://api.themoviedb.org/3/search/movie', { params });

            let results = response.data.results;

            // Apply filters
            results = results.filter(movie => {
                const year = movie.release_date ? parseInt(movie.release_date.split('-')[0]) : 0;
                const rating = movie.vote_average || 0;

                return year >= yearRange.min &&
                    year <= yearRange.max &&
                    rating >= minRating;
            });

            setMovies(results);
        } catch (err) {
            console.error('Search error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSearchParams({ q: query });
        handleSearch();
    };

    const toggleGenre = (genreId) => {
        setSelectedGenres(prev =>
            prev.includes(genreId)
                ? prev.filter(id => id !== genreId)
                : [...prev, genreId]
        );
    };

    const clearFilters = () => {
        setSelectedGenres([]);
        setYearRange({ min: 1900, max: new Date().getFullYear() });
        setMinRating(0);
        setSortBy('popularity.desc');
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">

                {/* Search Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl md:text-6xl font-black font-outfit uppercase tracking-tighter mb-8">
                        Search <span className="text-neonRed">Movies</span>
                    </h1>

                    {/* Search Bar */}
                    <form onSubmit={handleSubmit} className="relative mb-6">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search for movies..."
                            className="w-full bg-white/5 border-2 border-white/10 rounded-2xl py-5 px-6 pr-32 text-lg focus:outline-none focus:border-neonPurple focus:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all placeholder:text-gray-600"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-neonRed to-neonPurple text-white px-8 rounded-xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                        >
                            <Search size={18} /> Search
                        </button>
                    </form>

                    {/* Filter Toggle */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all font-bold uppercase tracking-widest text-xs"
                        >
                            <SlidersHorizontal size={18} />
                            {showFilters ? 'Hide Filters' : 'Show Filters'}
                        </button>

                        {(selectedGenres.length > 0 || minRating > 0 || yearRange.min > 1900 || yearRange.max < new Date().getFullYear()) && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm font-bold"
                            >
                                <X size={16} /> Clear Filters
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* Filters Panel */}
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-12 p-8 bg-white/5 border border-white/10 rounded-2xl"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                            {/* Genres */}
                            <div>
                                <h3 className="text-lg font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Filter size={18} className="text-neonPurple" /> Genres
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {genres.map(genre => (
                                        <button
                                            key={genre.id}
                                            onClick={() => toggleGenre(genre.id)}
                                            className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${selectedGenres.includes(genre.id)
                                                    ? 'bg-neonPurple text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]'
                                                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                                                }`}
                                        >
                                            {genre.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Year Range & Rating */}
                            <div className="space-y-6">
                                {/* Year Range */}
                                <div>
                                    <h3 className="text-lg font-black uppercase tracking-widest mb-4">Release Year</h3>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="number"
                                            value={yearRange.min}
                                            onChange={(e) => setYearRange({ ...yearRange, min: parseInt(e.target.value) })}
                                            className="w-24 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-center font-bold"
                                            min="1900"
                                            max={yearRange.max}
                                        />
                                        <span className="text-gray-500">to</span>
                                        <input
                                            type="number"
                                            value={yearRange.max}
                                            onChange={(e) => setYearRange({ ...yearRange, max: parseInt(e.target.value) })}
                                            className="w-24 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-center font-bold"
                                            min={yearRange.min}
                                            max={new Date().getFullYear()}
                                        />
                                    </div>
                                </div>

                                {/* Minimum Rating */}
                                <div>
                                    <h3 className="text-lg font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Star size={18} className="text-yellow-400" /> Minimum Rating
                                    </h3>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="range"
                                            min="0"
                                            max="10"
                                            step="0.5"
                                            value={minRating}
                                            onChange={(e) => setMinRating(parseFloat(e.target.value))}
                                            className="flex-1"
                                        />
                                        <span className="w-16 text-center font-black text-xl text-yellow-400">{minRating.toFixed(1)}</span>
                                    </div>
                                </div>

                                {/* Sort By */}
                                <div>
                                    <h3 className="text-lg font-black uppercase tracking-widest mb-4">Sort By</h3>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-bold cursor-pointer"
                                    >
                                        <option value="popularity.desc">Popularity (High to Low)</option>
                                        <option value="popularity.asc">Popularity (Low to High)</option>
                                        <option value="vote_average.desc">Rating (High to Low)</option>
                                        <option value="vote_average.asc">Rating (Low to High)</option>
                                        <option value="release_date.desc">Release Date (Newest)</option>
                                        <option value="release_date.asc">Release Date (Oldest)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => handleSearch()}
                            className="mt-6 w-full py-4 bg-gradient-to-r from-neonRed to-neonPurple rounded-xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(255,0,51,0.3)]"
                        >
                            Apply Filters
                        </button>
                    </motion.div>
                )}

                {/* Results */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neonRed"></div>
                    </div>
                ) : movies.length > 0 ? (
                    <>
                        <p className="text-gray-400 mb-8 font-medium">
                            Found <span className="text-white font-black">{movies.length}</span> results for "{query}"
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                            {movies.map((movie, i) => (
                                <MovieCard key={movie.id} movie={movie} index={i} />
                            ))}
                        </div>
                    </>
                ) : query ? (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg">No results found for "{query}"</p>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default SearchPage;
