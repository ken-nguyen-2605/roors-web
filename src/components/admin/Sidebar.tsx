"use client";

import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="lg:col-span-3 xl:col-span-2 hidden lg:block">
      <div className="sticky top-20 space-y-1">
        {[
          { id: 'dashboard', label: 'Dashboard', href: '/admin' },
          { id: 'orders', label: 'Orders', href: '/admin/orders' },
          { id: 'menu', label: 'Menu', href: '/admin/menu' },
          { id: 'reservations', label: 'Reservations', href: '/admin/reservations' },
          { id: 'customers', label: 'Customers', href: '/admin/customers' },
          { id: 'users', label: 'Users', href: '/admin/users' },
          { id: 'reports', label: 'Reports', href: '/admin/reports' },
          { id: 'settings', label: 'Settings', href: '/admin/settings' },
        ].map((s) => (
          <Link
            key={s.id}
            href={s.href}
            className="block rounded-xl px-3 py-2 text-sm font-medium bg-white/90 shadow-sm border border-white/20 mb-1 hover:bg-white hover:shadow transition-all"
          >
            {s.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}