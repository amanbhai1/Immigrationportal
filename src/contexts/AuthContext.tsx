import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

// Types
interface User {
  _id: string;
  name: string;
  email: string;
  role: 'client' | 'admin' | 'consultant';
  isVerified: boolean;
  token?: string;
}

interface OTPSession {
  email: string;
  purpose: 'registration' | 'login' | 'forgot-password';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  authStage: 'idle' | 'otp-verification';
  otpSession: OTPSession | null;
}

interface AuthContextType extends AuthState {
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  verifyOTP: (otp: string) => Promise<void>;
  resendOTP: () => Promise<void>;
  cancelOTPVerification: () => void;
  clearError: () => void;
}

// Action types
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_OTP_STAGE'; payload: OTPSession }
  | { type: 'CLEAR_OTP_STAGE' }
  | { type: 'SET_LOADING'; payload: boolean };

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  authStage: 'idle',
  otpSession: null,
};

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        authStage: 'idle',
        otpSession: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...initialState,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'SET_OTP_STAGE':
      return {
        ...state,
        authStage: 'otp-verification',
        otpSession: action.payload,
        isLoading: false,
      };
    case 'CLEAR_OTP_STAGE':
      return {
        ...state,
        authStage: 'idle',
        otpSession: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext<AuthContextType | null>(null);

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// AuthProvider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        dispatch({ type: 'AUTH_SUCCESS', payload: { ...user, token } });
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Login function
  const login = async (credentials: { email: string; password: string }) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await api.post('/users/login', credentials);
      
      if (response.data.success) {
        const { user } = response.data;
        
        // Store token and user data
        localStorage.setItem('token', user.token);
        localStorage.setItem('user', JSON.stringify(user));
        
        dispatch({ type: 'AUTH_SUCCESS', payload: user });
        toast.success('Login successful!');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      
      // Check if user needs verification
      if (error.response?.data?.requiresVerification) {
        dispatch({
          type: 'SET_OTP_STAGE',
          payload: {
            email: credentials.email,
            purpose: 'login',
          },
        });
        toast.error('Please verify your email before logging in');
      } else {
        dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
        toast.error(errorMessage);
      }
      throw error;
    }
  };

  // Register function
  const register = async (userData: { name: string; email: string; password: string }) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      // First stage: Send OTP
      const otpResponse = await api.post('/users/send-otp', {
        email: userData.email,
        name: userData.name,
        password: userData.password
      });
  
      if (otpResponse.data.success) {
        dispatch({
          type: 'SET_OTP_STAGE',
          payload: {
            email: userData.email,
            purpose: 'registration'
          }
        });
        toast.success('Registration successful! Please check your email for verification code.');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration initiation failed';
      dispatch({
        type: 'AUTH_ERROR',
        payload: errorMessage
      });
      toast.error(errorMessage);
      throw error;
    }
  };

  // Verify OTP function
  const verifyOTP = async (otp: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      if (!state.otpSession) {
        throw new Error('No OTP session found');
      }

      const response = await api.post('/users/verify-otp', {
        email: state.otpSession.email,
        otp,
      });

      if (response.data.success) {
        dispatch({ type: 'CLEAR_OTP_STAGE' });
        toast.success('Email verified successfully! You can now login.');
        
        // If this was for login, automatically log them in
        if (state.otpSession.purpose === 'login') {
          // For login verification, we might need to handle differently
          // For now, just clear the OTP stage
        }
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'OTP verification failed';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Resend OTP function
  const resendOTP = async () => {
    try {
      if (!state.otpSession) {
        throw new Error('No OTP session found');
      }

      const response = await api.post('/users/resend-otp', {
        email: state.otpSession.email,
      });

      if (response.data.success) {
        toast.success('New verification code sent to your email!');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to resend OTP';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Cancel OTP verification
  const cancelOTPVerification = () => {
    dispatch({ type: 'CLEAR_OTP_STAGE' });
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    verifyOTP,
    resendOTP,
    cancelOTPVerification,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;