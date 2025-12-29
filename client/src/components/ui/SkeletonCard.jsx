import React from 'react';
import { motion } from 'framer-motion';

const SkeletonCard = () => {
    return (
        <div className="relative w-full rounded-xl overflow-hidden glass-effect border border-white/5 aspect-[2/3]">
            {/* Pulsing Background */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
                {/* Title Skeleton */}
                <div className="h-6 w-3/4 bg-white/10 rounded-md animate-pulse" />

                {/* Rating Skeleton */}
                <div className="flex items-center justify-between">
                    <div className="h-4 w-1/4 bg-white/10 rounded-md animate-pulse" />
                    <div className="h-8 w-8 rounded-full bg-white/10 animate-pulse" />
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard;
