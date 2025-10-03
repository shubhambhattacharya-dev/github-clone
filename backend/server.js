// -------------------- Load Environment Variables First -------------------- //
import dotenv from "dotenv";
dotenv.config(); // <-- load at top

// -------------------- Imports -------------------- //
import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import path from "path";
import helmet from "helmet"; // ✅ Security headers
import rateLimit from "express-rate-limit"; // ✅ Rate limiting
import globalErrorHandler from './middleware/errorHandler.js';

import "./passport/github.auth.js";

import userRoutes from "./routes/user.route.js";
import exploreRoutes from "./routes/explore.route.js";
import authRoutes from "./routes/auth.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
import likeRoutes from "./routes/like.route.js";
import savedRoutes from "./routes/saved.route.js";
import achievementRoutes from "./routes/achievement.route.js";
import contributionArtRoutes from "./routes/contributionArt.route.js";
import hackathonRoutes from "./routes/hackathon.route.js";

import connectMongoDB from "./db/connectMongoDB.js";
import { initializeAchievements } from "./controllers/achievement.controller.js";

// -------------------- Initialize App -------------------- //
const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// -------------------- Security & Input Middleware -------------------- //

// Check for strong session secret
if (!process.env.SESSION_SECRET) {
  console.error("Error: SESSION_SECRET is not set in .env");
  process.exit(1); // prevent server from starting with insecure secret
}

// Parse JSON
app.use(express.json());

// Enable CORS
app.use(cors());

// Helmet for security headers
app.use(helmet());

// Rate limiting for all API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later."
  }
});
app.use("/api/", apiLimiter);

// Basic logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Use SESSION_SECRET from .env
app.use(session({ 
  secret: process.env.SESSION_SECRET, 
  resave: false, 
  saveUninitialized: false 
}));

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

// -------------------- API Routes -------------------- //
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/explore", exploreRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/saved", savedRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/contribution-art", contributionArtRoutes);
app.use("/api/hackathons", hackathonRoutes);

// -------------------- Global Error Handler -------------------- //
app.use(globalErrorHandler);

// -------------------- Serve Frontend -------------------- //
app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// -------------------- Start Server & Connect MongoDB -------------------- //
const server = app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);
  await connectMongoDB();
  await initializeAchievements();
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is already in use. Server might already be running.`);
  } else {
    console.error('Server error:', err);
  }
});
