import User from '../models/userModel.js';
import OTP from '../models/otpModel.js';
import generateToken from '../utils/generateToken.js';
import { sendOTPEmail, sendWelcomeEmail } from '../utils/emailService.js';
import { generateOTP, generateOTPExpiry, isOTPExpired } from '../utils/otpUtils.js';

// @desc    Send OTP for registration
// @route   POST /api/users/send-otp
// @access  Public
const sendOTPForRegistration = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long',
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Check if there's already a pending OTP for this email
    const existingOTP = await OTP.findOne({ email });
    if (existingOTP) {
      // Delete existing OTP to create a new one
      await OTP.deleteOne({ email });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = generateOTPExpiry();

    // Store OTP with user data temporarily
    const otpRecord = await OTP.create({
      email,
      otp,
      otpExpiry,
      userData: {
        name,
        email,
        password, // Will be hashed when user is created
        role: 'client',
      },
      purpose: 'registration',
      attempts: 0,
    });

    // Send OTP email
    try {
      await sendOTPEmail(email, otp, name);
      
      res.status(200).json({
        success: true,
        message: 'Verification code sent to your email. Please check your inbox.',
        data: {
          email,
          expiresIn: '5 minutes',
        },
      });
    } catch (emailError) {
      // If email fails, delete the OTP record
      await OTP.findByIdAndDelete(otpRecord._id);
      console.error('Email sending failed:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email. Please try again.',
        debug: process.env.NODE_ENV === 'development' ? emailError.message : undefined,
      });
    }
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Verify OTP and create user account
// @route   POST /api/users/verify-otp
// @access  Public
const verifyOTPAndCreateUser = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate required fields
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and OTP',
      });
    }

    // Find OTP record
    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord) {
      return res.status(404).json({
        success: false,
        message: 'No verification code found. Please request a new one.',
      });
    }

    // Check if OTP is expired
    if (isOTPExpired(otpRecord.otpExpiry)) {
      await OTP.deleteOne({ email });
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please request a new one.',
      });
    }

    // Check attempts limit
    if (otpRecord.attempts >= 5) {
      await OTP.deleteOne({ email });
      return res.status(429).json({
        success: false,
        message: 'Too many failed attempts. Please request a new verification code.',
      });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      // Increment attempts
      otpRecord.attempts += 1;
      await otpRecord.save();
      
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code',
        attemptsLeft: 5 - otpRecord.attempts,
      });
    }

    // Check if user already exists (double check)
    const userExists = await User.findOne({ email });
    if (userExists) {
      await OTP.deleteOne({ email });
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Create user account
    const user = await User.create({
      name: otpRecord.userData.name,
      email: otpRecord.userData.email,
      password: otpRecord.userData.password, // Will be hashed by pre-save middleware
      role: otpRecord.userData.role,
      isVerified: true, // Set as verified since OTP is confirmed
    });

    // Delete OTP record after successful verification
    await OTP.deleteOne({ email });

    // Send welcome email (non-blocking)
    sendWelcomeEmail(user.email, user.name)
      .then(() => console.log(`Welcome email sent to ${user.email}`))
      .catch(error => console.error('Welcome email failed:', error.message));

    res.status(201).json({
      success: true,
      message: 'Account created successfully! You can now login.',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Resend OTP
// @route   POST /api/users/resend-otp
// @access  Public
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate required fields
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email',
      });
    }

    // Find existing OTP record
    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord) {
      return res.status(404).json({
        success: false,
        message: 'No pending verification found. Please start registration again.',
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = generateOTPExpiry();

    // Update OTP record
    otpRecord.otp = otp;
    otpRecord.otpExpiry = otpExpiry;
    otpRecord.attempts = 0; // Reset attempts
    await otpRecord.save();

    // Send OTP email
    try {
      await sendOTPEmail(email, otp, otpRecord.userData.name);
      
      res.json({
        success: true,
        message: 'New verification code sent to your email',
        data: {
          email,
          expiresIn: '5 minutes',
        },
      });
    } catch (emailError) {
      console.error('Resend OTP email failed:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email. Please try again.',
      });
    }
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check for user email
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in',
        requiresVerification: true,
        email: user.email,
      });
    }

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      
      // Only update password if provided
      if (req.body.password) {
        if (req.body.password.length < 8) {
          return res.status(400).json({
            success: false,
            message: 'Password must be at least 8 characters long',
          });
        }
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          isVerified: updatedUser.isVerified,
          token: generateToken(updatedUser._id),
        },
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Get dashboard data
// @route   GET /api/users/dashboard
// @access  Private
const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get user's immigration files (we'll import this model later)
    // For now, return basic dashboard data
    res.json({
      success: true,
      dashboard: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
        },
        stats: {
          totalFiles: 0, // Will be populated when we integrate with immigration files
          completedChecklists: 0,
          uploadedDocuments: 0,
        },
      },
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

export { 
  sendOTPForRegistration,
  verifyOTPAndCreateUser,
  resendOTP,
  loginUser, 
  getUserProfile, 
  updateUserProfile,
  getDashboard,
  getUsers 
};


// Add this new route handler
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ 
        success: false,
        message: 'Valid email required'
      });
    }

    // Generate and save OTP logic
    const otp = generateOTP();
    const otpExpiry = generateOTPExpiry();

    // Store OTP with user data temporarily
    const otpRecord = await OTP.create({
      email,
      otp,
      otpExpiry,
      userData: {
        name,
        email,
        password, // Will be hashed when user is created
        role: 'client',
      },
      purpose: 'registration',
      attempts: 0,
    });

    // Send OTP email
    try {
      await sendOTPEmail(email, otp, name);
      
      res.status(200).json({
        success: true,
        message: 'Verification code sent to your email. Please check your inbox.',
        data: {
          email,
          expiresIn: '5 minutes',
        },
      });
    } catch (emailError) {
      // If email fails, delete the OTP record
      await OTP.findByIdAndDelete(otpRecord._id);
      console.error('Email sending failed:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email. Please try again.',
        debug: process.env.NODE_ENV === 'development' ? emailError.message : undefined,
      });
    }
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Update exports
module.exports = {
  registerUser,
  verifyOTP,
  sendOTP,
  verifyOTPAndCreateUser,
  resendOTP,
  loginUser, 
  getUserProfile, 
  updateUserProfile,
  getDashboard,
  getUsers 
};