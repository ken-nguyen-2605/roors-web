"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { FaUserCircle } from "react-icons/fa";
import { Italianno } from 'next/font/google';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Bell, 
  Search, 
  LogOut, 
  Settings, 
  User, 
  HelpCircle,
  ChevronDown,
  X
} from 'lucide-react';

const italianno = Italianno({
  weight: '400',
  subsets: ['latin'],
});

export default function AdminHeader() {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [role, setRole] = useState<'MANAGER' | 'STAFF' | 'CUSTOMER' | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('userInfo');
      try {
        const parsed = raw ? JSON.parse(raw) : null;
        const r = (parsed?.role || '').toUpperCase();
        if (r === 'MANAGER' || r === 'STAFF') {
          setRole(r as 'MANAGER' | 'STAFF');
        } else {
          setRole('CUSTOMER');
        }
      } catch (e) {
        setRole(null);
      }
    }
  }, []);

  const managerLinks = [
    { href: '/admin', label: 'Dashboard', icon: 'mdi:view-dashboard' },
    { href: '/admin/reports', label: 'Reports', icon: 'mdi:chart-bar' },
    { href: '/admin/users', label: 'Users Management', icon: 'mdi:shield-account' },
  ];

  const staffLinks = [
    { href: '/admin/orders', label: 'Orders', icon: 'mdi:shopping' },
    { href: '/admin/deliveries', label: 'Deliveries', icon: 'mdi:truck-delivery' },
    { href: '/admin/menu', label: 'Menu', icon: 'mdi:food' },
    { href: '/admin/reservations', label: 'Reservations', icon: 'mdi:calendar-clock' },
    { href: '/admin/customers', label: 'Customers', icon: 'mdi:account-group' },
  ];

  const commonLinks = [
    { href: '/admin/settings', label: 'Settings', icon: 'mdi:cog' },
  ];

  const navigationLinks = [
    ...(role === 'MANAGER' ? managerLinks : []),
    ...(role === 'STAFF' ? staffLinks : []),
    ...commonLinks,
  ];

  const notifications = [
    { id: 1, type: 'order', message: 'New order #1045 received', time: '2 min ago', unread: true },
    { id: 2, type: 'reservation', message: 'New reservation for 4 guests', time: '15 min ago', unread: true },
    { id: 3, type: 'feedback', message: 'New 5-star review from John Doe', time: '1 hour ago', unread: false },
    { id: 4, type: 'alert', message: 'Low stock alert: French Fries', time: '2 hours ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const isActivePath = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname?.startsWith(href);
  };

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-white/30 shadow-2xl animate-[fade-down_0.5s_ease-out] h-[68px] px-6 md:px-10 lg:px-12">
        <div className="h-full flex items-center justify-between max-w-[1600px] mx-auto">
          {/* Logo */}
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <Icon icon="mdi:silverware-fork-knife" className="w-6 h-6 text-white" />
            </div>
            <span className={`${italianno.className} text-4xl italic bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent`}>
              ROORS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActivePath(link.href)
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon icon={link.icon} className="w-5 h-5" />
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">

           
            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 p-1 pr-3 rounded-lg bg-white/50 backdrop-blur-md hover:bg-white/70 transition-all shadow-lg border border-white/40"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold shadow-xl ring-2 ring-white/50">
                  AD
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-800 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-[scale-in_0.2s_ease-out]">
                  <div className="p-4 border-b bg-gradient-to-r from-orange-50 to-red-50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        AD
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">Admin User</div>
                        <div className="text-xs text-gray-600">admin@roors.com</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 border-t">
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors text-red-600">
                      <LogOut className="w-5 h-5" />
                      <span className="text-sm font-medium">Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 rounded-lg bg-white/50 backdrop-blur-md hover:bg-white/70 transition-all shadow-lg border border-white/40"
            >
              <Icon icon={showMobileMenu ? "mdi:close" : "mdi:menu"} className="w-6 h-6 text-gray-800" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]" onClick={() => setShowMobileMenu(false)}>
          <div 
            className="absolute top-[68px] left-0 right-0 bg-white/90 backdrop-blur-xl border-b border-white/30 shadow-2xl p-4 animate-[slide-down_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="space-y-1">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setShowMobileMenu(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActivePath(link.href)
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon icon={link.icon} className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes fade-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
