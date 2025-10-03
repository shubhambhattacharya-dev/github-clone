import express from "express";
import { findHackathons, getHealth } from "../controllers/hackathonController.js";

const router = express.Router();

// Health check endpoint
router.get("/health", getHealth);

// Main hackathon finder endpoint
router.get("/", findHackathons);

export default router;