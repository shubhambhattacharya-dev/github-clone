import express from 'express';
import { getContributions, saveArtConfig, getUserArtConfigs, createPuzzle, getUserPuzzles, updatePuzzleProgress, updatePuzzle, deletePuzzle, autoDetectCommits, extendPuzzleDeadline } from '../controllers/contributionArt.controller.js';

const router = express.Router();

// Get contributions for a username
router.get('/contributions/:username', getContributions);

// Save art configuration
router.post('/art-config', saveArtConfig);

// Get user's saved configurations
router.get('/art-configs/:userId', getUserArtConfigs);

// Puzzle routes
router.post('/puzzle', createPuzzle);
router.get('/puzzles/:userId', getUserPuzzles);
router.put('/puzzle/:puzzleId', updatePuzzle);
router.put('/puzzle/:puzzleId/progress', updatePuzzleProgress);
router.put('/puzzle/:id/extend', extendPuzzleDeadline);
router.post('/auto-detect-commits/:userId', autoDetectCommits);
router.delete('/puzzle/:puzzleId', deletePuzzle);

export default router;