const mongoose = require('mongoose');
const Movie = require('./models/Movie');
require('dotenv').config();

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const count = await Movie.countDocuments();
        console.log(`Movie count: ${count}`);
        const movies = await Movie.find().limit(5);
        console.log("Sample movies:", movies.map(m => m.title));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkDB();
