'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import {
  FiHome,
  FiPlus,
  FiUser,
  FiDollarSign,
  FiMenu,
  FiX,
  FiLogOut,
  FiGrid,
  FiSettings,
  FiHelpCircle
} from 'react-icons/fi';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <svg className="animate-spin h-10 w-10 text-sky-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: FiHome },
    { href: '/dashboard/flats', label: 'My Flats', icon: FiGrid },
    { href: '/dashboard/flats/new', label: 'Add New Flat', icon: FiPlus },
    { href: '/dashboard/profile', label: 'Profile Settings', icon: FiUser },
    { href: '/dashboard/subscription', label: 'Subscription', icon: FiDollarSign },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
      <header className="md:hidden bg-white dark:bg-slate-800 p-4 flex items-center justify-between shadow-md sticky top-0 z-40">
        <Link href="/dashboard" className="flex items-center text-xl font-bold text-sky-600 dark:text-sky-400">
          <svg className="h-8 w-auto mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          MyFlat
        </Link>
        <button
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          className="p-2 rounded-md text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          {isSidebarOpen ? <FiX className="h-7 w-7" /> : <FiMenu className="h-7 w-7" />}
        </button>
      </header>

      <aside
        className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'
          } md:translate-x-0 md:shadow-lg md:sticky md:top-0 transition-transform duration-300 ease-in-out z-30 w-72 bg-white dark:bg-slate-800 h-screen flex flex-col border-r border-slate-200 dark:border-slate-700`}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
          <Link href="/dashboard" className="flex items-center text-2xl font-bold text-sky-600 dark:text-sky-400">
            <svg className="h-9 w-auto mr-2.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            MyFlat
          </Link>
          <button
            onClick={toggleSidebar}
            className="md:hidden p-1 rounded-md text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
            aria-label="Close sidebar"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <div className="p-5 flex-grow overflow-y-auto">
          <div className="mb-8">
            <div className="flex items-center mb-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              {user.profilePicture ? (
                <Image
                  src={user.profilePicture}
                  alt={user.name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover border-2 border-sky-500 dark:border-sky-400"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-sky-500 dark:bg-sky-600 flex items-center justify-center text-white text-xl font-semibold border-2 border-sky-300 dark:border-sky-700">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="ml-4">
                <p className="text-slate-800 dark:text-white font-semibold text-md truncate" title={user.name}>{user.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize bg-slate-200 dark:bg-slate-600 px-2 py-0.5 rounded-full inline-block">
                  {user.role.toLowerCase()}
                </p>
              </div>
            </div>

            <div className={`rounded-lg p-3 text-sm ${user.isSubscribed ? 'bg-green-50 dark:bg-green-900/40 border border-green-200 dark:border-green-700' : 'bg-amber-50 dark:bg-amber-900/40 border border-amber-300 dark:border-amber-600'}`}>
              {user.isSubscribed ? (
                <>
                  <p className="font-semibold text-green-700 dark:text-green-300 mb-1">Subscription Active</p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    Expires: {user.subscriptionExpiryDate ? new Date(user.subscriptionExpiryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-amber-700 dark:text-amber-300 mb-1">No Active Subscription</p>
                  <Link href="/pricing" className="text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 text-xs font-medium hover:underline">
                    Upgrade to Premium
                  </Link>
                </>
              )}
            </div>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => isSidebarOpen && setIsSidebarOpen(false)}
                  className={`group flex items-center px-3 py-2.5 text-sm rounded-md transition-all duration-200 ease-in-out
                    ${isActive
                      ? 'bg-sky-100 dark:bg-sky-700 text-sky-700 dark:text-sky-300 font-semibold shadow-sm'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200 ease-in-out 
                      ${isActive
                        ? 'text-sky-600 dark:text-sky-400'
                        : 'text-slate-500 dark:text-slate-400 group-hover:text-sky-600 dark:group-hover:text-sky-400'
                      }`}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-5 border-t border-slate-200 dark:border-slate-700">
          <Link
            href="/help-center"
            className="group flex items-center px-3 py-2.5 text-sm rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-white transition-colors duration-200 ease-in-out mb-2"
          >
            <FiHelpCircle className="mr-3 h-5 w-5 text-slate-500 dark:text-slate-400 group-hover:text-sky-600 dark:group-hover:text-sky-400" />
            Help & Support
          </Link>
          <button
            onClick={logout}
            className="group flex items-center w-full px-3 py-2.5 text-sm rounded-md text-slate-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/40 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 ease-in-out"
          >
            <FiLogOut className="mr-3 h-5 w-5 text-slate-500 dark:text-slate-400 group-hover:text-red-500 dark:group-hover:text-red-400" />
            Sign Out
          </button>
        </div>
      </aside>

      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-20"
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}

      <div className="flex-1 md:ml-72 md:min-w-0">
        <div className="md:hidden h-16"></div>
        <main className="p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-4rem)] md:min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
