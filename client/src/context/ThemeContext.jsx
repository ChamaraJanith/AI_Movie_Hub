import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved || 'cyberpunk'; // default theme
    });

    const [dynamicPalette, setDynamicPalette] = useState(null);

    useEffect(() => {
        localStorage.setItem('theme', theme);
        if (!dynamicPalette) {
            document.documentElement.setAttribute('data-theme', theme);
            // Reset dynamic variables if no palette
            document.documentElement.style.removeProperty('--neon-red');
            document.documentElement.style.removeProperty('--neon-purple');
        }
    }, [theme, dynamicPalette]);

    const themes = {
        cyberpunk: { name: 'Cyberpunk' },
        classic: { name: 'Classic' },
        ocean: { name: 'Ocean' },
        sunset: { name: 'Sunset' }
    };

    const extractPalette = async (imageUrl) => {
        if (!imageUrl) {
            setDynamicPalette(null);
            return;
        }

        try {
            let colors = null;

            // Try Dynamic Extraction using Canvas (Fallback if node-vibrant is slow/unavailable)
            const getDominantColor = (url) => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.crossOrigin = "Anonymous";
                    img.src = url;
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        canvas.width = 1;
                        canvas.height = 1;
                        ctx.drawImage(img, 0, 0, 1, 1);
                        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
                        const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
                        resolve(hex);
                    };
                    img.onerror = () => resolve(null);
                });
            };

            const dominant = await getDominantColor(imageUrl);

            if (dominant) {
                colors = {
                    vibrant: dominant,
                    darkVibrant: dominant, // Simple approximation
                    muted: dominant
                };
            }

            // If Vibrant is actually available, use it for better results
            try {
                if (typeof Vibrant !== 'undefined') {
                    const palette = await Vibrant.from(imageUrl).getPalette();
                    colors = {
                        vibrant: palette.Vibrant?.getHex(),
                        muted: palette.Muted?.getHex(),
                        darkVibrant: palette.DarkVibrant?.getHex(),
                        lightVibrant: palette.LightVibrant?.getHex(),
                        darkMuted: palette.DarkMuted?.getHex()
                    };
                }
            } catch (vErr) {
                console.warn("Vibrant failed, using canvas fallback", vErr);
            }

            if (colors) {
                setDynamicPalette(colors);
                if (colors.vibrant) {
                    document.documentElement.style.setProperty('--neon-red', colors.vibrant);
                    document.documentElement.style.setProperty('--neon-purple', colors.darkVibrant || colors.muted || colors.vibrant);
                }
            }
        } catch (error) {
            console.error("Failed to extract palette:", error);
            setDynamicPalette(null);
        }
    };

    const changeTheme = (newTheme) => {
        setDynamicPalette(null); // Reset dynamic colors when switching themes manually
        setTheme(newTheme);
    };

    const resetDynamicPalette = () => {
        setDynamicPalette(null);
    };

    return (
        <ThemeContext.Provider value={{
            theme,
            themes,
            changeTheme,
            extractPalette,
            dynamicPalette,
            resetDynamicPalette
        }}>
            {children}
        </ThemeContext.Provider>
    );
};
