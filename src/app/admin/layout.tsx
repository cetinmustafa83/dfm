import React from 'react';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* This is where a sidebar navigation would go later */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground p-4 shadow-md hidden md:block">
        <h2 className="text-xl font-bold mb-6 text-sidebar-primary">Admin Panel</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <a href="/admin" className="block p-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">Dashboard</a>
            </li>
            {/* Future navigation items like Pages, Services, Jobs, etc. */}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}