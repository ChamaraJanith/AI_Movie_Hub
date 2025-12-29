# 🎬 CINEMAVERSE - Next-Gen MERN Movie Application

Cinemaverse is a high-end, visually stunning movie discovery platform built with the MERN stack. It features cutting-edge 3D interactions, AI-powered recommendations, and a cinematic user experience inspired by modern streaming giants.

---

## 🔥 Key Features

### 1. 🌌 Immersive 3D Experience (Three.js)
*   **3D Hero Section:** Interactive 3D scene that reacts to mouse movement.
*   **3D Cast Showcase:** Explore actors in a floating 3D orbital carousel using `React Three Fiber`.
*   **3D Parallax Interface:** Movie cards with real-time 3D tilt effects for a tactile feel.

### 2. 🤖 AI Recommendation Engine (Google Gemini)
*   Integrates **Google Gemini AI** to analyze your watchlist.
*   Provides personalized "AI Picks" with detailed reasoning for each suggestion.
*   Chat with AI (Ask AI) for specific movie moods and preferences.

### 3. 📊 Advanced User Persona Dashboard
*   **Data Visualization:** Interactive Radar Charts (using `Recharts`) to map your favorite genres.
*   **Achievement System:** Earn ranks like "Elite Critic" based on your watch patterns.
*   **Live Stats:** Track total movies saved and estimated watch time.

### 4. 📽️ Cinematic Media Player
*   **Premium Trailer Modal:** High-definition YouTube integration with glassmorphism effects and neon glowing borders.
*   **Responsive Control:** Smooth animations and intuitive UX for distraction-free viewing.

### 5. ⚡ Technical Excellence
*   **Modern Stack:** MongoDB, Express.js, React 18, Node.js (MERN).
*   **Animations:** Powered by `Framer Motion` for buttery smooth page transitions.
*   **Responsive UI:** Fully optimized for Mobile, Tablet, and Desktop using Tailwind CSS.
*   **State Management:** Optimized data fetching with `Axios` and React Hooks.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React.js, Tailwind CSS, Framer Motion, Three.js, R3F, Recharts |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Atlas) |
| **AI Integration** | Google Generative AI (Gemini Flash) |
| **External Auth/API** | TMDB API, JWT Authentication |

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18 or higher)
*   MongoDB Atlas Account
*   TMDB API Key (Free)
*   Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/cinemaverse.git
   cd cinemaverse
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   # Create a .env file and add your MONGO_URI, JWT_SECRET, TMDB_API_KEY, and GEMINI_API_KEY
   npm start
   ```

3. **Setup Frontend**
   ```bash
   cd client
   npm install
   # Create a .env.local file and add VITE_TMDB_API_KEY
   npm run dev
   ```

---

## 💡 Why am I Building This?
As a full-stack developer, I wanted to push the boundaries of traditional web applications. By blending **3D WebGL** with **Artificial Intelligence**, Cinemaverse demonstrates how modern web technologies can create emotionally engaging and personalized user experiences.

---

## 📫 Connect with Me
[Your Name] - [Your LinkedIn Profile Link]
[Portfolio Website Link]

*Built with ❤️ and a lot of caffeine.*
