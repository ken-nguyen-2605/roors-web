import apiService from './api';

class AuthService {
  // Register new user
  async register(username, email, password) {
    try {
      const response = await apiService.post('/auth/register', {
        username,
        email,
        password,
      });
      return {
        success: true,
        data: response,
        message: 'Registration successful! Please check your email to verify your account.',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Registration failed',
        status: error.status,
      };
    }
  }

  // Login user
  async login(username, password, rememberMe = false) {
    try {
      const response = await apiService.post('/auth/login', {
        username,
        password,
      });

      // Store token
      if (response.token) {
        apiService.setToken(response.token);
        
        // Store user info if needed
        if (typeof window !== 'undefined') {
          localStorage.setItem('userInfo', JSON.stringify(response.userInfo || {}));
          
          // Handle remember me
          if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
          }
        }
      }

      return {
        success: true,
        data: response,
        message: 'Login successful!',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Login failed',
        status: error.status,
      };
    }
  }

  // Logout user
  logout() {
    apiService.removeToken();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userInfo');
      localStorage.removeItem('rememberMe');
    }
  }

  // Forgot password
  async forgotPassword(email) {
    try {
      const response = await apiService.post('/auth/forgot-password', {
        email,
      });
      return {
        success: true,
        data: response,
        message: 'Password reset link sent to your email',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to send reset link',
        status: error.status,
      };
    }
  }

  // Reset password
  async resetPassword(token, newPassword) {
    try {
      const response = await apiService.post('/auth/reset-password', {
        token,
        newPassword,
      });
      return {
        success: true,
        data: response,
        message: 'Password reset successful',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to reset password',
        status: error.status,
      };
    }
  }

  // Resend verification email
  async resendVerification(email) {
    try {
      const response = await apiService.post('/auth/resend-verification', {
        email,
      });
      return {
        success: true,
        data: response,
        message: 'Verification email sent',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to send verification email',
        status: error.status,
      };
    }
  }

  // Verify email
  async verifyEmail(token) {
    try {
      const response = await apiService.post(`/auth/verify-email?token=${token}`);
      return {
        success: true,
        data: response,
        message: 'Email verified successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Email verification failed',
        status: error.status,
      };
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return apiService.isAuthenticated();
  }

  // Get current user info
  getCurrentUser() {
    if (typeof window !== 'undefined') {
      const userInfo = localStorage.getItem('userInfo');
      return userInfo ? JSON.parse(userInfo) : null;
    }
    return null;
  }
}

export default new AuthService();