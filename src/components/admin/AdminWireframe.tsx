"use client";

import AdminHeader from './AdminHeader';
import Sidebar from './Sidebar';
import DashboardSection from './DashboardSection';

import { ReactNode } from 'react';

type Props = {
  children?: ReactNode;
};

export default function AdminWireframe({ children }: Props) {
  return (
    <div className="min-h-screen text-gray-900">
      <AdminHeader />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 animate-[fade-up_0.7s_ease-out_0.2s_forwards] opacity-0">
        <style jsx global>{`
          @keyframes fade-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
        
        <Sidebar />

        <main className="lg:col-span-9 xl:col-span-10 space-y-10">
          {children ?? <DashboardSection />}
        </main>
      </div>
    </div>
  );
}
