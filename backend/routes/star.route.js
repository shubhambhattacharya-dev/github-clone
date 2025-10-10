// backend/routes/star.route.js
import express from 'express';
import { starRepository, unstarRepository, getStarredRepos } from '../controllers/star.controller.js';
import { ensureAuthenticated } from '../middleware/ensureAuthenticated.js';
import { asyncHandler } from '../middleware/asyncWrapper.js';

const router = express.Router();

router.post('/', ensureAuthenticated, asyncHandler(starRepository));
router.delete('/:repoId', ensureAuthenticated, asyncHandler(unstarRepository));
router.get('/', ensureAuthenticated, asyncHandler(getStarredRepos));

export default router;