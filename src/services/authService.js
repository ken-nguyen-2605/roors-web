import apiService from "./api";

class AuthService {
	// Register new user
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

  // Login user
  async login(username, password, rememberMe = false) {
    try {
      const response = await apiService.post("/api/auth/login", {
        username,
        password,
      });

      // Backend returns { token }; keep backward compatibility with accessToken too
      const jwtToken = response?.accessToken || response?.token;
      const refreshToken = response?.refreshToken;

      if (jwtToken) {
        apiService.setToken(jwtToken);

        if (typeof window !== "undefined") {
          // Persist tokens in localStorage
          localStorage.setItem("authToken", jwtToken);
          if (refreshToken) {
            localStorage.setItem("refreshToken", refreshToken);
          }

          // Mirror token into a cookie so Next.js middleware can read it
          const expiry = rememberMe
            ? `; max-age=${60 * 60 * 24 * 30}` // 30 days
            : "";
          document.cookie = `authToken=${jwtToken}; path=/${expiry}`;

          // Prefer user details coming directly from backend response (LoginResponse)
          const backendRole = response?.role;
          const backendUsername = response?.username;
          const backendEmail = response?.email;

          // Fallback to decoding token if needed (for legacy tokens)
          const decodedToken = this.parseJwt(jwtToken);
          const info = {
            username:
              backendUsername ||
              decodedToken?.username ||
              decodedToken?.sub ||
              username,
            email: backendEmail || decodedToken?.email || null,
            role: (backendRole || decodedToken?.role || "").toUpperCase(),
            id: decodedToken?.sub || null,
          };

          localStorage.setItem("userInfo", JSON.stringify(info));

          if (rememberMe) {
            localStorage.setItem("rememberMe", "true");
          } else {
            localStorage.removeItem("rememberMe");
          }
        }
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

	// Logout user
	logout() {
		apiService.removeToken();
		if (typeof window !== "undefined") {
			localStorage.removeItem("userInfo");
			localStorage.removeItem("rememberMe");
      localStorage.removeItem("refreshToken");
      // Remove cookie used by middleware
      document.cookie = "authToken=; path=/; max-age=0";
		}
	}

	// Forgot password
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

	// Reset password
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

  // Change password (authenticated user: old + new password)
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

	// Resend verification email
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

	// Verify email
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

	// Check if user is authenticated
	isAuthenticated() {
		return apiService.isAuthenticated();
	}

	// Get current user info
	getCurrentUser() {
		if (typeof window !== "undefined") {
			const userInfo = localStorage.getItem("userInfo");
			return userInfo ? JSON.parse(userInfo) : null;
		}
		return null;
	}

	parseJwt(token) {
		try {
			// Get the payload part (the second part of x.y.z)
			const base64Url = token.split(".")[1];
			const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
			const jsonPayload = decodeURIComponent(
				atob(base64)
					.split("")
					.map(function (c) {
						return (
							"%" +
							("00" + c.charCodeAt(0).toString(16)).slice(-2)
						);
					})
					.join("")
			);

			return JSON.parse(jsonPayload);
		} catch (e) {
			console.error("Failed to parse JWT", e);
			return null;
		}
	}
}

export default new AuthService();
