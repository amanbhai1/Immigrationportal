import api from './api';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'client' | 'consultant' | 'admin';
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface DashboardData {
  totalFiles: number;
  completedTasks: number;
  pendingTasks: number;
  totalDocuments: number;
  recentActivity: any[];
}

class UserService {
  async login(credentials: LoginCredentials) {
    const response = await api.post('/users/login', credentials);
    return response.data;
  }

  async sendOTP(email: string, name: string) {
    const response = await api.post('/users/send-otp', { email, name });
    return response.data;
  }

  async verifyOTPAndRegister(email: string, otp: string, userData: RegisterData) {
    const response = await api.post('/users/verify-otp', {
      email,
      otp,
      ...userData,
    });
    return response.data;
  }

  async resendOTP(email: string) {
    const response = await api.post('/users/resend-otp', { email });
    return response.data;
  }

  async getProfile() {
    const response = await api.get('/users/profile');
    return response.data;
  }

  async updateProfile(userData: Partial<User>) {
    const response = await api.put('/users/profile', userData);
    return response.data;
  }

  async getDashboardData(): Promise<DashboardData> {
    const response = await api.get('/users/dashboard');
    return response.data;
  }

  async getUsers() {
    const response = await api.get('/users');
    return response.data;
  }
}

const userService = new UserService();
export default userService;