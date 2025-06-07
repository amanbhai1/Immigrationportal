import crypto from 'crypto';

// Generate a 6-digit OTP
export const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Generate OTP expiry time (5 minutes from now)
export const generateOTPExpiry = () => {
  return new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
};

// Check if OTP is expired
export const isOTPExpired = (otpExpiry) => {
  return new Date() > new Date(otpExpiry);
};

// Hash OTP for storage (optional security measure)
export const hashOTP = (otp) => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

// Verify hashed OTP
export const verifyHashedOTP = (inputOTP, hashedOTP) => {
  const inputHash = crypto.createHash('sha256').update(inputOTP).digest('hex');
  return inputHash === hashedOTP;
};