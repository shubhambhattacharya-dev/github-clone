import express from "express";
import { getUserAchievements, checkAchievements } from "../controllers/achievement.controller.js";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated.js";

const router = express.Router();

router.get("/", ensureAuthenticated, getUserAchievements);
router.post("/check", ensureAuthenticated, checkAchievements);

// Test endpoint - NO AUTHENTICATION REQUIRED
router.get("/test", (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json({
    success: true,
    message: "Achievement test endpoint working!",
    timestamp: new Date().toISOString()
  });
});

export default router;