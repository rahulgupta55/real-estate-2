'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { 
  FiHome, 
  FiUsers, 
  FiDollarSign, 
  FiMenu, 
  FiX,
  FiLogOut,
  FiSettings,
  FiList,
  FiBarChart2
} from 'react-icons/fi';
import { UserRole } from '@/models/User';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Redirect to login if not authenticated or not admin
    if (!user) {
      router.push('/login');
    } else if (user.role !== UserRole.ADMIN) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!user || user.role !== UserRole.ADMIN) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800">
        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 flex flex-col md:flex-row">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden bg-white dark:bg-gray-900 p-4 flex items-center justify-between shadow-md">
        <Link href="/admin" className="text-xl font-bold text-blue-600 dark:text-blue-400">
          MyFlat Admin
        </Link>
        <button
          onClick={toggleSidebar}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          {isSidebarOpen ? (
            <FiX className="h-6 w-6" />
          ) : (
            <FiMenu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed md:relative inset-y-0 left-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition duration-200 ease-in-out z-30 md:z-0 w-64 bg-white dark:bg-gray-900 h-full shadow-md`}
      >
        <div className="p-6">
          <Link href="/admin" className="text-2xl font-bold text-blue-600 dark:text-blue-400 block mb-6">
            MyFlat Admin
          </Link>

          <div className="mb-8">
            <div className="flex items-center mb-4">
              {user.profilePicture ? (
                <Image
                  src={user.profilePicture}
                  alt={user.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="ml-3">
                <p className="text-gray-900 dark:text-white font-medium">{user.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Administrator</p>
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            <Link
              href="/admin"
              className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30"
            >
              <FiBarChart2 className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              Dashboard
            </Link>
            <Link
              href="/admin/users"
              className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30"
            >
              <FiUsers className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              Users
            </Link>
            <Link
              href="/admin/flats"
              className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30"
            >
              <FiHome className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              Flats
            </Link>
            <Link
              href="/admin/payments"
              className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30"
            >
              <FiDollarSign className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              Payments
            </Link>
            <Link
              href="/admin/settings"
              className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30"
            >
              <FiSettings className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              Settings
            </Link>
          </nav>

          <div className="mt-auto pt-8">
            <button
              onClick={logout}
              className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-900/30 w-full"
            >
              <FiLogOut className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
