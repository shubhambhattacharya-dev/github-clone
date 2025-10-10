import express from "express";
import { getUserProfileAndRepos, getUserLikes } from "../controllers/user.controller.js";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated.js";

const router = express.Router();

// Allow public access to user profiles (no auth required)
router.get("/profile/:username", getUserProfileAndRepos);

// Get likes for current user (requires auth)
router.get("/likes", ensureAuthenticated, getUserLikes);

export default router;
