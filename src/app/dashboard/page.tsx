'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  FiHome, FiPlus, FiUser, FiDollarSign, FiAlertCircle, FiGrid, FiList, FiBarChart2, FiCheckCircle, FiXCircle, FiClock, FiEdit3, FiEye, FiTrendingUp, FiPackage
} from 'react-icons/fi';
import axios from 'axios';
import Image from 'next/image';

const DashboardPage = () => {
  const { user } = useAuth();
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFlats = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/flats?createdBy=' + user?._id + '&limit=3');

        if (data.success) {
          setFlats(data.flats);
        }
      } catch (error) {
        console.error('Error fetching flats:', error);
        setError('Failed to fetch your flats');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchFlats();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-slate-500 dark:text-slate-400">Loading user data...</p>
      </div>
    );
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  const StatCard = ({ title, value, icon: Icon, color, unit, isLoading }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    unit?: string;
    isLoading?: boolean;
  }) => (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-start">
      <div className={`p-3 rounded-full mr-4 bg-${color}-100 dark:bg-${color}-900/40`}>
        <Icon className={`h-6 w-6 text-${color}-600 dark:text-${color}-400`} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</p>
        {isLoading ? (
          <div className="h-7 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mt-1"></div>
        ) : (
          <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
            {value} {unit && <span className="text-sm font-normal text-slate-500 dark:text-slate-400">{unit}</span>}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Welcome, {user.name.split(' ')[0]}!</h1>
        <Link
          href="/dashboard/flats/new"
          className="inline-flex items-center justify-center px-5 py-2.5 bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        >
          <FiPlus className="-ml-1 mr-2 h-5 w-5" />
          Add New Flat
        </Link>
      </div>

      {!user.isSubscribed && (
        <div className="bg-amber-50 dark:bg-amber-900/50 border-l-4 border-amber-400 dark:border-amber-500 rounded-r-lg p-5 shadow-md flex items-start">
          <FiAlertCircle className="h-6 w-6 text-amber-500 dark:text-amber-400 mr-4 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200">Subscription Required</h3>
            <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
              Unlock full access to list your properties and enjoy all platform features by subscribing.
              Your current plan does not allow listing new flats.
            </p>
            <Link
              href="/pricing"
              className="mt-3 inline-block text-sm font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 hover:underline transition-colors duration-150"
            >
              View Pricing Plans &rarr;
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="My Listed Flats"
          value={loading ? '' : flats.length}
          icon={FiList}
          color="sky"
          unit={flats.length === 1 ? "flat" : "flats"}
          isLoading={loading}
        />
        <StatCard
          title="Subscription"
          value={user.isSubscribed ? 'Active' : 'Inactive'}
          icon={user.isSubscribed ? FiCheckCircle : FiXCircle}
          color={user.isSubscribed ? 'green' : 'red'}
        />
        <StatCard
          title="Account Type"
          value={user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()}
          icon={FiUser}
          color="purple"
        />
        <StatCard
          title="Plan Expiry"
          value={user.isSubscribed ? formatDate(user.subscriptionExpiryDate) : 'N/A'}
          icon={FiClock}
          color="amber"
        />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Your Recent Listings</h2>
          {flats.length > 0 && (
            <Link
              href="/dashboard/flats"
              className="text-sm font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 transition-colors duration-150 hover:underline"
            >
              View All Flats &rarr;
            </Link>
          )}
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            <svg className="animate-spin h-8 w-8 text-sky-600 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading your listings...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-b-xl">
            <FiAlertCircle className="h-10 w-10 mx-auto mb-3" />
            <p className="font-semibold">Oops! Something went wrong.</p>
            <p className="text-sm">{error}. Please try again later.</p>
          </div>
        ) : flats.length === 0 ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            <FiPackage className="h-12 w-12 mx-auto mb-4 text-slate-400 dark:text-slate-500" />
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-1">No Flats Listed Yet</h3>
            <p className="text-sm mb-4">It looks like you haven't added any properties. Get started now!</p>
            <Link
              href="/dashboard/flats/new"
              className="inline-flex items-center justify-center px-4 py-2 bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white text-sm font-medium rounded-md shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105"
            >
              <FiPlus className="-ml-1 mr-1.5 h-5 w-5" />
              List Your First Flat
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-slate-700">
            {flats.map((flat: any) => (
              <li key={flat._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-150">
                <Link href={`/flats/${flat._id}`} className="block p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start min-w-0 flex-1">
                      {flat.photos && flat.photos.length > 0 ? (
                        <Image
                          src={flat.photos[0]}
                          alt={flat.title}
                          width={80}
                          height={80}
                          className="w-20 h-20 rounded-lg object-cover mr-5 border border-slate-200 dark:border-slate-600 shadow-sm"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center mr-5 border border-slate-300 dark:border-slate-600 shadow-sm">
                          <FiHome className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold text-sky-700 dark:text-sky-400 truncate mb-1" title={flat.title}>{flat.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate mb-1" title={`${flat.locality}, ${flat.city}`}>
                          {flat.locality}, {flat.city}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
                          <span className="inline-flex items-center bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">₹{flat.monthlyRent.toLocaleString()}/month</span>
                          <span className="inline-flex items-center bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">{flat.bhkType}</span>
                          <span className="inline-flex items-center bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full capitalize">{flat.furnishingType.replace('-', ' ')}</span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full ${flat.availability === 'immediate' ? 'bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-200' : 'bg-amber-100 dark:bg-amber-700 text-amber-700 dark:text-amber-200'}`}>
                            {flat.availability === 'immediate' ? 'Immediate' : `From ${formatDate(flat.availableFrom)}`}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 sm:mt-0 flex-shrink-0 flex flex-col sm:flex-row sm:items-center gap-2">
                      <Link
                        href={`/flats/${flat._id}`}
                        className="inline-flex items-center justify-center text-xs font-medium px-3 py-1.5 rounded-md text-sky-700 dark:text-sky-300 bg-sky-100 dark:bg-sky-700/50 hover:bg-sky-200 dark:hover:bg-sky-700 transition-colors duration-150 w-full sm:w-auto"
                        title="View Listing"
                      >
                        <FiEye className="h-4 w-4 mr-1.5" /> View
                      </Link>
                      <Link
                        href={`/dashboard/flats/${flat._id}`}
                        className="inline-flex items-center justify-center text-xs font-medium px-3 py-1.5 rounded-md text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-150 w-full sm:w-auto"
                        title="Edit Listing"
                      >
                        <FiEdit3 className="h-4 w-4 mr-1.5" /> Edit
                      </Link>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg">
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Quick Actions</h2>
          </div>
          <div className="p-6 grid grid-cols-2 gap-4">
            {[
              { href: '/dashboard/flats/new', label: 'Add New Flat', icon: FiPlus },
              { href: '/dashboard/profile', label: 'Update Profile', icon: FiUser },
              { href: '/dashboard/subscription', label: 'Subscription', icon: FiDollarSign },
              { href: '/flats', label: 'Browse All Flats', icon: FiGrid },
            ].map(action => (
              <Link
                key={action.href}
                href={action.href}
                className="bg-sky-50 dark:bg-sky-900/30 hover:bg-sky-100 dark:hover:bg-sky-800/60 p-4 rounded-lg flex flex-col items-center justify-center text-center transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
              >
                <action.icon className="h-7 w-7 text-sky-600 dark:text-sky-400 mb-2.5" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg">
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Account Overview</h2>
          </div>
          <div className="p-6 space-y-4">
            {[
              { label: 'Full Name', value: user.name },
              { label: 'Email Address', value: user.email },
              { label: 'Phone Number', value: user.phone || <span className="italic text-slate-500 dark:text-slate-400">Not provided</span> },
              { label: 'Account Type', value: <span className="capitalize bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full text-xs font-medium">{user.role.toLowerCase()}</span> },
              {
                label: 'Subscription Status',
                value: user.isSubscribed ?
                  <span className="text-green-600 dark:text-green-400 font-semibold">Active</span> :
                  <span className="text-red-600 dark:text-red-400 font-semibold">Inactive</span>
              },
            ].map(detail => (
              <div key={detail.label}>
                <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{detail.label}</h3>
                <p className="text-md text-slate-700 dark:text-slate-200 mt-0.5">{detail.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
