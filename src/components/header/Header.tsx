'use client';

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useScrollTrigger } from "@/utils/ScrollState";
import { useAuth } from "@/contexts/AuthContext"; // ✅ Import the hook

import { Italianno } from 'next/font/google';
const italianno = Italianno({
  weight: '400',
  subsets: ['latin'],
});

import { Icon } from "@iconify/react";
import { FaUserCircle } from "react-icons/fa";

export default function Header({tranYdistance}: {tranYdistance: number}) {
    const router = useRouter();
    const scrolled = useScrollTrigger(tranYdistance);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const profileRef = useRef<HTMLDivElement>(null);

    // ✅ Use the AuthContext instead of hardcoded value
    const { user, isAuthenticated, logout, loading } = useAuth();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // ✅ Handle logout
    const handleLogout = () => {
        logout();
        setIsProfileOpen(false);
    };

    return (
        <div className={`fixed flex items-center justify-between h-[58px] w-full px-[42px] golden z-20 transition-[background-color] duration-300 ease-in-out ${scrolled ? "bg-black" : "backdrop-blur-lg"}`}>
            <Link href="/" className={`${italianno.className} text-4xl cursor-pointer hover:opacity-80 transition-opacity`} style={{ fontStyle: 'italic' }}>
                ROORS
            </Link>
            
            <div className="flex flex-row items-center gap-[30px] h-[34px]">
                <div className="hidden md:flex gap-10 text-xl">    
                    <Link href="/" className="hover:text-yellow-400 transition-colors">Home</Link>
                    <Link href="/menu" className="hover:text-yellow-400 transition-colors">Menus</Link>
                    <Link href="/reservation" className="hover:text-yellow-400 transition-colors">Reservation</Link>
                </div>
                
                {/* <Icon icon="mdi:bell" className="w-[28px] h-[32px] cursor-pointer hover:text-yellow-400 transition-colors"/> */}
                
                {/* Profile Dropdown */}
                <div className="relative flex items-center" ref={profileRef}>
                    <button 
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="focus:outline-none hover:opacity-80 transition-opacity flex items-center gap-2"
                        aria-label="Profile menu"
                    >
                        <FaUserCircle className="w-[28px] h-[28px]"/>
                        {isLoggedIn && username && (
                            <span className="hidden md:block text-sm">{username}</span>
                        )}
                    </button>

                    {/* Dropdown Menu */}
                    {isProfileOpen && (
                        <div className="absolute top-9 right-0 mt-2 w-48 bg-black border border-yellow-600/30 rounded-lg shadow-lg overflow-hidden">
                            {/* ✅ Show loading state */}
                            {loading ? (
                                <div className="px-4 py-3 text-center">
                                    <span className="text-gray-400">Loading...</span>
                                </div>
                            ) : isAuthenticated ? (
                                // ✅ Logged in menu
                                <>
                                    {/* ✅ Show user info */}
                                    <div className="px-4 py-3 border-b border-yellow-600/20 bg-yellow-600/10">
                                        <p className="font-semibold">{user?.username}</p>
                                        <p className="text-xs text-gray-400">{user?.role}</p>
                                    </div>
                                    
                                    <Link 
                                        href="/profile"
                                        className="block px-4 py-3 hover:bg-yellow-600/20 transition-colors border-b border-yellow-600/20"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon icon="mdi:account" className="w-5 h-5" />
                                            <span>My Profile</span>
                                        </div>
                                    </Link>
                                    <Link 
                                        href="/my_order"
                                        className="block px-4 py-3 hover:bg-yellow-600/20 transition-colors border-b border-yellow-600/20"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon icon="mdi:receipt" className="w-5 h-5" />
                                            <span>My Orders</span>
                                        </div>
                                    </Link>
                                    <Link 
                                        href="/my_reservation"
                                        className="block px-4 py-3 hover:bg-yellow-600/20 transition-colors border-b border-yellow-600/20"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon icon="mdi:calendar-check" className="w-5 h-5" />
                                            <span>My Reservations</span>
                                        </div>
                                    </Link>
                                    {/* ✅ Logout button now works! */}
                                    <button 
                                        className="w-full text-left px-4 py-3 hover:bg-red-600/20 transition-colors text-red-400"
                                        onClick={handleLogout}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon icon="mdi:logout" className="w-5 h-5" />
                                            <span>Logout</span>
                                        </div>
                                    </button>
                                </>
                            ) : (
                                // Not logged in menu
                                <>
                                    <Link 
                                        href="/auth/login"
                                        className="block px-4 py-3 hover:bg-yellow-600/20 transition-colors border-b border-yellow-600/20"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon icon="mdi:login" className="w-5 h-5" />
                                            <span>Login</span>
                                        </div>
                                    </Link>
                                    <Link 
                                        href="/auth/signup"
                                        className="block px-4 py-3 hover:bg-yellow-600/20 transition-colors"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon icon="mdi:account-plus" className="w-5 h-5" />
                                            <span>Sign Up</span>
                                        </div>
                                    </Link>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}