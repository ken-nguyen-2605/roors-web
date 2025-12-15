'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Star from "@/components/decorativeComponents/Star";
import Line from "@/components/decorativeComponents/Line";
import authService from "@/services/authService";

const styles = {
  page: {
    // Use full viewport height so the page content naturally reaches the footer
    container: "relative bg-[#F5F4ED] min-h-[972px] flex flex-col",
  },
  header: {
    container: "w-full bg-black text-white py-6 border-b-4 border-[#D4AF37]",
    content: "max-w-[1280px] mx-auto px-4 text-center",
    title: "text-4xl font-bold text-[#D4AF37]",
  },
  main: {
    // Let content define its height; avoid max-height that can create awkward blank space
    wrapper: "flex-1 py-14",
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
  },
};

type ChangePasswordForm = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

type ValidationErrors = Partial<Record<keyof ChangePasswordForm | 'submit', string>>;

export default function ChangePasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ChangePasswordForm>({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (name in errors) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: ValidationErrors = {};

    if (!formData.oldPassword) {
      newErrors.oldPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'New password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      newErrors.newPassword = 'New password must contain uppercase, lowercase, and number';
    }

    if (!formData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'New passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors(prev => ({ ...prev, submit: undefined }));

    try {
      const result = await authService.changePassword(
        formData.oldPassword,
        formData.newPassword
      );

      if (!result?.success) {
        setErrors({ submit: result?.message || 'Failed to change password. Please try again.' });
        return;
      }

      // On success, redirect to profile or login
      router.push('/profile');
    } catch (error: any) {
      setErrors({ submit: error?.message || 'Failed to change password. Please try again.' });
      console.error('Change password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page.container}>

      {/* Decorative Stars / Lines */}
      <div className="absolute top-20 left-10 opacity-40">
        <Star />
      </div>
      <div className="absolute bottom-10 right-10 opacity-40">
        <Line direction="horizontal" />
      </div>

      {/* Main Content */}
      <main className={styles.main.wrapper}>
        <div className={styles.main.contentContainer}>
          <div className={styles.main.gridContainer}>
            {/* Left: Image / Illustration */}
            <section className={styles.imageSection.container}>
              <div className={styles.imageSection.imageWrapper}>
                <img
                  src="/image/home2.jpg"
                  alt="Elegant dining experience"
                  className={styles.imageSection.image}
                />
              </div>
            </section>

            {/* Center Divider (Top) */}
            <section className={styles.centerFrameTop.container}>
              <div className={styles.centerFrameTop.divider}>
                <Line direction="vertical" />
              </div>
            </section>

            {/* Right: Change Password Form */}
            <section className={styles.formSection.container}>
              <div className={styles.formSection.formWrapper}>
                <div className={styles.formSection.formContainer}>
                  <h2 className={styles.form.title}>Update Your Password</h2>
                  <p className={styles.form.subtitle}>
                    Enter your current password and choose a new one to keep your account secure.
                  </p>

                  <form className={styles.form.form} onSubmit={handleSubmit}>
                    {/* Current Password */}
                    <div className={styles.form.fieldWrapper}>
                      <label htmlFor="oldPassword" className={styles.form.label}>
                        Current Password
                      </label>
                      <input
                        id="oldPassword"
                        name="oldPassword"
                        type="password"
                        autoComplete="current-password"
                        className={`${styles.form.input} ${
                          errors.oldPassword ? styles.form.inputError : styles.form.inputNormal
                        }`}
                        value={formData.oldPassword}
                        onChange={handleChange}
                        placeholder="Enter your current password"
                      />
                      {errors.oldPassword && (
                        <p className={styles.form.errorText}>{errors.oldPassword}</p>
                      )}
                    </div>

                    {/* New Password */}
                    <div className={styles.form.fieldWrapper}>
                      <label htmlFor="newPassword" className={styles.form.label}>
                        New Password
                      </label>
                      <input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        autoComplete="new-password"
                        className={`${styles.form.input} ${
                          errors.newPassword ? styles.form.inputError : styles.form.inputNormal
                        }`}
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="Enter a new password"
                      />
                      {errors.newPassword && (
                        <p className={styles.form.errorText}>{errors.newPassword}</p>
                      )}
                      <p className={styles.form.helpText}>
                        Must be at least 8 characters and include uppercase, lowercase, and a number.
                      </p>
                    </div>

                    {/* Confirm New Password */}
                    <div className={styles.form.fieldWrapper}>
                      <label htmlFor="confirmNewPassword" className={styles.form.label}>
                        Confirm New Password
                      </label>
                      <input
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                        type="password"
                        autoComplete="new-password"
                        className={`${styles.form.input} ${
                          errors.confirmNewPassword ? styles.form.inputError : styles.form.inputNormal
                        }`}
                        value={formData.confirmNewPassword}
                        onChange={handleChange}
                        placeholder="Re-enter your new password"
                      />
                      {errors.confirmNewPassword && (
                        <p className={styles.form.errorText}>{errors.confirmNewPassword}</p>
                      )}
                    </div>

                    {/* Submit / Error */}
                    {errors.submit && (
                      <p className={styles.form.errorText}>{errors.submit}</p>
                    )}

                    <button
                      type="submit"
                      className={styles.form.submitButton}
                      disabled={isLoading}
                    >
                      {isLoading ? "Changing Password..." : "Change Password"}
                    </button>

                    <p className={styles.form.textCenter}>
                      <Link href="/profile" className={styles.form.link}>
                        Back to Profile
                      </Link>
                    </p>
                  </form>
                </div>
              </div>
            </section>

            {/* Center Divider (Bottom) */}
            <section className={styles.centerFrameBottom.container}>
              <div className={styles.centerFrameBottom.divider}>
                <Line direction="vertical" />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}


