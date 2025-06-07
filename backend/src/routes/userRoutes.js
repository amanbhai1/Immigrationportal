import express from 'express';
import {
  sendOTPForRegistration,
  verifyOTPAndCreateUser,
  resendOTP,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getDashboard,
  getUsers,
} from '../controllers/userController_clean.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/send-otp', sendOTPForRegistration);
router.post('/verify-otp', verifyOTPAndCreateUser);
router.post('/resend-otp', resendOTP);
router.post('/login', loginUser);

// Protected routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.get('/dashboard', protect, getDashboard);

// Admin routes
router.route('/')
  .get(protect, admin, getUsers);

export default router;