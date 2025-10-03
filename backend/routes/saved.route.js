// backend/routes/saved.route.js
import express from 'express';
import { saveRepository, unsaveRepository, getSavedRepos } from '../controllers/saved.controller.js';
import { ensureAuthenticated } from '../middleware/ensureAuthenticated.js';
import { asyncHandler } from '../middleware/asyncWrapper.js';

const router = express.Router();

router.post('/', ensureAuthenticated, asyncHandler(saveRepository));
router.delete('/:repoId', ensureAuthenticated, asyncHandler(unsaveRepository));
router.get('/', ensureAuthenticated, asyncHandler(getSavedRepos));

export default router;
