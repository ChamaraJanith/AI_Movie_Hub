const router = require('express').Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
// const verify = require('../verifyToken'); // <-- MEKA MAMA COMMENT KALA

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Methana 'verify' mukuth na. Kelinma request eka gannawa.
router.post('/suggest', async (req, res) => {
    const { movies, query } = req.body;

    // Input Handling (Watchlist OR Single Search)
    let userInput = "";
    if (movies && movies.length > 0) {
        userInput = `movies: ${movies.join(", ")}`;
    } else if (query) {
        userInput = `movie: ${query}`;
    } else {
        return res.status(400).json("Please provide a list of movies or a search query.");
    }

    try {
        // Aluth Model eka (Error nathi wenna)
        // Dan library eka aluth nisa meka aniwa wada!

        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const prompt = `
        I have a user interested in the following ${userInput}.
        Based on this, recommend 5 similar movies that they might like.
        Return the response STRICTLY as a valid JSON array of objects.
        Each object must have these keys: "title" and "reason" (short explanation).
        Do not use markdown.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean JSON formatting
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const suggestions = JSON.parse(cleanedText);
        res.status(200).json(suggestions);
    } catch (err) {
        console.error("AI Error:", err);
        res.status(500).json({ message: "Failed to generate recommendations.", error: err.message });
    }
});

module.exports = router;