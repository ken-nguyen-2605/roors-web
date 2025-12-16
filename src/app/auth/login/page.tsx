'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Star from "@/components/decorativeComponents/Star";
import Line from "@/components/decorativeComponents/Line";
import { useAuth } from '@/contexts/AuthContext'; // ✅ Add this

const styles = {
  page: {
    container: "relative bg-[#F5F4ED] min-h-[972px] flex flex-col",
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
    title: "text-4xl font-bold mb-8 text-center",
    form: "space-y-6",
    fieldWrapper: "block",
    label: "block text-gray-800 font-medium mb-2",
    input: "w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-[#D4AF37] transition-colors",
    inputError: "border-red-500",
    inputNormal: "border-gray-300",
    errorText: "text-red-500 text-sm mt-1",
    successText: "text-green-600 text-sm mt-1",
    checkboxWrapper: "flex items-center",
    checkbox: "w-4 h-4 rounded border-2",
    checkboxError: "border-red-500",
    checkboxNormal: "border-gray-400",
    checkboxLabel: "ml-2 text-sm text-gray-700",
    link: "text-blue-600 hover:underline",
    linkBold: "text-blue-600 hover:underline font-medium",
    submitButton: "w-full py-4 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8941F] transition-colors font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed",
    textCenter: "text-center text-gray-700",
  },
  footer: {
    container: "w-full bg-black text-white py-12 mt-12 border-t-4 border-[#D4AF37]",
    maxWidth: "max-w-[1280px] mx-auto px-4",
    grid: "grid grid-cols-1 md:grid-cols-4 gap-8",
    heading: "text-2xl mb-4 text-[#D4AF37]",
    list: "space-y-2",
    divider: "mt-8 pt-8 border-t border-gray-700 text-center",
  },
};

interface FormErrors {
  username?: string;
  password?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth(); // ✅ Use the context's login function
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    if (apiError) setApiError('');
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError('');
    setApiSuccess('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // ✅ Use context's login instead of authService directly
      const result = await login(
        formData.username,
        formData.password,
        formData.rememberMe
      );

      if (result.success) {
        setApiSuccess(result.message);
        const role = (result.role || '').toUpperCase();

        // Redirect based on role
        const targetPath =
          role === 'STAFF' || role === 'MANAGER'
            ? '/admin'
            : '/';

        setTimeout(() => {
          router.push(targetPath);
        }, 1000);
      } else {
        setApiError(result.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      setApiError('An unexpected error occurred. Please try again.');
      console.error('Login error:', error);
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
                  
                  <h2 className={styles.form.title}>Welcome Back</h2>

                  {apiError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                      {apiError}
                    </div>
                  )}

                  {apiSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                      {apiSuccess}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className={styles.form.form}>
                    
                    {/* Username Field */}
                    <div className={styles.form.fieldWrapper}>
                      <label className={styles.form.label}>Username</label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Enter your username"
                        className={`${styles.form.input} ${
                          errors.username ? styles.form.inputError : styles.form.inputNormal
                        }`}
                        disabled={isLoading}
                      />
                      {errors.username && (
                        <p className={styles.form.errorText}>{errors.username}</p>
                      )}
                    </div>

                    {/* Password Field */}
                    <div className={styles.form.fieldWrapper}>
                      <label className={styles.form.label}>Password</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        className={`${styles.form.input} ${
                          errors.password ? styles.form.inputError : styles.form.inputNormal
                        }`}
                        disabled={isLoading}
                      />
                      {errors.password && (
                        <p className={styles.form.errorText}>{errors.password}</p>
                      )}
                    </div>

                    {/* Remember Me Checkbox */}
                    <div className={styles.form.checkboxWrapper}>
                      <input
                        type="checkbox"
                        name="rememberMe"
                        id="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        className={`${styles.form.checkbox} ${styles.form.checkboxNormal}`}
                        disabled={isLoading}
                      />
                      <label htmlFor="rememberMe" className={styles.form.checkboxLabel}>
                        Remember me
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button 
                      type="submit" 
                      className={styles.form.submitButton}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Logging in...' : 'Login'}
                    </button>

                    {/* Links */}
                    <p className={styles.form.textCenter}>
                      <Link href="/auth/forgot-password" className={styles.form.link}>
                        Forgot password?
                      </Link>
                    </p>

                    <p className={styles.form.textCenter}>
                      {"Don't have an account?"} {' '}
                      <Link href="/auth/signup" className={styles.form.linkBold}>
                        Sign Up
                      </Link>
                    </p>
                  </form>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

    </div>
  );
}