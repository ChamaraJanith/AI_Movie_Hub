import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export const tmdb = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: API_KEY,
    }
});

export const fetchTrending = async ({ pageParam = 1 }) => {
    const response = await tmdb.get('/trending/movie/week', {
        params: { page: pageParam }
    });
    return response.data;
};

export const fetchTopRated = async () => {
    const response = await tmdb.get('/movie/top_rated');
    return response.data.results;
};

export const fetchUpcoming = async () => {
    const response = await tmdb.get('/movie/upcoming');
    return response.data.results;
};

export const fetchMovieDetails = async (id) => {
    const response = await tmdb.get(`/movie/${id}`);
    return response.data;
};

export const searchMovies = async (query) => {
    const response = await tmdb.get('/search/movie', {
        params: { query }
    });
    return response.data.results;
};

export const fetchGenreList = async () => {
    const response = await tmdb.get('/genre/movie/list');
    return response.data.genres;
};

