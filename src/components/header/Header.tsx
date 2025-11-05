"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useScrollTrigger } from "@/utils/ScrollState";

import { Italianno } from 'next/font/google';
const italianno = Italianno({
  weight: '400',
  subsets: ['latin'],
});

import { Icon } from "@iconify/react";
import { FaUserCircle } from "react-icons/fa";


export default function Header({tranYdistance}: {tranYdistance: number}) {
    const scrolled = useScrollTrigger(tranYdistance);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

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

    // Mock user state - replace with your actual auth state
    const isLoggedIn = true; // Change this based on your auth logic

    return (
        <div className={`fixed flex items-center justify-between h-[58px] w-full px-[42px] golden z-20 transition-[background-color] duration-300 ease-in-out ${scrolled ? "bg-black" : "backdrop-blur-lg"}`}>
            <span className={`${italianno.className} text-4xl`} style={{ fontStyle: 'italic' }}>ROORS</span>
            <div className="flex flex-row items-center gap-[30px] h-[34px]">
                <div className="hidden md:flex gap-10 text-xl">    
                    <Link href="/">Home</Link>
                    <Link href="/menu">Menus</Link>
                    <Link href="/reservation/">Reservation</Link>
                </div>
                <Icon icon="mdi:bell" className="w-[28px] h-[32px]"/>
                
                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                    <button 
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="focus:outline-none hover:opacity-80 transition-opacity"
                    >
                        <FaUserCircle className="w-[30px] h-[30px]"/>
                    </button>

                    {/* Dropdown Menu */}
                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-black border border-yellow-600/30 rounded-lg shadow-lg overflow-hidden">
                            {isLoggedIn ? (
                                // Logged in menu
                                <>
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
                                    <button 
                                        className="w-full text-left px-4 py-3 hover:bg-red-600/20 transition-colors text-red-400"
                                        onClick={() => {
                                            // Add your logout logic here
                                            setIsProfileOpen(false);
                                        }}
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
                                        href="/log_in"
                                        className="block px-4 py-3 hover:bg-yellow-600/20 transition-colors border-b border-yellow-600/20"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon icon="mdi:login" className="w-5 h-5" />
                                            <span>Login</span>
                                        </div>
                                    </Link>
                                    <Link 
                                        href="/sign_up"
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
    )
}