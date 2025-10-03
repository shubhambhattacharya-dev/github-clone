// backend/routes/like.route.js
import express from 'express';
import { likeProfile, unlikeProfile, likeStatus } from '../controllers/like.controller.js';
import { ensureAuthenticated } from '../middleware/ensureAuthenticated.js';
import { asyncHandler } from '../middleware/asyncWrapper.js';

const router = express.Router();

router.post('/:username', ensureAuthenticated, asyncHandler(likeProfile));
router.delete('/:username', ensureAuthenticated, asyncHandler(unlikeProfile));
router.get('/:username/status', ensureAuthenticated, asyncHandler(likeStatus));

export default router;
