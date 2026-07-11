"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FiUsers, FiTarget, FiHome, FiAward } from "react-icons/fi";
import { useState, useEffect } from "react";

export default function About() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            setIsDarkMode(true);
        } else {
            setIsDarkMode(false);
        }
    }, []);

    return (
        <div className={`min-h-screen flex flex-col ${isDarkMode ? "dark" : ""} bg-gray-100 dark:bg-slate-900 transition-colors duration-300`}>
            <Navbar />

            {/* Header Section */}
            <section className="relative bg-gradient-to-br from-sky-500 via-indigo-600 to-purple-700 dark:from-slate-800 dark:via-slate-900 dark:to-black text-white py-24">
                <div className="absolute inset-0 bg-black opacity-20 dark:opacity-40"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 text-center">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
                        About <span className="text-sky-300 dark:text-sky-400">MyFlat</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-200 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
                        Connecting people with their perfect living spaces since 2023
                    </p>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-16 sm:py-20 bg-white dark:bg-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                                Our Story
                            </h2>
                            <div className="space-y-4 text-gray-600 dark:text-gray-300">
                                <p>
                                    Founded in 2023, MyFlat emerged from a simple yet powerful vision: to transform the way people find and rent flats in India. We recognized the challenges and frustrations in the traditional rental process and set out to create a solution.
                                </p>
                                <p>
                                    What began as a small team of passionate innovators has grown into a comprehensive platform connecting thousands of property owners, brokers, and tenants across the country. We've combined technology with a deep understanding of the real estate market to create a service that truly serves our users' needs.
                                </p>
                                <p>
                                    Today, MyFlat stands as a testament to our commitment to innovation, transparency, and user satisfaction in the flat rental ecosystem.
                                </p>
                            </div>
                        </div>
                        <div className="rounded-xl overflow-hidden shadow-2xl">
                            <Image
                                src="/building.jpg"
                                alt="Modern apartment building"
                                width={600}
                                height={400}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Values Section */}
            <section className="py-16 sm:py-20 bg-gray-100 dark:bg-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Our Mission & Values
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            Guided by our core principles, we're committed to revolutionizing the flat rental experience
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg">
                            <div className="bg-indigo-100 dark:bg-indigo-900/50 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                                <FiTarget className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                To create a transparent, efficient, and user-friendly platform that simplifies the flat rental process for everyone involved. We aim to bridge the gap between property owners and tenants, making quality housing accessible to all.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg">
                            <div className="bg-sky-100 dark:bg-sky-900/50 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                                <FiAward className="h-8 w-8 text-sky-600 dark:text-sky-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Values</h3>
                            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                                <li className="flex items-start">
                                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold mr-2">•</span>
                                    <span><strong>Transparency:</strong> We believe in honest, clear communication in all our dealings.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold mr-2">•</span>
                                    <span><strong>Innovation:</strong> We continuously evolve our platform to meet changing needs.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold mr-2">•</span>
                                    <span><strong>Accessibility:</strong> We strive to make quality housing solutions available to everyone.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold mr-2">•</span>
                                    <span><strong>User-centric:</strong> Our users' needs drive every feature and decision.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 sm:py-20 bg-white dark:bg-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Meet Our Team
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            Dedicated professionals passionate about transforming the flat rental experience
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { name: "Rahul Sharma", role: "Founder & CEO", bio: "With over 15 years in real estate, Rahul leads MyFlat's vision and strategic direction." },
                            { name: "Priya Patel", role: "CTO", bio: "Tech innovator focused on creating seamless digital experiences for our users." },
                            { name: "Arjun Mehta", role: "Head of Operations", bio: "Ensures smooth functioning of all platform processes and user satisfaction." },
                        ].map((member, index) => (
                            <div key={index} className="bg-gray-100 dark:bg-slate-900 p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
                                <div className="bg-indigo-100 dark:bg-indigo-900/50 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                                    <FiUsers className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                                    {member.name}
                                </h3>
                                <p className="text-indigo-600 dark:text-indigo-400 text-sm mb-4 text-center">
                                    {member.role}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300 text-center">
                                    {member.bio}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 sm:py-20 bg-gradient-to-r from-indigo-600 to-purple-700 dark:from-slate-800 dark:to-black text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-6">Join Our Growing Community</h2>
                    <p className="text-lg sm:text-xl mb-10 max-w-3xl mx-auto text-gray-200 dark:text-gray-300">
                        Whether you're looking for your next home or wanting to list your property, MyFlat is here to help you succeed.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/register"
                            className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                        >
                            Get Started
                        </Link>
                        <Link
                            href="/contact"
                            className="bg-transparent hover:bg-white/20 border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}