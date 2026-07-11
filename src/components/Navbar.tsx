'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiHome, FiSettings, FiSun, FiMoon } from 'react-icons/fi';
import { UserRole } from '@/models/User';

const Navbar = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    if (newDarkMode) {
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add('dark');
    } else {
      localStorage.setItem("theme", "light");
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <nav className="bg-white dark:bg-slate-800 shadow-lg sticky top-0 z-40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <svg className="h-10 w-auto text-sky-600 dark:text-sky-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
              <span className="ml-3 text-2xl font-bold text-slate-800 dark:text-white">
                MyFlat
              </span>
            </Link>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:space-x-2 items-center">
            {[
              { href: "/", label: "Home" },
              { href: "/flats", label: "Flats" },
              { href: "/about", label: "About Us" },
              { href: "/contact", label: "Contact" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${pathname === item.href
                  ? "bg-sky-100 dark:bg-sky-700 text-sky-700 dark:text-sky-300 font-semibold"
                  : "text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            {/* Theme Toggle Button - visible on desktop */}
            <button
              onClick={toggleTheme}
              className="hidden sm:flex items-center justify-center p-2 rounded-full bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors duration-300"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            </button>

            {user ? (
              <div className="relative">
                <div>
                  <button
                    type="button"
                    onClick={toggleProfileMenu}
                    className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-slate-800 focus:ring-sky-500"
                    {...(isProfileMenuOpen && { "aria-expanded": "true" })} // Conditionally add attribute
                    aria-haspopup="true"
                  >
                    <span className="sr-only">Open user menu</span>
                    {user.profilePicture ? (
                      <Image
                        className="h-10 w-10 rounded-full object-cover"
                        src={user.profilePicture}
                        alt={user.name}
                        width={40}
                        height={40}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-sky-500 dark:bg-sky-600 flex items-center justify-center text-white font-semibold text-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>
                </div>
                {isProfileMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-xl bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                    <div className="py-1">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                          Signed in as
                        </p>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {user.email}
                        </p>
                      </div>
                      {user.role === UserRole.ADMIN ? (
                        <Link
                          href="/admin"
                          className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 w-full text-left"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <FiSettings className="mr-3 h-5 w-5" /> Admin Dashboard
                        </Link>
                      ) : (
                        <Link
                          href="/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 w-full text-left"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <FiHome className="mr-3 h-5 w-5" /> Dashboard
                        </Link>
                      )}
                      <Link
                        href="/dashboard/profile"
                        className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 w-full text-left"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <FiUser className="mr-3 h-5 w-5" /> Your Profile
                      </Link>
                      <button
                        type="button"
                        onClick={() => { logout(); setIsProfileMenuOpen(false); }}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                      >
                        <FiLogOut className="mr-3 h-5 w-5" /> Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-md text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-md text-sm font-medium bg-sky-600 text-white hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 transition-colors duration-300 shadow-md hover:shadow-lg"
                >
                  Register
                </Link>
              </div>
            )}

            <div className="-mr-2 flex items-center sm:hidden">
              {/* Theme Toggle Button - visible on mobile */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200 mr-2 hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors duration-300"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
              </button>

              <button
                type="button"
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500"
                aria-controls="mobile-menu"
                {...(isMenuOpen && { "aria-expanded": "true" })} // Conditionally add attribute
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <FiX className="block h-7 w-7" aria-hidden="true" />
                ) : (
                  <FiMenu className="block h-7 w-7" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1 px-2">
            {[
              { href: "/", label: "Home" },
              { href: "/flats", label: "Flats" },
              { href: "/about", label: "About Us" },
              { href: "/contact", label: "Contact" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${pathname === item.href
                  ? "bg-sky-100 dark:bg-sky-700 text-sky-700 dark:text-sky-300 font-semibold"
                  : "text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-slate-700">
            {user ? (
              <>
                <div className="flex items-center px-5 mb-3">
                  {user.profilePicture ? (
                    <Image
                      className="h-10 w-10 rounded-full object-cover"
                      src={user.profilePicture}
                      alt={user.name}
                      width={40}
                      height={40}
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-sky-500 dark:bg-sky-600 flex items-center justify-center text-white font-semibold text-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="ml-3">
                    <div className="text-base font-semibold text-slate-800 dark:text-white">
                      {user.name}
                    </div>
                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {user.email}
                    </div>
                  </div>
                </div>
                <div className="space-y-1 px-2">
                  {user.role === UserRole.ADMIN ? (
                    <Link
                      href="/admin"
                      className="flex items-center px-3 py-2 rounded-md text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FiSettings className="mr-3 h-5 w-5" /> Admin Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/dashboard"
                      className="flex items-center px-3 py-2 rounded-md text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FiHome className="mr-3 h-5 w-5" /> Dashboard
                    </Link>
                  )}
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiUser className="mr-3 h-5 w-5" /> Your Profile
                  </Link>
                  <button
                    type="button"
                    onClick={() => { logout(); setIsMenuOpen(false); }}
                    className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                  >
                    <FiLogOut className="mr-3 h-5 w-5" /> Sign out
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-1 px-2">
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-sky-600 text-white hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
