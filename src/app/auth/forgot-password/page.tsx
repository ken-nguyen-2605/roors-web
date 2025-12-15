'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
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
    submitButton: "w-full py-4 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8941F] transition-colors font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed",
    textCenter: "text-center text-gray-700",
    link: "text-blue-600 hover:underline font-medium",
  },
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const validateEmail = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateEmail()) {
      console.log('Validation failed');
      return;
    }

    setIsLoading(true);
    setSuccessMessage('');

    try {
      const result = await authService.forgotPassword(email.trim());

      if (!result?.success) {
        setError(result?.message || 'Failed to send reset email. Please try again.');
        setIsSuccess(false);
        return;
      }

      setError('');
      setIsSuccess(true);
      setSuccessMessage(result.message || 'Password reset link sent to your email');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.');
      console.error('Password reset error:', err);
    } finally {
      setIsLoading(false);
    }
  };

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

            {/* Right - Form Section */}
            <div className={styles.formSection.container}>
              <div className={styles.formSection.formWrapper}>
                <div className={styles.formSection.formContainer}>
                  
                  {!isSuccess ? (
                    <>
                      <h2 className={styles.form.title}>Forgot Password?</h2>
                      <p className={styles.form.subtitle}>
                        Enter your email address and we'll send you a link to reset your password
                      </p>

                      {successMessage && (
                        <p className="text-green-600 text-center">{successMessage}</p>
                      )}

                      <form onSubmit={handleSubmit} className={styles.form.form}>
                        
                        {/* Email Field */}
                        <div className={styles.form.fieldWrapper}>
                          <label className={styles.form.label}>Email address</label>
                          <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className={`${styles.form.input} ${
                              error ? styles.form.inputError : styles.form.inputNormal
                            }`}
                            disabled={isLoading}
                          />
                          {error && (
                            <p className={styles.form.errorText}>{error}</p>
                          )}
                        </div>

                        {/* Submit Button */}
                        <button 
                          type="submit" 
                          className={styles.form.submitButton}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Sending...' : 'Send Reset Link'}
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
                  ) : (
                    <div className="text-center space-y-6">
                      {/* Success Icon */}
                      <div className="flex justify-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                          <svg 
                            className="w-10 h-10 text-green-500" 
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

                      <h2 className={styles.form.title}>Check Your Email</h2>
                      <p className="text-gray-600">
                        We've sent a password reset link to
                      </p>
                      <p className="text-gray-800 font-semibold">{email}</p>
                      <p className="text-gray-600 text-sm">
                        Didn't receive the email? Check your spam folder or{' '}
                        <button 
                          onClick={() => {
                            setIsSuccess(false);
                            setSuccessMessage('');
                          }}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          try again
                        </button>
                      </p>

                      <Link 
                        href="/auth/login" 
                        className={`block ${styles.form.submitButton} inline-block`}
                      >
                        Back to Sign In
                      </Link>
                    </div>
                  )}

                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
