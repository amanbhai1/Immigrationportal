import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send OTP email
export const sendOTPEmail = async (email, otp, name) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: {
        name: 'Immigration Portal',
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: 'Email Verification - Immigration Portal',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; margin: 0; font-size: 28px;">Immigration Portal</h1>
              <p style="color: #6b7280; margin: 10px 0 0 0;">Email Verification</p>
            </div>
            
            <div style="margin-bottom: 30px;">
              <h2 style="color: #1f2937; margin: 0 0 15px 0;">Hello ${name}!</h2>
              <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
                Thank you for registering with Immigration Portal. To complete your account setup, please verify your email address using the verification code below:
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; display: inline-block;">
                <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">Your verification code is:</p>
                <h1 style="color: #2563eb; margin: 0; font-size: 36px; letter-spacing: 8px; font-weight: bold;">${otp}</h1>
              </div>
            </div>
            
            <div style="margin: 30px 0;">
              <p style="color: #ef4444; font-size: 14px; margin: 0; text-align: center;">
                ⚠️ This code will expire in 5 minutes for security reasons.
              </p>
            </div>
            
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
              <p style="color: #6b7280; font-size: 12px; margin: 0; text-align: center;">
                If you didn't request this verification, please ignore this email.
              </p>
              <p style="color: #6b7280; font-size: 12px; margin: 10px 0 0 0; text-align: center;">
                © 2024 Immigration Portal. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send verification email');
  }
};

// Send welcome email after successful verification
export const sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: {
        name: 'Immigration Portal',
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: 'Welcome to Immigration Portal!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; margin: 0; font-size: 28px;">Immigration Portal</h1>
              <p style="color: #10b981; margin: 10px 0 0 0; font-weight: bold;">Account Verified Successfully!</p>
            </div>
            
            <div style="margin-bottom: 30px;">
              <h2 style="color: #1f2937; margin: 0 0 15px 0;">Welcome ${name}!</h2>
              <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
                Congratulations! Your email has been successfully verified and your Immigration Portal account is now active.
              </p>
              <p style="color: #4b5563; line-height: 1.6; margin: 0;">
                You can now access all features of our platform including:
              </p>
            </div>
            
            <div style="margin: 20px 0;">
              <ul style="color: #4b5563; line-height: 1.8; padding-left: 20px;">
                <li>Manage your immigration files</li>
                <li>Upload and organize documents</li>
                <li>Track your CRS score</li>
                <li>Complete application checklists</li>
                <li>Access expert consultation services</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard" 
                 style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Access Your Dashboard
              </a>
            </div>
            
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
              <p style="color: #6b7280; font-size: 12px; margin: 0; text-align: center;">
                Need help? Contact our support team at support@immigrationportal.com
              </p>
              <p style="color: #6b7280; font-size: 12px; margin: 10px 0 0 0; text-align: center;">
                © 2024 Immigration Portal. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    // Don't throw error for welcome email as it's not critical
    return { success: false, error: error.message };
  }
};