import React, { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../context/authContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Bot, User, Loader, Trash2 } from 'lucide-react';

const AskAI = () => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        if (!user) {
            alert("Please login to use AI chat.");
            return;
        }

        const userMessage = {
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            // Extract movie titles from input or use the input as is
            const moviesArray = input.split(',').map(m => m.trim()).filter(m => m.length > 0);

            const res = await axios.post(
                "http://localhost:5000/api/ai/suggest",
                { movies: moviesArray.length > 1 ? moviesArray : [input] },
                {
                    headers: {
                        token: "Bearer " + user.accessToken
                    }
                }
            );

            // Fetch movie details with posters
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
                        return rec;
                    }
                })
            );

            const aiMessage = {
                role: 'ai',
                content: recommendationsWithPosters,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (err) {
            console.error(err);
            const errorMessage = {
                role: 'ai',
                content: 'error',
                error: err.response?.data?.error || "Sorry, I couldn't process that. Please try again.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const clearChat = () => {
        setMessages([]);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 flex flex-col">
            {/* Background Ambience */}
            <div className="fixed top-[20%] left-[-10%] w-[40%] h-[40%] bg-neonPurple/10 blur-[150px] rounded-full pointer-events-none" />
            <div className="fixed bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-neonRed/10 blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-5xl mx-auto px-6 lg:px-12 w-full flex-1 flex flex-col relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center gap-3 mb-4 px-6 py-3 bg-neonPurple/10 border border-neonPurple/30 rounded-full">
                        <Sparkles className="text-neonPurple animate-pulse" size={20} />
                        <span className="text-neonPurple font-black uppercase tracking-widest text-xs">AI Powered Chat</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black font-outfit mb-4 bg-clip-text text-transparent bg-gradient-to-r from-neonRed via-purple-500 to-neonPurple uppercase tracking-tighter">
                        Chat with AI
                    </h1>
                    <p className="text-gray-400 text-sm max-w-2xl mx-auto leading-relaxed font-medium">
                        Have a conversation about movies. Ask for recommendations, discuss your favorites, or get personalized suggestions.
                    </p>
                </motion.div>

                {/* Chat Container */}
                <div className="flex-1 flex flex-col bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {messages.length === 0 ? (
                            <div className="h-full flex items-center justify-center">
                                <div className="text-center max-w-md">
                                    <Bot size={64} className="mx-auto mb-6 text-neonPurple opacity-50" />
                                    <p className="text-gray-500 font-medium mb-2">Start a conversation!</p>
                                    <p className="text-gray-600 text-sm">Try: "I love Inception and Interstellar, what should I watch?"</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <AnimatePresence>
                                    {messages.map((message, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            {message.role === 'ai' && (
                                                <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-neonPurple to-blue-600 flex items-center justify-center">
                                                    <Bot size={20} />
                                                </div>
                                            )}

                                            <div className={`max-w-[80%] ${message.role === 'user' ? 'order-1' : ''}`}>
                                                {message.role === 'user' ? (
                                                    <div className="bg-gradient-to-r from-neonRed to-neonPurple p-4 rounded-2xl rounded-tr-none">
                                                        <p className="font-medium">{message.content}</p>
                                                    </div>
                                                ) : message.content === 'error' ? (
                                                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl rounded-tl-none">
                                                        <p className="text-red-400 font-medium">{message.error}</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none">
                                                            <p className="text-sm font-bold text-neonPurple mb-2">Here are my recommendations:</p>
                                                        </div>
                                                        <div className="grid gap-4">
                                                            {message.content.map((rec, i) => (
                                                                <div
                                                                    key={i}
                                                                    className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl overflow-hidden hover:border-neonPurple/50 transition-all"
                                                                >
                                                                    <div className="flex gap-4 p-4">
                                                                        {rec.poster_path && (
                                                                            <img
                                                                                src={`https://image.tmdb.org/t/p/w200${rec.poster_path}`}
                                                                                alt={rec.title}
                                                                                className="w-20 h-28 object-cover rounded-lg shrink-0"
                                                                            />
                                                                        )}
                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                                                <h4 className="font-black text-white text-sm uppercase tracking-tight line-clamp-1">
                                                                                    {rec.title}
                                                                                </h4>
                                                                                {rec.vote_average && (
                                                                                    <div className="shrink-0 flex items-center gap-1 px-2 py-1 bg-yellow-500/20 rounded-md">
                                                                                        <span className="text-yellow-400 text-xs font-bold">★ {rec.vote_average.toFixed(1)}</span>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                            {rec.release_date && (
                                                                                <p className="text-gray-500 text-xs font-bold mb-2">
                                                                                    {new Date(rec.release_date).getFullYear()}
                                                                                </p>
                                                                            )}
                                                                            <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                                                                                {rec.reason}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {message.role === 'user' && (
                                                <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-neonRed to-pink-600 flex items-center justify-center order-2">
                                                    <User size={20} />
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {loading && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex gap-4"
                                    >
                                        <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-neonPurple to-blue-600 flex items-center justify-center">
                                            <Bot size={20} />
                                        </div>
                                        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none">
                                            <div className="flex items-center gap-2">
                                                <Loader className="animate-spin text-neonPurple" size={16} />
                                                <span className="text-sm text-gray-400">AI is thinking...</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="border-t border-white/10 p-4 bg-black/20">
                        <div className="flex items-center gap-3">
                            {messages.length > 0 && (
                                <button
                                    onClick={clearChat}
                                    className="p-3 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 rounded-xl transition-all"
                                    title="Clear chat"
                                >
                                    <Trash2 size={18} className="text-gray-400 hover:text-red-400" />
                                </button>
                            )}
                            <form onSubmit={handleSend} className="flex-1 flex gap-3">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask me about movies..."
                                    disabled={loading}
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-5 focus:outline-none focus:border-neonPurple transition-all disabled:opacity-50 font-medium"
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !input.trim()}
                                    className="px-6 py-3 bg-gradient-to-r from-neonRed to-neonPurple rounded-xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_0_20px_rgba(255,0,51,0.3)]"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AskAI;
