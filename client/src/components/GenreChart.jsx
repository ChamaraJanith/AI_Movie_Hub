import React from 'react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
} from 'recharts';

const GenreChart = ({ data }) => {
    // If no data, show a nice empty state
    if (!data || data.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold uppercase tracking-widest bg-white/5 rounded-3xl border border-white/5">
                Add movies to your watchlist to see your persona map
            </div>
        );
    }

    return (
        <div className="w-full h-full p-4">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <defs>
                        <linearGradient id="radarGradient" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#ff0033" stopOpacity={0.8} />
                            <stop offset="100%" stopColor="#bc13fe" stopOpacity={0.8} />
                        </linearGradient>
                    </defs>
                    <PolarGrid
                        stroke="#ffffff15"
                        gridType="polygon"
                    />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: '#ffffff60', fontSize: 10, fontWeight: 'bold' }}
                    />
                    <PolarRadiusAxis
                        angle={30}
                        domain={[0, 'auto']}
                        axisLine={false}
                        tick={false}
                    />
                    <Radar
                        name="Genre Profile"
                        dataKey="A"
                        stroke="#ff0033"
                        strokeWidth={2}
                        fill="url(#radarGradient)"
                        fillOpacity={0.6}
                    />

                    {/* Add subtle animation / pulse effect via CSS if possible, 
                        or just let Recharts do its initial animation. */}
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default GenreChart;
