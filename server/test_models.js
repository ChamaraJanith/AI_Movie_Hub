try {
    const Movie = require('./models/Movie');
    const User = require('./models/User');
    console.log("Models loaded successfully!");
} catch (e) {
    console.error("Error loading models:", e);
}
