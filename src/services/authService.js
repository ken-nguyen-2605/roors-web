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

            // ✅ FIX: Extract tokens from the response
            const { accessToken, refreshToken } = response;

            if (accessToken) {
                // Set token in API service
                apiService.setToken(accessToken);

                if (typeof window !== "undefined") {
                    // Store refresh token for later use
                    localStorage.setItem("refreshToken", refreshToken);

                    // Decode the token to get user details
                    const decodedToken = this.parseJwt(accessToken);

                    if (decodedToken) {
                        const info = {
                            username: decodedToken.username,
                            role: decodedToken.role,
                            id: decodedToken.sub,
                        };

                        console.log(
                            "[authService] Extracted userInfo from JWT:",
                            info
                        );
                        localStorage.setItem("userInfo", JSON.stringify(info));
                    }

                    // Handle remember me
                    if (rememberMe) {
                        localStorage.setItem("rememberMe", "true");
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
