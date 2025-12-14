"use client";

import AdminHeader from './AdminHeader';
import Sidebar from './Sidebar';
import DashboardSection from './DashboardSection';
import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Shield } from 'lucide-react';
import { col } from 'framer-motion/client';

type Props = {
  children?: ReactNode;
};

export default function AdminWireframe({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isManager, setIsManager] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false); // manager or staff
  const [checkedAuth, setCheckedAuth] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Get page title based on current path
  const getPageTitle = () => {
    if (!pathname) return 'Dashboard';
    const path = pathname.split('/').pop();
    if (!path || path === 'admin') return 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  // Simulate loading for page transitions
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    // Lightweight role flag from localStorage until backend user info is wired in
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('userInfo');
      console.log('Raw user info from localStorage:', raw);
      try {
        const parsed = raw ? JSON.parse(raw) : null;
        console.log('Parsed user info for role check:', parsed?.role);
        const role = (parsed?.role || '').toUpperCase();
        const isMgr = role === 'MANAGER';
        const isStaff = role === 'STAFF';
        setIsManager(isMgr);
        setIsAuthorized(isMgr || isStaff);
        setCheckedAuth(true);
        if (!isMgr && !isStaff) {
          router.push('/');
        }
      } catch (e) {
        setIsManager(false);
        setIsAuthorized(false);
        setCheckedAuth(true);
        router.push('/');
      }
    }
  }, [router]);

  if (!checkedAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Checking access...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-700">Unauthorized.</div>
      </div>
    );
  }

  return (
    <div className="min-h-[500] relative">
      {/* Background Component - Should be added at the app layout level */}
      <AdminHeader />

      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar - Hidden on mobile, shows on desktop */}
          {/* <div className={`hidden lg:block transition-all duration-300 ${
            sidebarOpen ? 'lg:col-span-3 xl:col-span-2' : 'lg:col-span-1'
          }`}>
            <div className="sticky top-24 animate-[fade-in-left_0.6s_ease-out]">
              
            </div>
          </div> */}

          {/* Main Content Area */}
          <main className={`transition-all duration-300 ${
            sidebarOpen ? 'lg:col-span-9 xl:col-span-10' : 'lg:col-span-11'
          }`}>
            {/* Page Header */}
            <div className="mb-8 animate-[fade-in_0.5s_ease-out]">
              <div className="flex items-center justify-between backdrop-blur-md bg-white/60 rounded-2xl p-6 shadow-2xl border border-white/40">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent mb-2 drop-shadow-sm">
                    {getPageTitle()}
                  </h1>
                  <p className="text-gray-800 font-medium drop-shadow-sm">
                    {pathname === '/admin' && 'Welcome back! Here\'s what\'s happening today.'}
                    {pathname === '/admin/orders' && 'Manage and track all your orders in one place.'}
                    {pathname === '/admin/menu' && 'Update your menu items and pricing.'}
                    {pathname === '/admin/reservations' && 'View and manage table reservations.'}
                    {pathname === '/admin/customers' && 'Customer information and feedback management.'}
                    {pathname === '/admin/reports' && 'Business analytics and performance insights.'}
                    {pathname === '/admin/settings' && 'Configure your restaurant settings.'}
                  </p>
                </div>

                {/* Quick Actions - Optional */}
                <div className="hidden md:flex items-center gap-3">
                  <div className="px-4 py-2 rounded-lg bg-white/80 backdrop-blur-md shadow-xl border border-white/50">
                    <div className="text-xs text-gray-700 font-semibold">Today's Date</div>
                    <div className="text-sm font-bold text-gray-900">
                      {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  {isManager && (
                    <Link
                      href="/admin/users"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                    >
                      <Shield className="w-4 h-4" />
                      Manage Users
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Content with Loading State */}
            <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
              <div className="animate-[fade-up_0.7s_ease-out] space-y-8">
                {children ?? <DashboardSection />}
              </div>
            </div>

            {/* Loading Overlay */}
            {isLoading && (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                  <p className="text-sm text-gray-600 font-medium">Loading...</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #f97316, #dc2626);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #ea580c, #b91c1c);
        }

        /* Loading shimmer effect */
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .shimmer {
          animation: shimmer 2s infinite;
          background: linear-gradient(
            to right,
            #f6f7f8 0%,
            #edeef1 20%,
            #f6f7f8 40%,
            #f6f7f8 100%
          );
          background-size: 1000px 100%;
        }
      `}</style>
    </div>
  );
}
