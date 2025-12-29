const dotenv = require('dotenv');
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

console.log("------------------------------------------------");
console.log("Checking API Key directly with Google...");

if (!apiKey) {
    console.error("❌ Error: API Key natha! .env file eka check karanna.");
    process.exit(1);
}

// Kelinma Google List Models URL ekata gahanawa
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

async function checkAccess() {
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.log("❌ API Key Error:");
            console.log(JSON.stringify(data.error, null, 2));
        } else {
            console.log("✅ API Key wada! Oyata access thiyena Models menna:");
            // Models tika print karanawa
            const modelNames = data.models.map(m => m.name);
            console.log(modelNames);

            console.log("------------------------------------------------");
            if (modelNames.includes("models/gemini-1.5-flash")) {
                console.log("🟢 'gemini-1.5-flash' list eke thiyenawa. Code eke aulak.");
            } else {
                console.log("🔴 'gemini-1.5-flash' list eke NA. Me API Key ekata eka wada na.");
                console.log("👉 Solution: Aluth API Key ekak ganna one.");
            }
        }
    } catch (err) {
        console.error("Network Error:", err);
    }
}

checkAccess();