"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FiMapPin, FiPhone, FiMail, FiMessageSquare, FiChevronDown, FiChevronUp } from "react-icons/fi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Contact() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            setIsDarkMode(true);
        } else {
            setIsDarkMode(false);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Form validation and submission logic would go here
        // For now, we'll just simulate a successful submission
        setFormSubmitted(true);

        // Reset form after 3 seconds
        setTimeout(() => {
            setName("");
            setEmail("");
            setPhone("");
            setSubject("");
            setMessage("");
            setFormSubmitted(false);
        }, 3000);
    };

    const toggleFaq = (index: number) => {
        if (expandedFaq === index) {
            setExpandedFaq(null);
        } else {
            setExpandedFaq(index);
        }
    };

    // FAQ data
    const faqs = [
        {
            question: "How can I list my flat on MyFlat?",
            answer: "To list your flat, you need to register an account, select the 'List Your Flat' option from your dashboard, fill in the required details about your property, upload photos, and submit for review. Once approved, your listing will be visible to all users."
        },
        {
            question: "What are the fees for listing a flat?",
            answer: "We offer different subscription plans for property owners and brokers. You can view our detailed pricing on the Pricing page. We offer both free basic listings and premium options with enhanced visibility and features."
        },
        {
            question: "How do I contact a flat owner or broker?",
            answer: "When browsing flat listings, you can contact the owner or broker directly through the messaging system on our platform. Simply click the 'Contact' button on any listing to send a message or request a viewing."
        },
        {
            question: "Is my personal information secure?",
            answer: "Yes, we take data security very seriously. We use industry-standard encryption to protect your personal information, and we never share your contact details with third parties without your consent. You can review our privacy policy for more details."
        },
        {
            question: "How can I report an issue with a listing?",
            answer: "If you encounter any issues with a listing, such as inaccurate information or suspicious activity, please use the 'Report' button on the listing page or contact our support team directly through this contact form."
        }
    ];

    return (
        <div className={`min-h-screen flex flex-col ${isDarkMode ? "dark" : ""} bg-gray-100 dark:bg-slate-900 transition-colors duration-300`}>
            <Navbar />

            {/* Header Section */}
            <section className="relative bg-gradient-to-br from-sky-500 via-indigo-600 to-purple-700 dark:from-slate-800 dark:via-slate-900 dark:to-black text-white py-24">
                <div className="absolute inset-0 bg-black opacity-20 dark:opacity-40"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 text-center">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
                        Contact <span className="text-sky-300 dark:text-sky-400">Us</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-200 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
                        We're here to help with any questions about finding or listing a flat
                    </p>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 sm:py-20 bg-white dark:bg-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                Send Us a Message
                            </h2>

                            {formSubmitted ? (
                                <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded mb-4">
                                    <p className="font-medium">Thank you for your message!</p>
                                    <p>We'll get back to you as soon as possible.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Your Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Phone Number (Optional)
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Subject
                                        </label>
                                        <input
                                            type="text"
                                            id="subject"
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Your Message
                                        </label>
                                        <textarea
                                            id="message"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            rows={5}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                                            required
                                        ></textarea>
                                    </div>

                                    <div>
                                        <button
                                            type="submit"
                                            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                                        >
                                            Send Message
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* Contact Information */}
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                Contact Information
                            </h2>

                            <div className="bg-gray-100 dark:bg-slate-900 rounded-xl p-6 mb-8 shadow-md">
                                <div className="space-y-6">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-full">
                                            <FiMapPin className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Our Office</h3>
                                            <p className="mt-1 text-gray-600 dark:text-gray-300">
                                                123 Tech Park, Silicon Valley<br />
                                                Bangalore, Karnataka 560001<br />
                                                India
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-full">
                                            <FiPhone className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Phone</h3>
                                            <p className="mt-1 text-gray-600 dark:text-gray-300">
                                                Customer Support: +91 1800 123 4567<br />
                                                Office: +91 80 2345 6789
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-full">
                                            <FiMail className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Email</h3>
                                            <p className="mt-1 text-gray-600 dark:text-gray-300">
                                                Support: support@myflatonline.com<br />
                                                Info: info@myflatonline.com<br />
                                                Business: business@myflatonline.com
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Map Placeholder */}
                            <div className="rounded-xl overflow-hidden shadow-lg h-64 bg-gray-200 dark:bg-gray-700 relative">
                                {/* Placeholder for an actual map integration */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="text-gray-600 dark:text-gray-300 text-center">
                                        Map Integration<br />
                                        <span className="text-sm">(Google Maps or other map service would be displayed here)</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 sm:py-20 bg-gray-100 dark:bg-slate-900">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            Find quick answers to common questions
                        </p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden transition-all duration-300"
                            >
                                <button
                                    className="w-full text-left px-6 py-4 flex justify-between items-center focus:outline-none"
                                    onClick={() => toggleFaq(index)}
                                >
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{faq.question}</h3>
                                    {expandedFaq === index ? (
                                        <FiChevronUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                    ) : (
                                        <FiChevronDown className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                    )}
                                </button>
                                <div
                                    className={`px-6 pb-4 transition-all duration-300 ease-in-out ${expandedFaq === index ? 'block opacity-100' : 'hidden opacity-0'
                                        }`}
                                >
                                    <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 sm:py-20 bg-gradient-to-r from-indigo-600 to-purple-700 dark:from-slate-800 dark:to-black text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex items-center justify-center mb-8">
                        <FiMessageSquare className="h-12 w-12 text-sky-300 dark:text-sky-400" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-6">Still Have Questions?</h2>
                    <p className="text-lg sm:text-xl mb-10 max-w-3xl mx-auto text-gray-200 dark:text-gray-300">
                        Our support team is ready to help you with any questions or concerns. We typically respond within 24 hours.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="#contact-form"
                            className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                        >
                            Contact Support
                        </a>
                        <Link
                            href="/flats"
                            className="bg-transparent hover:bg-white/20 border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                        >
                            Browse Flats
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}