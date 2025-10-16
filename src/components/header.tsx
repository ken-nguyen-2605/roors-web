"use client";

import Link from "next/link";
import Image from "next/image";

import { Italianno } from 'next/font/google';

import { Icon } from "@iconify/react";
import { FaUserCircle } from "react-icons/fa";

const italianno = Italianno({
  weight: '400',
  subsets: ['latin'],
});

export default function Header({tranYdistance}: {tranYdistance: number}) {
    return (
        <div className="fixed flex items-center h-[58px] w-full backdrop-blur-lg px-[42px] gap-[925px] text-[#FBBF24] z-20">
            <span className={`${italianno.className} text-4xl`} style={{ fontStyle: 'italic' }}>ROORS</span>
            <div className="flex flex-row items-center gap-[30px] w-[473px] h-[34px]">
                <div className="flex gap-10 text-xl">    
                    <Link href="/">Home</Link>
                    <Link href="/">Menus</Link>
                    <Link href="/">Reservation</Link>
                </div>
                <Icon icon="mdi:bell" className="w-[28px] h-[32px]"/>
                <FaUserCircle className="w-[30px] h-[30px]"/>
            </div>
        </div>
    )
}

