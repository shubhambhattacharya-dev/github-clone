import express from "express";
import { getUserAchievements, checkAllUserAchievements } from "../controllers/achievement.controller.js";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated.js";

const router = express.Router();

router.get("/", ensureAuthenticated, getUserAchievements);
router.post("/check", ensureAuthenticated, checkAllUserAchievements);

export default router;