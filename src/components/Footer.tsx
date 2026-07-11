'use client';

import React from 'react';
import Link from 'next/link';
import { FiHome, FiMail, FiPhone, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About MyFlat */}
          <div className="mb-8 md:mb-0">
            <div className="flex items-center mb-4">
              <svg className="h-8 w-auto text-sky-600 dark:text-sky-400 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
                MyFlat
              </h3>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
              Your trusted partner in finding the perfect flat. We connect brokers, owners, and tenants seamlessly.
            </p>
            <div className="flex space-x-4">
              {[
                { href: "#", icon: FiFacebook, label: "Facebook" },
                { href: "#", icon: FiTwitter, label: "Twitter" },
                { href: "#", icon: FiInstagram, label: "Instagram" },
                { href: "#", icon: FiLinkedin, label: "LinkedIn" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 transition-colors duration-300"
                >
                  <social.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="mb-8 md:mb-0">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/flats", label: "Browse Flats" },
                // { href: "/pricing", label: "Pricing Plans" },
                { href: "/about", label: "About Our Mission" },
                { href: "/contact", label: "Get In Touch" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-600 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 transition-colors duration-300 text-sm hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Support */}
          <div className="mb-8 md:mb-0">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-5">
              Legal & Support
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/terms", label: "Terms of Service" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/faq", label: "Frequently Asked Questions" },
                { href: "/sitemap", label: "Sitemap" }, // Example new page
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-600 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 transition-colors duration-300 text-sm hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-5">
              Contact Information
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start">
                <FiHome className="h-5 w-5 text-sky-600 dark:text-sky-400 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-slate-600 dark:text-slate-400">
                  GCET, Greater Noida, India
                </span>
              </li>
              <li className="flex items-center">
                <FiPhone className="h-5 w-5 text-sky-600 dark:text-sky-400 mr-3 flex-shrink-0" />
                <a href="tel:+919999999999" className="text-slate-600 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 transition-colors duration-300">
                  +91 99999 99999
                </a>
              </li>
              <li className="flex items-center">
                <FiMail className="h-5 w-5 text-sky-600 dark:text-sky-400 mr-3 flex-shrink-0" />
                <a href="mailto:info@myflat.com" className="text-slate-600 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 transition-colors duration-300">
                  info@myflat.com
                </a>
              </li>
            </ul>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-6">
              Office Hours: Mon - Fri, 9 AM - 6 PM IST
            </p>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700 mt-10 pt-8">
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} MyFlat. All rights reserved. Built with ❤️ in India.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
