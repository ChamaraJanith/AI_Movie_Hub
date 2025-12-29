const router = require('express').Router();
const Movie = require('../models/Movie');
const User = require('../models/User');
const verify = require('../verifyToken');

// GET HOME CONTENT (Lists)
router.get('/home-content', async (req, res) => {
    try {
        let trending = await Movie.find({ type: "trending" }).limit(10);
        let popular = await Movie.find({ type: "popular" }).limit(10);
        let mostViewed = await Movie.find({ type: "mostViewed" }).limit(10);

        if (trending.length === 0 && popular.length === 0 && mostViewed.length === 0) {
            trending = [{
                _id: "dummy1",
                title: "Interstellar (Seed me!)",
                img: "https://image.tmdb.org/t/p/w500/gEU2QniL6E8ahDnMNatnZs819T2.jpg",
                rating: 8.6,
                year: "2014"
            }];
            popular = [{
                _id: "dummy2",
                title: "Dune: Part Two (Seed me!)",
                img: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
                rating: 8.3,
                year: "2024"
            }];
        }

        res.status(200).json({
            trending: trending,
            popular: popular,
            mostViewed: mostViewed
        });
    } catch (err) {
        console.error("Home Content Error:", err);
        res.status(500).json({
            message: "Failed to fetch home content",
            error: err.message
        });
    }
});

// ADD TO WATCHLIST
router.post('/watchlist', verify, async (req, res) => {
    try {
        const userId = req.user.id;
        const { movieId } = req.body;

        await User.findByIdAndUpdate(userId, {
            $addToSet: { favorites: movieId }
        });

        res.status(200).json("Movie has been added to watchlist.");
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET WATCHLIST
router.get('/watchlist', verify, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json("User not found");
        res.status(200).json(user.favorites);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET FULL WATCHLIST DETAILS (For Persona Dashboard)
router.get('/watchlist/full', verify, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json("User not found");

        const movieIds = user.favorites || [];
        const TMDB_API_KEY = process.env.TMDB_API_KEY;

        const moviePromises = movieIds.map(async (id) => {
            try {
                const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}`);
                if (!response.ok) {
                    console.error(`TMDB error for movie ${id}: ${response.status}`);
                    return null;
                }
                return await response.json();
            } catch (err) {
                console.error(`Error fetching movie ${id}:`, err.message);
                return null;
            }
        });

        const movieDetails = (await Promise.all(moviePromises)).filter(m => m !== null);
        res.status(200).json(movieDetails);
    } catch (err) {
        console.error("Watchlist Full Error:", err);
        res.status(500).json({ message: "Failed to fetch full watchlist details", error: err.message });
    }
});

// REMOVE FROM WATCHLIST
router.put('/watchlist/remove', verify, async (req, res) => {
    try {
        const userId = req.user.id;
        const { movieId } = req.body;

        await User.findByIdAndUpdate(userId, {
            $pull: { favorites: movieId }
        });

        res.status(200).json("Movie has been removed from watchlist.");
    } catch (err) {
        console.error("Remove from Watchlist Error:", err);
        res.status(500).json(err);
    }
});

// CREATE MOVIE (For testing/filling DB)
router.post('/', verify, async (req, res) => {
    if (req.user.isAdmin) {
        const newMovie = new Movie(req.body);
        try {
            const savedMovie = await newMovie.save();
            res.status(201).json(savedMovie);
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You are not allowed!");
    }
});

module.exports = router;

