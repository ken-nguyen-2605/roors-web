import apiService from "./api";

class AuthService {
  // ==================== AUTHENTICATION ====================

  async register(username, email, password) {
    try {
      const response = await apiService.post("/api/auth/register", {
        username,
        email,
        password,
      });

      return {
        success: true,
        data: response,
				message:
					"Registration successful! Please check your email to verify your account.",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Registration failed",
        status: error.status,
      };
    }
  }

  async login(username, password, rememberMe = false) {
    try {
      const response = await apiService.post("/api/auth/login", {
        username,
        password,
      });

      // 1. Get Token
      const jwtToken = response?.accessToken || response?.token;
      
      if (!jwtToken) {
        throw { message: "No access token received from server" };
      }

      // 2. Decode Token (Source of Truth)
      const decodedToken = this.parseJwt(jwtToken);
      
      // 3. Set Token in API Wrapper
      apiService.setToken(jwtToken);

      // 4. Save Session Data
      if (typeof window !== "undefined") {
        if (response.refreshToken) {
          localStorage.setItem("refreshToken", response.refreshToken);
        }

        // Create User Object (Prioritizing decoded token data)
        const userInfo = {
          id: Number(decodedToken?.sub || response?.id), // Ensure ID is saved!
          username: decodedToken?.username || response?.username || username,
          email: decodedToken?.email || response?.email,
          role: (decodedToken?.role || response?.role || "").toUpperCase(),
        };

        localStorage.setItem("userInfo", JSON.stringify(userInfo));

        // Handle Cookie / Remember Me
        const expiry = rememberMe ? `; max-age=${60 * 60 * 24 * 30}` : "";
        document.cookie = `authToken=${jwtToken}; path=/${expiry}`;
        
        if (rememberMe) localStorage.setItem("rememberMe", "true");
        else localStorage.removeItem("rememberMe");
      }

      return {
        success: true,
        data: response,
        message: "Login successful!",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Login failed",
        status: error.status,
      };
    }
  }

  logout() {
    apiService.removeToken();
    if (typeof window !== "undefined") {
      localStorage.removeItem("userInfo");
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("refreshToken");
      document.cookie = "authToken=; path=/; max-age=0";
    }
  }

  // ==================== PASSWORD MANAGEMENT ====================

  async forgotPassword(email) {
    try {
			const response = await apiService.post(
				"/api/auth/forgot-password",
				{
					email,
				}
			);
      return {
        success: true,
        data: response,
        message: "Password reset link sent to your email",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to send reset link",
        status: error.status,
      };
    }
  }

  async resetPassword(token, newPassword) {
    try {
      const response = await apiService.post("/api/auth/reset-password", {
        token,
        newPassword,
      });
      return {
        success: true,
        data: response,
        message: "Password reset successful",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to reset password",
        status: error.status,
      };
    }
  }

  async changePassword(oldPassword, newPassword) {
    try {
      const response = await apiService.post("/api/auth/change-password", {
        oldPassword,
        newPassword,
      });
      return {
        success: true,
        data: response,
        message: response?.message || "Password changed successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to change password",
        status: error.status,
      };
    }
  }

  // ==================== EMAIL VERIFICATION ====================

  async resendVerification(email) {
    try {
			const response = await apiService.post(
				"/auth/resend-verification",
				{
					email,
				}
			);
      return {
        success: true,
        data: response,
        message: "Verification email sent",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to send verification email",
        status: error.status,
      };
    }
  }

  async verifyEmail(token) {
    try {
			const response = await apiService.post(
				`/api/auth/verify-email?token=${token}`
			);
      return {
        success: true,
        data: response,
        message: "Email verified successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Email verification failed",
        status: error.status,
      };
    }
  }

  // ==================== HELPERS ====================

  isAuthenticated() {
    return apiService.isAuthenticated();
  }

  getCurrentUser() {
    if (typeof window !== "undefined") {
      const userInfo = localStorage.getItem("userInfo");
      return userInfo ? JSON.parse(userInfo) : null;
    }
    return null;
  }

  parseJwt(token) {
    try {
      if (!token) return null;
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Failed to parse JWT", e);
      return {};
    }
  }
}

export default new AuthService();