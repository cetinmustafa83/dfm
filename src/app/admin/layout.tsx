import React from 'react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <aside className="w-64 bg-sidebar text-sidebar-foreground p-4 shadow-md hidden md:block">
        <h2 className="text-xl font-bold mb-6 text-sidebar-primary">Admin Panel</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <Link href="/admin" className="block p-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">Dashboard</Link>
            </li>
            <li className="mb-2">
              <Link href="/admin/pages" className="block p-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">Pages</Link>
            </li>
            <li className="mb-2">
              <Link href="/admin/services" className="block p-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">Services</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}