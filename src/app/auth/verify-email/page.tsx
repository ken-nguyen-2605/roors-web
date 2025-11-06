'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Star from "@/components/decorativeComponents/Star";
import Line from "@/components/decorativeComponents/Line";

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
  contentSection: {
    container: "md:col-span-5",
    contentWrapper: "bg-[#F5F4ED] rounded-lg shadow-lg p-8",
    contentContainer: "w-full",
  },
  content: {
    title: "text-4xl font-bold mb-4 text-center",
    subtitle: "text-gray-600 text-center mb-8 text-lg",
    button: "w-full py-4 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8941F] transition-colors font-bold text-lg shadow-lg",
    secondaryButton: "w-full py-4 bg-white text-gray-800 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-bold text-lg shadow-lg",
    textCenter: "text-center text-gray-700 text-sm",
  },
};

export default function EmailVerifiedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState('success'); // verifying, success, error
  const [countdown, setCountdown] = useState(5);
  const [errorMessage, setErrorMessage] = useState('');

//   useEffect(() => {
//     const verifyEmail = async () => {
//       // Get token from URL parameters
//       const token = searchParams.get('token');
      
//       if (!token) {
//         setVerificationStatus('error');
//         setErrorMessage('Verification token is missing');
//         return;
//       }

//       try {
//         // Simulate API call to verify email
//         await new Promise(resolve => setTimeout(resolve, 1500));
        
//         // Here you would call your email verification API
//         // const result = await authService.verifyEmail(token);
        
//         setVerificationStatus('success');
//       } catch (error) {
//         setVerificationStatus('error');
//         setErrorMessage('Failed to verify email. The link may be expired or invalid.');
//         console.error('Email verification error:', error);
//       }
//     };

//     verifyEmail();
//   }, [searchParams]);

  useEffect(() => {
    if (verificationStatus === 'success' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (verificationStatus === 'success' && countdown === 0) {
      router.push('/signin');
    }
  }, [verificationStatus, countdown, router]);

  const renderContent = () => {
    if (verificationStatus === 'verifying') {
      return (
        <div className="text-center space-y-6">
          {/* Loading Spinner */}
          <div className="flex justify-center">
            <div className="w-20 h-20 border-4 border-gray-200 border-t-[#D4AF37] rounded-full animate-spin"></div>
          </div>

          <h2 className={styles.content.title}>Verifying Your Email</h2>
          <p className={styles.content.subtitle}>
            Please wait while we verify your email address...
          </p>
        </div>
      );
    }

    if (verificationStatus === 'success') {
      return (
        <div className="text-center space-y-6">
          {/* Success Icon */}
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

          <h2 className={styles.content.title}>Email Verified!</h2>
          <p className={styles.content.subtitle}>
            Your email has been successfully verified. You can now access all features of your account.
          </p>

          <div className="space-y-4 pt-4">
            <Link href="/signin" className={`block ${styles.content.button}`}>
              Sign In to Your Account
            </Link>

            <p className={styles.content.textCenter}>
              Redirecting to sign in page in {countdown} seconds...
            </p>
          </div>
        </div>
      );
    }

    if (verificationStatus === 'error') {
      return (
        <div className="text-center space-y-6">
          {/* Error Icon */}
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

          <h2 className={styles.content.title}>Verification Failed</h2>
          <p className={styles.content.subtitle}>
            {errorMessage || 'We couldn\'t verify your email address.'}
          </p>

          <div className="space-y-4 pt-4">
            <Link href="/signup" className={`block ${styles.content.button}`}>
              Create New Account
            </Link>

            <Link href="/signin" className={`block ${styles.content.secondaryButton}`}>
              Back to Sign In
            </Link>

            <p className={styles.content.textCenter}>
              Need help?{' '}
              <Link href="/contact" className="text-blue-600 hover:underline font-medium">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      );
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

            {/* Right - Content Section */}
            <div className={styles.contentSection.container}>
              <div className={styles.contentSection.contentWrapper}>
                <div className={styles.contentSection.contentContainer}>
                  {renderContent()}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}