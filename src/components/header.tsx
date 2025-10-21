"use client";

import Link from "next/link";
import { useScrollTrigger } from "@/ultility/scrollState";

import { Italianno } from 'next/font/google';
const italianno = Italianno({
  weight: '400',
  subsets: ['latin'],
});

import { Icon } from "@iconify/react";
import { FaUserCircle } from "react-icons/fa";


export default function Header({tranYdistance}: {tranYdistance: number}) {
    const scrolled = useScrollTrigger(tranYdistance);
    return (
<<<<<<< Updated upstream
        <div className={`fixed flex items-center justify-between h-[58px] w-full px-[42px] golden z-20 transition-[background-color] duration-300 ease-in-out ${scrolled ? "bg-black" : "backdrop-blur-lg"}`}>
            <span className={`${italianno.className} text-4xl`} style={{ fontStyle: 'italic' }}>ROORS</span>
            <div className="flex flex-row items-center gap-[30px] h-[34px]">
                <div className="hidden  md:flex gap-10 text-xl">    
                    <Link href="/" className="transition-transform duration-150 hover:scale-110">Home</Link>
                    <Link href="/menu" className="transition-transform duration-150 hover:scale-110">Menus</Link>
                    <Link href="/" className="transition-transform duration-150 hover:scale-110">Reservation</Link>
=======
        <div className="fixed flex items-center justify-between h-[58px] w-full backdrop-blur-lg px-[42px] text-[#FBBF24] z-20">
            <span className={`${italianno.className} text-4xl`} style={{ fontStyle: 'italic' }}>ROORS</span>
            <div className="flex flex-row items-center gap-[30px] h-[34px]">
                <div className="flex gap-10 text-xl">    
                    <Link href="/">Home</Link>
                    <Link href="/">Menus</Link>
                    <Link href="/">Reservation</Link>
                    <Link href="/admin">Admin</Link>
>>>>>>> Stashed changes
                </div>
                <Icon icon="mdi:bell" className="w-[28px] h-[32px]"/>
                <FaUserCircle className="w-[30px] h-[30px]"/>
            </div>
        </div>
    )
}

