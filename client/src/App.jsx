import React from 'react';
import { createBrowserRouter, RouterProvider, Routes, Route, useLocation } from 'react-router-dom';
import { AuthContextProvider } from './context/authContext';
import { ThemeProvider } from './context/ThemeContext';
import { AnimatePresence } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SearchPage from './pages/SearchPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Watchlist from './pages/Watchlist';
import PageTransition from './components/PageTransition';
import Footer from './components/Footer';
import MovieDetails from './pages/MovieDetails';
import Dashboard from './pages/Dashboard';
import AskAI from './pages/AskAI';

const queryClient = new QueryClient();

const Root = () => {
    return (
        <div className="min-h-screen bg-darkBg font-sans pb-20">
            <Navbar />
            <AnimatedRoutes />
            <Footer />
        </div>
    );
};

const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                <Route path="/search" element={<PageTransition><SearchPage /></PageTransition>} />
                <Route path="/watchlist" element={<PageTransition><Watchlist /></PageTransition>} />
                <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
                <Route path="/ask-ai" element={<PageTransition><AskAI /></PageTransition>} />
                <Route path="/movie/:id" element={<PageTransition><MovieDetails /></PageTransition>} />
                <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
                <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
            </Routes>
        </AnimatePresence>
    );
};

const router = createBrowserRouter([
    {
        path: "*",
        element: <Root />,
    }
], {
    future: {
        v7_startTransition: true,
        v7_relativeSplatPath: true,
    }
});

function App() {
    return (
        <ThemeProvider>
            <QueryClientProvider client={queryClient}>
                <AuthContextProvider>
                    <RouterProvider router={router} />
                </AuthContextProvider>
            </QueryClientProvider>
        </ThemeProvider>
    );
}

export default App;
