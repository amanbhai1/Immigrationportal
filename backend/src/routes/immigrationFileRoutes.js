import express from 'express';
import {
  createImmigrationFile,
  getImmigrationFiles,
  getImmigrationFileById,
  updateImmigrationFile,
  deleteImmigrationFile,
  addChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
  uploadDocument,
  deleteDocument,
  updateCRSScore,
  getActiveImmigrationFile,
  updateImmigrationProfile
} from '../controllers/immigrationFileController.js';
import { protect, consultantOrAdmin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Get active file (must be before /:id route)
router.route('/active')
  .get(protect, getActiveImmigrationFile);

// Base routes for immigration files
router.route('/')
  .post(protect, createImmigrationFile)
  .get(protect, getImmigrationFiles);

// Routes for specific immigration file
router.route('/:id')
  .get(protect, getImmigrationFileById)
  .put(protect, updateImmigrationFile)
  .delete(protect, deleteImmigrationFile);

// Update profile
router.route('/:id/profile')
.put(protect, updateImmigrationProfile);

// Routes for CRS score
router.route('/:id/crs-score')
  .put(protect, updateCRSScore);

// Routes for checklist items
router.route('/:id/checklist')
  .post(protect, addChecklistItem);

router.route('/:id/checklist/:itemId')
  .put(protect, updateChecklistItem)
  .delete(protect, deleteChecklistItem);

// Routes for documents
router.route('/:id/documents')
  .post(protect, upload.single('file'), uploadDocument);

router.route('/:id/documents/:documentId')
  .delete(protect, deleteDocument);

export default router;