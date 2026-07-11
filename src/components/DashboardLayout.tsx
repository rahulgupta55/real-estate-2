'use client';

import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/models/User';
import { 
  FiHome, FiUser, FiList, FiPlus, FiCreditCard, 
  FiSettings, FiLogOut, FiMenu, FiX, FiUsers, FiDatabase
} from 'react-icons/fi';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <FiHome className="h-5 w-5" />,
      roles: [UserRole.ADMIN, UserRole.BROKER, UserRole.OWNER, UserRole.TENANT],
    },
    {
      name: 'Profile',
      path: '/dashboard/profile',
      icon: <FiUser className="h-5 w-5" />,
      roles: [UserRole.ADMIN, UserRole.BROKER, UserRole.OWNER, UserRole.TENANT],
    },
    {
      name: 'My Flats',
      path: '/dashboard/flats',
      icon: <FiList className="h-5 w-5" />,
      roles: [UserRole.BROKER, UserRole.OWNER],
    },
    {
      name: 'Add New Flat',
      path: '/dashboard/flats/new',
      icon: <FiPlus className="h-5 w-5" />,
      roles: [UserRole.BROKER, UserRole.OWNER],
    },
    {
      name: 'Subscription',
      path: '/dashboard/subscription',
      icon: <FiCreditCard className="h-5 w-5" />,
      roles: [UserRole.BROKER, UserRole.OWNER, UserRole.TENANT],
    },
    {
      name: 'Settings',
      path: '/dashboard/settings',
      icon: <FiSettings className="h-5 w-5" />,
      roles: [UserRole.ADMIN, UserRole.BROKER, UserRole.OWNER, UserRole.TENANT],
    },
    // Admin specific routes
    {
      name: 'Manage Users',
      path: '/admin/users',
      icon: <FiUsers className="h-5 w-5" />,
      roles: [UserRole.ADMIN],
    },
    {
      name: 'Manage Flats',
      path: '/admin/flats',
      icon: <FiDatabase className="h-5 w-5" />,
      roles: [UserRole.ADMIN],
    },
  ];

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item => 
    user && item.roles.includes(user.role as UserRole)
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-20">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-white dark:bg-gray-800 shadow-md text-gray-700 dark:text-gray-300"
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
        className={`fixed inset-y-0 left-0 z-10 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              MyFlat
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {user?.role} Dashboard
            </p>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {filteredNavItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    onClick={closeSidebar}
                    className={`flex items-center px-4 py-2 rounded-md ${
                      isActive(item.path)
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-md"
            >
              <FiLogOut className="h-5 w-5" />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64 p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
