'use client';

import React, { useState } from 'react';
import { FiSave, FiAlertCircle } from 'react-icons/fi';
import { UserRole } from '@/models/User';

const AdminSettingsPage = () => {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'MyFlat',
    siteDescription: 'Find your perfect flat with MyFlat - A platform for brokers, owners, and tenants.',
    contactEmail: 'info@myflat.com',
    contactPhone: '+91 9876543210',
    address: '123 Main Street, Bangalore, Karnataka, India'
  });

  const [subscriptionSettings, setSubscriptionSettings] = useState({
    [UserRole.BROKER]: 1000,
    [UserRole.OWNER]: 800,
    [UserRole.TENANT]: 500,
    subscriptionDuration: 30 // days
  });

  const [razorpaySettings, setRazorpaySettings] = useState({
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    currency: 'INR'
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: '',
    smtpPort: '',
    smtpUser: '',
    smtpPassword: '',
    fromEmail: 'noreply@myflat.com',
    fromName: 'MyFlat'
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would save these settings to the database
    setSuccess('General settings saved successfully');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleSubscriptionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would save these settings to the database
    setSuccess('Subscription settings saved successfully');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleRazorpaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would save these settings to the database
    setSuccess('Razorpay settings saved successfully');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would save these settings to the database
    setSuccess('Email settings saved successfully');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>

      {success && (
        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-md p-4 mb-6 text-green-600 dark:text-green-300 flex items-start">
          <FiAlertCircle className="h-5 w-5 mr-3 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md p-4 mb-6 text-red-600 dark:text-red-300 flex items-start">
          <FiAlertCircle className="h-5 w-5 mr-3 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">General Settings</h2>
          </div>
          <form onSubmit={handleGeneralSubmit} className="p-6 space-y-4">
            <div>
              <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Site Name
              </label>
              <input
                type="text"
                id="siteName"
                value={generalSettings.siteName}
                onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Site Description
              </label>
              <textarea
                id="siteDescription"
                value={generalSettings.siteDescription}
                onChange={(e) => setGeneralSettings({ ...generalSettings, siteDescription: e.target.value })}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                id="contactEmail"
                value={generalSettings.contactEmail}
                onChange={(e) => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                id="contactPhone"
                value={generalSettings.contactPhone}
                onChange={(e) => setGeneralSettings({ ...generalSettings, contactPhone: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Address
              </label>
              <textarea
                id="address"
                value={generalSettings.address}
                onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiSave className="mr-2 -ml-1 h-5 w-5" />
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Subscription Settings */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Subscription Settings</h2>
          </div>
          <form onSubmit={handleSubscriptionSubmit} className="p-6 space-y-4">
            <div>
              <label htmlFor="brokerPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Broker Subscription Price (₹)
              </label>
              <input
                type="number"
                id="brokerPrice"
                value={subscriptionSettings[UserRole.BROKER]}
                onChange={(e) => setSubscriptionSettings({ ...subscriptionSettings, [UserRole.BROKER]: parseInt(e.target.value) })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                required
                min="0"
              />
            </div>
            <div>
              <label htmlFor="ownerPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Owner Subscription Price (₹)
              </label>
              <input
                type="number"
                id="ownerPrice"
                value={subscriptionSettings[UserRole.OWNER]}
                onChange={(e) => setSubscriptionSettings({ ...subscriptionSettings, [UserRole.OWNER]: parseInt(e.target.value) })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                required
                min="0"
              />
            </div>
            <div>
              <label htmlFor="tenantPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tenant Subscription Price (₹)
              </label>
              <input
                type="number"
                id="tenantPrice"
                value={subscriptionSettings[UserRole.TENANT]}
                onChange={(e) => setSubscriptionSettings({ ...subscriptionSettings, [UserRole.TENANT]: parseInt(e.target.value) })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                required
                min="0"
              />
            </div>
            <div>
              <label htmlFor="subscriptionDuration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Subscription Duration (days)
              </label>
              <input
                type="number"
                id="subscriptionDuration"
                value={subscriptionSettings.subscriptionDuration}
                onChange={(e) => setSubscriptionSettings({ ...subscriptionSettings, subscriptionDuration: parseInt(e.target.value) })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                required
                min="1"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiSave className="mr-2 -ml-1 h-5 w-5" />
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Razorpay Settings */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Razorpay Settings</h2>
          </div>
          <form onSubmit={handleRazorpaySubmit} className="p-6 space-y-4">
            <div>
              <label htmlFor="keyId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Key ID
              </label>
              <input
                type="text"
                id="keyId"
                value={razorpaySettings.keyId}
                onChange={(e) => setRazorpaySettings({ ...razorpaySettings, keyId: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="keySecret" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Key Secret
              </label>
              <input
                type="password"
                id="keySecret"
                value={razorpaySettings.keySecret}
                onChange={(e) => setRazorpaySettings({ ...razorpaySettings, keySecret: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Currency
              </label>
              <select
                id="currency"
                value={razorpaySettings.currency}
                onChange={(e) => setRazorpaySettings({ ...razorpaySettings, currency: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                required
              >
                <option value="INR">INR (Indian Rupee)</option>
                <option value="USD">USD (US Dollar)</option>
                <option value="EUR">EUR (Euro)</option>
                <option value="GBP">GBP (British Pound)</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiSave className="mr-2 -ml-1 h-5 w-5" />
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Email Settings */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Email Settings</h2>
          </div>
          <form onSubmit={handleEmailSubmit} className="p-6 space-y-4">
            <div>
              <label htmlFor="smtpHost" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                SMTP Host
              </label>
              <input
                type="text"
                id="smtpHost"
                value={emailSettings.smtpHost}
                onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="e.g. smtp.gmail.com"
              />
            </div>
            <div>
              <label htmlFor="smtpPort" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                SMTP Port
              </label>
              <input
                type="text"
                id="smtpPort"
                value={emailSettings.smtpPort}
                onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="e.g. 587"
              />
            </div>
            <div>
              <label htmlFor="smtpUser" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                SMTP Username
              </label>
              <input
                type="text"
                id="smtpUser"
                value={emailSettings.smtpUser}
                onChange={(e) => setEmailSettings({ ...emailSettings, smtpUser: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="e.g. your-email@gmail.com"
              />
            </div>
            <div>
              <label htmlFor="smtpPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                SMTP Password
              </label>
              <input
                type="password"
                id="smtpPassword"
                value={emailSettings.smtpPassword}
                onChange={(e) => setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="Your SMTP password"
              />
            </div>
            <div>
              <label htmlFor="fromEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                From Email
              </label>
              <input
                type="email"
                id="fromEmail"
                value={emailSettings.fromEmail}
                onChange={(e) => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="fromName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                From Name
              </label>
              <input
                type="text"
                id="fromName"
                value={emailSettings.fromName}
                onChange={(e) => setEmailSettings({ ...emailSettings, fromName: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiSave className="mr-2 -ml-1 h-5 w-5" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
