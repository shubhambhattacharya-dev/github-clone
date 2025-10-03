// backend/routes/analytics.route.js
import express from 'express';
import { getRepoAnalytics } from '../controllers/analytics.controller.js';
import { ensureAuthenticated } from '../middleware/ensureAuthenticated.js';
import { asyncHandler } from '../middleware/asyncWrapper.js';
const router = express.Router();

router.get('/:owner/:repo', ensureAuthenticated, asyncHandler(getRepoAnalytics));

export default router;
