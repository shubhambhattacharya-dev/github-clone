import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import "./passport/github.auth.js";

import passport from 'passport';
import session from 'express-session';

import userRoutes from './routes/user.route.js';
import exploreRoutes from './routes/explore.route.js';
import authRoutes from './routes/auth.route.js';
import connectMongoDB from './db/connectMongoDB.js';

dotenv.config();

const app = express();

app.use(cors()); // ✅ Moved CORS before sessions for better compatibility
app.use(express.json()); // ✅ Middleware to parse JSON

app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback_secret', // ✅ Use environment variable for security
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB before handling requests
connectMongoDB().then(() => {
    console.log("Connected to MongoDB");

    // Define routes
    app.get("/", (req, res) => {
        res.send("Hello World");
    });

    app.use("/api/auth", authRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/explore", exploreRoutes);

    // Start server
    app.listen(5000, () => {
        console.log("Server is running on http://localhost:5000");
    });
}).catch((err) => {
    console.error("MongoDB connection failed:", err);
});
