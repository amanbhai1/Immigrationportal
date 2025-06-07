import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
    },
    otpExpiry: {
      type: Date,
      required: true,
    },
    userData: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },
      password: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        enum: ['client', 'admin', 'consultant'],
        default: 'client',
      },
    },
    purpose: {
      type: String,
      enum: ['registration', 'password-reset'],
      default: 'registration',
    },
    attempts: {
      type: Number,
      default: 0,
      max: 5, // Maximum 5 attempts
    },
  },
  {
    timestamps: true,
  }
);

// Index for automatic deletion after expiry
otpSchema.index({ otpExpiry: 1 }, { expireAfterSeconds: 0 });

// Index for email lookup
otpSchema.index({ email: 1 });

const OTP = mongoose.model('OTP', otpSchema);

export default OTP;