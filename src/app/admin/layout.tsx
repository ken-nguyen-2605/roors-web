import type { Metadata } from "next";
import AdminBackground from "@/components/admin/AdminBackground";

export const metadata: Metadata = {
  title: "ROORS Admin",
  description: "Restaurant Online Ordering and Reservation System - Admin",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen text-gray-900">
      <AdminBackground />
      {children}
    </div>
  );
}
