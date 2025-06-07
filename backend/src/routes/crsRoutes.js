import express from 'express';
import {
  getCurrentCRSScore,
  calculateAndSaveCRSScore,
  updateCRSScore
} from '../controllers/crsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get current CRS score
router.route('/')
  .get(protect, getCurrentCRSScore)
  .post(protect, calculateAndSaveCRSScore)
  .put(protect, updateCRSScore);

export default router;