"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FiHome, FiSearch, FiDollarSign, FiUsers, FiSun, FiMoon } from "react-icons/fi";
import { useState, useEffect } from "react";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? "dark" : ""} bg-gray-100 dark:bg-slate-900 transition-colors duration-300`}>
      <Navbar />

      {/* Theme Toggle Button */}
      {/* <button
        onClick={toggleTheme}
        className="fixed top-20 right-4 z-50 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
        aria-label="Toggle theme"
      >
        {isDarkMode ? <FiSun className="h-6 w-6" /> : <FiMoon className="h-6 w-6" />}
      </button> */}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-sky-500 via-indigo-600 to-purple-700 dark:from-slate-800 dark:via-slate-900 dark:to-black text-white py-24 md:py-32">
        <div className="absolute inset-0 bg-black opacity-20 dark:opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
                Find Your <span className="text-sky-300 dark:text-sky-400">Perfect Flat</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-200 dark:text-gray-300 mb-10 max-w-xl">
                Connect with brokers, owners, and tenants. Discover the ideal flat tailored to your needs with our seamless platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/flats"
                  className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Browse Flats
                </Link>
                <Link
                  href="/register"
                  className="bg-transparent hover:bg-white/20 border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  List Your Flat
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <Image
                src="/building.jpg"
                alt="Modern apartment building"
                width={600}
                height={450}
                className="rounded-xl shadow-2xl object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-gray-100 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose MyFlat?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We provide a comprehensive, user-friendly platform for all your flat rental needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: FiHome, title: "Extensive Listings", description: "Browse a wide range of flats with detailed information and high-quality images." },
              { icon: FiSearch, title: "Advanced Filters", description: "Find exactly what you're looking for with our powerful and intuitive search filters." },
              { icon: FiDollarSign, title: "Affordable Plans", description: "Choose from flexible subscription plans tailored for brokers, owners, and tenants." },
              { icon: FiUsers, title: "Direct Connections", description: "Connect directly with flat owners, brokers, or tenants without intermediaries." },
            ].map((feature, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 text-center">
                <div className="bg-sky-100 dark:bg-sky-900/50 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 ring-4 ring-sky-200 dark:ring-sky-700">
                  <feature.icon className="h-10 w-10 text-sky-600 dark:text-sky-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-indigo-600 to-purple-700 dark:from-slate-800 dark:to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Find Your Perfect Flat?</h2>
          <p className="text-lg sm:text-xl mb-10 max-w-3xl mx-auto text-gray-200 dark:text-gray-300">
            Join thousands of users who have successfully found their ideal living space or tenants through MyFlat.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Sign Up Now
            </Link>
            <Link
              href="/pricing"
              className="bg-transparent hover:bg-white/20 border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
