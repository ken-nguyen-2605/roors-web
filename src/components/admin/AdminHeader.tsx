"use client";

import { Icon } from "@iconify/react";
import { FaUserCircle } from "react-icons/fa";
import { Italianno } from 'next/font/google';
import Link from 'next/link';

const italianno = Italianno({
  weight: '400',
  subsets: ['latin'],
});

export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-10 backdrop-blur-lg border-b animate-[fade-down_0.5s_ease-out] h-[58px] px-[42px] text-[#FBBF24]">
      <div className="h-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`${italianno.className} text-4xl italic`}>ROORS</span>
        </div>
        <div className="flex items-center gap-[30px]">
          <nav className="hidden md:flex items-center gap-10 text-xl">
            <Link href="/admin">Dashboard</Link>
            <Link href="/admin/orders">Orders</Link>
            <Link href="/admin/menu">Menu</Link>
            <Link href="/admin/reservations">Reservations</Link>
            <Link href="/admin/customers">Customers</Link>
            <Link href="/admin/reports">Reports</Link>
            <Link href="/admin/settings">Settings</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Icon icon="mdi:bell" className="w-[28px] h-[32px]"/>
            <FaUserCircle className="w-[30px] h-[30px]"/>
          </div>
        </div>
      </div>
    </header>
  );
}