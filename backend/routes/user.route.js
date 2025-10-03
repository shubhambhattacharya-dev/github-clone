import express from "express";
import { getUserProfileAndRepos } from "../controllers/user.controller.js";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated.js";

const router = express.Router();

// Allow public access to user profiles (no auth required)
router.get("/profile/:username", getUserProfileAndRepos);

export default router;
