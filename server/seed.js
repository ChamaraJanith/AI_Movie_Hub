const mongoose = require('mongoose');
const Movie = require('./models/Movie');
const dotenv = require('dotenv');

dotenv.config();

const movies = [
    {
        title: "Avatar: The Way of Water",
        desc: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home.",
        img: "https://image.tmdb.org/t/p/original/t6HIqrRAclMCA60NsSmeqe9RmY1.jpg",
        imgSm: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmY1.jpg",
        year: "2022",
        limit: 13,
        genre: "Sci-Fi",
        rating: 7.7,
        type: "trending"
    },
    {
        title: "Deadpool & Wolverine",
        desc: "A listless Wade Wilson toils in civilian life. His days as the morally flexible mercenary, Deadpool, behind him. When his homeworld faces an existential threat, Wade must reluctantly suit-up again with an even more reluctant… reluctant-er? Reluctant-est? He must convince a reluctant Wolverine to—fuck. Oblivion is coming.",
        img: "https://image.tmdb.org/t/p/original/yD94XPi9Xq898el9D65XpWpI6is.jpg",
        imgSm: "https://image.tmdb.org/t/p/w500/8cdWjvZQUvH7Uz7CSTVI0p9SCAs.jpg",
        year: "2024",
        limit: 18,
        genre: "Action",
        rating: 7.8,
        type: "trending"
    },
    {
        title: "Dune: Part Two",
        desc: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.",
        img: "https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
        imgSm: "https://image.tmdb.org/t/p/w500/6iz7_XfX7X7p5f7o7f7o7f7o7f7.jpg",
        year: "2024",
        limit: 13,
        genre: "Sci-Fi",
        rating: 8.3,
        type: "popular"
    },
    {
        title: "The Batman",
        desc: "In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.",
        img: "https://image.tmdb.org/t/p/original/70C46p667W7WvYpPTBvexH9260Y.jpg",
        imgSm: "https://image.tmdb.org/t/p/w500/70C46p667W7WvYpPTBvexH9260Y.jpg",
        year: "2022",
        limit: 15,
        genre: "Action",
        rating: 7.7,
        type: "trending"
    },
    {
        title: "Oppenheimer",
        desc: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb.",
        img: "https://image.tmdb.org/t/p/original/8Gxv8gSFCU0XGDykIGu7dgnQSKS.jpg",
        imgSm: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykIGu7dgnQSKS.jpg",
        year: "2023",
        limit: 15,
        genre: "Biography",
        rating: 8.1,
        type: "mostViewed"
    },
    {
        title: "Inside Out 2",
        desc: "Teenager Riley's mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions! Joy, Sadness, Anger, Fear and Disgust, who’ve long been running a successful operation by all accounts, aren’t sure how to feel when Anxiety shows up. And it looks like she’s not alone.",
        img: "https://image.tmdb.org/t/p/original/stKGOmbuoiLiwGkgIHRYpS3SThW.jpg",
        imgSm: "https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLv1oYySbi.jpg",
        year: "2024",
        limit: 0,
        genre: "Animation",
        rating: 7.6,
        type: "popular"
    },
    {
        title: "Spider-Man: Across the Spider-Verse",
        desc: "After reuniting with Gwen Stacy, Brooklyn’s full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
        img: "https://image.tmdb.org/t/p/original/g4No9M986pS88S3BStD098S5X3.jpg",
        imgSm: "https://image.tmdb.org/t/p/w500/g4No9M986pS88S3BStD098S5X3.jpg",
        year: "2023",
        limit: 0,
        genre: "Animation",
        rating: 8.4,
        type: "mostViewed"
    },
    {
        title: "John Wick: Chapter 4",
        desc: "With the price on his head ever increasing, John Wick uncovers a path to defeating The High Table.",
        img: "https://image.tmdb.org/t/p/original/7I6VUdSj6UohtZ2rraN4t2Z0STU.jpg",
        imgSm: "https://image.tmdb.org/t/p/w500/7I6VUdSj6UohtZ2rraN4t2Z0STU.jpg",
        year: "2023",
        limit: 18,
        genre: "Action",
        rating: 7.8,
        type: "popular"
    },
    {
        title: "Gladiator II",
        desc: "Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius is forced to enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome with an iron fist.",
        img: "https://image.tmdb.org/t/p/original/3mY9xyveByvHhIatvP87Ue8O8.jpg",
        imgSm: "https://image.tmdb.org/t/p/w500/3mY9xyveByvHhIatvP87Ue8O8.jpg",
        year: "2024",
        limit: 15,
        genre: "Action",
        rating: 6.9,
        type: "trending"
    },
    {
        title: "Moana 2",
        desc: "After receiving an unexpected call from her wayfinding ancestors, Moana journey to the far seas of Oceania and into dangerous, long-lost waters for an adventure unlike anything she’s ever faced.",
        img: "https://image.tmdb.org/t/p/original/A2unY987XvLw7L6y9YvG8XqX7X.jpg",
        imgSm: "https://image.tmdb.org/t/p/w500/A2unY987XvLw7L6y9YvG8XqX7X.jpg",
        year: "2024",
        limit: 0,
        genre: "Animation",
        rating: 7.0,
        type: "popular"
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB for seeding...");

        // Clear existing movies to avoid duplicates for the demo
        await Movie.deleteMany({});

        await Movie.insertMany(movies);
        console.log("Database Seeded successfully!");
        process.exit();
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

seedDB();
