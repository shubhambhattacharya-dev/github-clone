// backend/routes/explore.route.js
import express from "express";
import { explorePopularRepos, searchRepos, getTrendingRepos } from "../controllers/explore.controller.js";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated.js";
import { asyncHandler } from "../middleware/asyncWrapper.js";

const router = express.Router();

// Route to explore popular repositories by language
router.get(
  "/repos/:language",
  ensureAuthenticated,
  asyncHandler(async (req, res, next) => {
    await explorePopularRepos(req, res, next);
  })
);

// Added route to handle /api/explore/:language to fix frontend fetch error
router.get(
  "/:language",
  ensureAuthenticated,
  asyncHandler(async (req, res, next) => {
    await explorePopularRepos(req, res, next);
  })
);

// Search repositories
router.get(
  "/search",
  async (req, res) => {
    await searchRepos(req, res);
  }
);

// Get trending repositories
router.get(
  "/trending",
  async (req, res) => {
    await getTrendingRepos(req, res);
  }
);

export default router;
