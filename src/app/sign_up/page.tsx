'use client';

import { useState } from 'react';
import Link from 'next/link';
import Star from "@/components/decorativeComponents/Star";
import Line from "@/components/decorativeComponents/Line";

const styles = {
  page: {
    container: "relative bg-[#F5F4ED] min-h-screen flex flex-col",
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
  centerFrame: {
    container: "md:col-span-1 flex flex-col items-center justify-center min-h-[600px]",
    divider: "flex flex-col w-full h-full items-center justify-items-center",
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
    checkboxWrapper: "flex items-center",
    checkbox: "w-4 h-4 rounded border-2",
    checkboxError: "border-red-500",
    checkboxNormal: "border-gray-400",
    checkboxLabel: "ml-2 text-sm text-gray-700",
    link: "text-blue-600 hover:underline",
    linkBold: "text-blue-600 hover:underline font-medium",
    submitButton: "w-full py-4 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8941F] transition-colors font-bold text-lg shadow-lg",
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

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log('Sign up successful:', formData);
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
                  
                  <h2 className={styles.form.title}>Get Started Now</h2>

                  <form onSubmit={handleSubmit} className={styles.form.form}>
                    
                    {/* Name Field */}
                    <div className={styles.form.fieldWrapper}>
                      <label className={styles.form.label}>Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        className={`${styles.form.input} ${
                          errors.name ? styles.form.inputError : styles.form.inputNormal
                        }`}
                      />
                    </div>

                    {/* Email Field */}
                    <div className={styles.form.fieldWrapper}>
                      <label className={styles.form.label}>Email address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className={`${styles.form.input} ${
                          errors.email ? styles.form.inputError : styles.form.inputNormal
                        }`}
                      />
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
                      />
                    </div>

                    {/* Terms Checkbox */}
                    <div className={styles.form.checkboxWrapper}>
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        id="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                        className={`${styles.form.checkbox} ${
                          errors.agreeToTerms ? styles.form.checkboxError : styles.form.checkboxNormal
                        }`}
                      />
                      <label htmlFor="agreeToTerms" className={styles.form.checkboxLabel}>
                        I agree to the{' '}
                        <a href="/terms" className={styles.form.link}>
                          terms & policy
                        </a>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className={styles.form.submitButton}>
                      Signup
                    </button>

                    {/* Sign In Link */}
                    <p className={styles.form.textCenter}>
                      Have an account?{' '}
                      <a href="/signin" className={styles.form.linkBold}>
                        Sign In
                      </a>
                    </p>
                  </form>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer.container}>
        <div className={`${styles.footer.maxWidth} ${styles.footer.grid}`}>
          <div>
            <h4 className={styles.footer.heading}>Contact</h4>
            <ul className={styles.footer.list}>
              <li>📘 Facebook Link</li>
              <li>📷 Instagram Link</li>
              <li>🎵 TikTok Link</li>
              <li>📧 Email Link</li>
            </ul>
          </div>
          
          <div>
            <h4 className={styles.footer.heading}>Location</h4>
            <p>📍 123 Culinary Street</p>
            <p>Downtown District</p>
            <p>City, State 12345</p>
          </div>
          
          <div>
            <h4 className={styles.footer.heading}>Hotline</h4>
            <p>📞 0123456789</p>
            <p>📱 0987654321</p>
          </div>
          
          <div>
            <h4 className={styles.footer.heading}>Opening Hours</h4>
            <p>🕐 Mon-Fri: 11:00 - 22:00</p>
            <p>🕐 Sat-Sun: 10:00 - 23:00</p>
          </div>
        </div>
        
        <div className={`${styles.footer.maxWidth} ${styles.footer.divider}`}>
          <p>&copy; 2025 ROORS. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}