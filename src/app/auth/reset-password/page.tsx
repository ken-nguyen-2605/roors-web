'use client';

import { Suspense, useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Star from "@/components/decorativeComponents/Star";
import Line from "@/components/decorativeComponents/Line";
import authService from "@/services/authService";

const styles = {
  page: {
    container: "relative bg-[#F5F4ED] min-h-[952px] flex flex-col",
  },
  header: {
    container: "w-full bg-black text-white py-6 border-b-4 border-[#D4AF37]",
    content: "max-w-[1280px] mx-auto px-4 text-center",
    title: "text-4xl font-bold text-[#D4AF37]",
  },
  main: {
    wrapper: "flex-1 py-14 max-h-[750px]",
    contentContainer: "max-w-[1280px] mx-auto px-3",
    gridContainer: "grid grid-cols-1 md:grid-cols-12 gap-8 items-start",
  },
  imageSection: {
    container: "md:col-span-5",
    imageWrapper: "relative w-full h-[600px] shadow-lg rounded-lg overflow-hidden bg-gray-200",
    image: "w-full h-full object-cover",
  },
  centerFrameTop: {
    container: "md:col-span-1 flex flex-col items-center justify-center min-h-[400px]",
    divider: "flex flex-col w-full h-full items-center justify-items-center top-0",
  },
  centerFrameBottom: {
    container: "md:col-span-1 flex flex-col items-center justify-center min-h-[750px]",
    divider: "flex flex-col w-full h-full items-center justify-items-center bottom-0",
  },
  formSection: {
    container: "md:col-span-5",
    formWrapper: "bg-[#F5F4ED] rounded-lg shadow-lg p-8",
    formContainer: "w-full",
  },
  form: {
    title: "text-4xl font-bold mb-4 text-center",
    subtitle: "text-gray-600 text-center mb-8",
    form: "space-y-6",
    fieldWrapper: "block",
    label: "block text-gray-800 font-medium mb-2",
    input: "w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-[#D4AF37] transition-colors",
    inputError: "border-red-500",
    inputNormal: "border-gray-300",
    errorText: "text-red-500 text-sm mt-1",
    helpText: "text-gray-600 text-sm mt-1",
    submitButton: "w-full py-4 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8941F] transition-colors font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed",
    textCenter: "text-center text-gray-700",
    link: "text-blue-600 hover:underline font-medium",
    button: "w-full py-4 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8941F] transition-colors font-bold text-lg shadow-lg",
  },
};

type PasswordForm = {
  password: string;
  confirmPassword: string;
};

type ValidationErrors = Partial<Record<'password' | 'confirmPassword' | 'submit', string>>;

function LoadingState() {
  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-20 h-20 border-4 border-gray-200 border-t-[#D4AF37] rounded-full animate-spin"></div>
      </div>
      <h2 className="text-4xl font-bold mb-4 text-center">Loading...</h2>
      <p className="text-gray-600 text-center mb-8">Please wait...</p>
    </div>
  );
}
// Separate component that uses useSearchParams
function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState('');
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [formData, setFormData] = useState<PasswordForm>({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const resetToken = searchParams.get('token');

    if (!resetToken) {
      setToken('');
      setTokenValid(false);
      return;
    }

    setToken(resetToken);
    setTokenValid(true);
  }, [searchParams]);

  useEffect(() => {
    if (isSuccess && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (isSuccess && countdown === 0) {
      router.push('/auth/login');
    }
  }, [isSuccess, countdown, router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name in errors) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: ValidationErrors = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!token) {
      setErrors({ submit: 'Reset token is missing or invalid.' });
      return;
    }

    setIsLoading(true);
    setErrors(prev => ({ ...prev, submit: undefined }));

    try {
      const result = await authService.resetPassword(token, formData.password);

      if (!result?.success) {
        setErrors({ submit: result?.message || 'Failed to reset password. Please try again.' });
        return;
      }

      setIsSuccess(true);
    } catch (error: any) {
      setErrors({ submit: error?.message || 'Failed to reset password. Please try again.' });
      console.error('Password reset error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: '', color: '' };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    if (strength <= 2) return { strength, label: 'Weak', color: 'bg-red-500' };
    if (strength <= 3) return { strength, label: 'Fair', color: 'bg-yellow-500' };
    if (strength <= 4) return { strength, label: 'Good', color: 'bg-blue-500' };
    return { strength, label: 'Strong', color: 'bg-green-500' };
  };

  const renderContent = () => {

    if (tokenValid === null) {
      return (
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 border-4 border-gray-200 border-t-[#D4AF37] rounded-full animate-spin"></div>
          </div>
          <h2 className={styles.form.title}>Validating Link</h2>
          <p className={styles.form.subtitle}>Please wait...</p>
        </div>
      );
    }

    if (tokenValid === false) {
      return (
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
              <svg 
                className="w-12 h-12 text-red-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </div>
          </div>

          <h2 className={styles.form.title}>Invalid or Expired Link</h2>
          <p className={styles.form.subtitle}>
            This password reset link is invalid or has expired. Please request a new one.
          </p>

          <div className="space-y-4 pt-4">
            <Link href="/auth/forgot-password" className={`block ${styles.form.button}`}>
              Request New Reset Link
            </Link>

            <p className={styles.form.textCenter}>
              <Link href="/auth/login" className={styles.form.link}>
                Back to Login In
              </Link>
            </p>
          </div>
        </div>
      );
    }

    if (isSuccess) {
      return (
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <svg 
                className="w-12 h-12 text-green-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
          </div>

          <h2 className={styles.form.title}>Password Reset!</h2>
          <p className={styles.form.subtitle}>
            Your password has been successfully reset. You can now sign in with your new password.
          </p>

          <div className="space-y-4 pt-4">
            <Link href="/auth/login" className={`block ${styles.form.button}`}>
              Sign In to Your Account
            </Link>

            <p className={styles.form.textCenter}>
              Redirecting in {countdown} seconds...
            </p>
          </div>
        </div>
      );
    }

    const passwordStrength = getPasswordStrength();

    return (
      <>
        <h2 className={styles.form.title}>Reset Password</h2>
        <p className={styles.form.subtitle}>
          Enter your new password below
        </p>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form.form}>
          
          {/* New Password Field */}
          <div className={styles.form.fieldWrapper}>
            <label className={styles.form.label}>New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your new password"
                className={`${styles.form.input} ${
                  errors.password ? styles.form.inputError : styles.form.inputNormal
                }`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className={styles.form.errorText}>{errors.password}</p>
            )}
            {formData.password && !errors.password && (
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${passwordStrength.color} transition-all duration-300`}
                      style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{passwordStrength.label}</span>
                </div>
                <p className={styles.form.helpText}>
                  Use 8+ characters with uppercase, lowercase, and numbers
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className={styles.form.fieldWrapper}>
            <label className={styles.form.label}>Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your new password"
                className={`${styles.form.input} ${
                  errors.confirmPassword ? styles.form.inputError : styles.form.inputNormal
                }`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
              >
                {showConfirmPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className={styles.form.errorText}>{errors.confirmPassword}</p>
            )}
            {formData.confirmPassword && formData.password === formData.confirmPassword && !errors.confirmPassword && (
              <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Passwords match
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className={styles.form.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Resetting Password...' : 'Reset Password'}
          </button>

          {/* Back to Sign In Link */}
          <p className={styles.form.textCenter}>
            Remember your password?{' '}
            <Link href="/auth/login" className={styles.form.link}>
              Sign In
            </Link>
          </p>
        </form>
      </>
    );
  };

    return renderContent();
}

export default function ResetPasswordPage() {
  return (
    <div className={styles.page.container}>
      
      {/* Header */}
      <header className={styles.header.container}>
        <div className={styles.header.content}>
          {/* <h1 className={styles.header.title}>ROORS Restaurant</h1> */}
        </div>
      </header>
      
      {/* Main Content */}
      <main className={styles.main.wrapper}>
        <div className={styles.main.contentContainer}>
          <div className={styles.main.gridContainer}>
            
            {/* Left - Picture Section */}
            <div className={styles.imageSection.container}>
              <div className={styles.imageSection.imageWrapper}>
                <img
                  src="/image/FireChef.jpg"
                  alt="Chef cooking with flames"
                  className={styles.imageSection.image}
                />
              </div>
            </div>

            {/* Center - Invisible Frame with Vertical Lines and Stars */}
            <div className={styles.centerFrameTop.container}>
              <div className={styles.centerFrameTop.divider}>
                <Line color="black" size={200} direction="vertical" thinkness={3}/>
                <Star color="black" size={64}/>
                <Line color="black" size={200} direction="vertical" thinkness={3}/>
              </div>
            </div>

            <div className={styles.centerFrameBottom.container}>
              <div className={styles.centerFrameBottom.divider}>
                <Line color="black" size={200} direction="vertical" thinkness={3}/>
                <Star color="black" size={64}/>
                <Line color="black" size={200} direction="vertical" thinkness={3}/>
              </div>
            </div>

            {/* Right - Form Section with Suspense */}
            <div className={styles.formSection.container}>
              <div className={styles.formSection.formWrapper}>
                <div className={styles.formSection.formContainer}>
                  <Suspense fallback={<LoadingState />}>
                    <ResetPasswordForm />
                  </Suspense>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
