import express from "express";
import { getUserAchievements } from "../controllers/achievement.controller.js";

const router = express.Router();

// Development route - NO AUTHENTICATION REQUIRED
// This allows testing achievements without login
router.get("/dev", async (req, res) => {
  try {
    // Explicitly set Content-Type header
    res.setHeader('Content-Type', 'application/json');

    // Create a mock authenticated user for testing
    req.user = {
      _id: "507f1f77bcf86cd799439011", // Mock user ID
      username: "testuser",
      name: "Test User"
    };

    // Call the real achievements controller
    await getUserAchievements(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;