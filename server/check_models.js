const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });
console.log("Current Directory:", __dirname);
console.log("Loading .env from:", path.join(__dirname, '.env'));

const apiKey = process.env.GEMINI_API_KEY;
console.log("API Key found:", apiKey ? "YES (" + apiKey.substring(0, 5) + "...)" : "NO");

if (!apiKey) {
    console.error("API Key is missing! Exiting.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        // For v0.21.0+ accessing the model manager might be different or via a different way,
        // but typically we can try to just get a model and run verify.
        // However, the standard way is usually not exposed easily in the helper, 
        // but let's try to just run a simple prompt on "gemini-1.5-flash" again with explicit error logging
        // actually, let's try to just run a test on multiple model names to see which one sticks.

        const models = ["gemini-pro", "gemini-1.5-flash", "gemini-1.5-pro"];

        console.log("Checking models with API Key:", process.env.GEMINI_API_KEY ? "Present" : "Missing");

        for (const modelName of models) {
            console.log(`\nTesting model: ${modelName}...`);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello");
                console.log(`✅ SUCCESS: ${modelName} works!`);
            } catch (error) {
                console.log(`❌ FAILED: ${modelName}`);
                console.log(`   Error: ${error.message.split('\n')[0]}`); // First line only
            }
        }

    } catch (e) {
        console.error("Global Error:", e);
    }
}

listModels();
