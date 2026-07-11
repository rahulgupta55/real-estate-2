'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import {
  FiPlus, FiEdit2, FiTrash2, FiEye, FiAlertCircle, FiHome, FiMapPin, FiDollarSign, FiCheckCircle, FiXCircle, FiLoader, FiPackage, FiSearch, FiFilter,
  FiChevronDown, FiChevronUp, FiPower
} from 'react-icons/fi';

const sortData = (data: any[], config: { key: keyof any; direction: 'ascending' | 'descending' } | null) => {
  if (!config) return data;
  return [...data].sort((a, b) => {
    let aValue = a[config.key];
    let bValue = b[config.key];

    if (typeof config.key === 'string' && config.key.includes('.')) {
      aValue = config.key.split('.').reduce((obj, key) => obj?.[key], a);
      bValue = config.key.split('.').reduce((obj, key) => obj?.[key], b);
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
    } else if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
    } else if (aValue instanceof Date && bValue instanceof Date) {
      aValue = aValue.getTime();
      bValue = bValue.getTime();
    } else {
      aValue = String(aValue).toLowerCase();
      bValue = String(bValue).toLowerCase();
    }

    if (aValue < bValue) {
      return config.direction === 'ascending' ? -1 : 1;
    }
    if (aValue > bValue) {
      return config.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });
};

const DashboardFlatsPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [flats, setFlats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof any; direction: 'ascending' | 'descending' } | null>({ key: 'createdAt', direction: 'descending' });
  const [updatingStatus, setUpdatingStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!user) {
      return;
    }

    if (!user.isSubscribed) {
      setLoading(false);
      return;
    }

    fetchFlats();
  }, [user]);

  const fetchFlats = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await axios.get(`/api/flats?createdBy=${user?._id}`);
      if (data.success) {
        const processedFlats = data.flats.map((flat: any) => ({
          ...flat,
          isActive: flat.isActive === undefined ? true : flat.isActive,
          createdAt: flat.createdAt || new Date(0).toISOString()
        }));
        setFlats(processedFlats);
      } else {
        setError(data.message || 'Failed to fetch your flats');
      }
    } catch (error: any) {
      console.error('Error fetching flats:', error);
      setError(error.response?.data?.message || error.message || 'An unexpected error occurred while fetching your flats');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    try {
      const { data } = await axios.delete(`/api/flats/${deleteId}`);
      if (data.success) {
        setFlats(flats.filter((flat: any) => flat._id !== deleteId));
        setShowDeleteModal(false);
        setDeleteId(null);
      } else {
        setError(data.message || 'Failed to delete flat');
        setShowDeleteModal(false);
      }
    } catch (error: any) {
      console.error('Error deleting flat:', error);
      setError(error.response?.data?.message || error.message || 'An unexpected error occurred while deleting the flat');
      setShowDeleteModal(false);
    }
  };

  const handleToggleActiveStatus = async (flatId: string, currentStatus: boolean) => {
    setUpdatingStatus(prev => ({ ...prev, [flatId]: true }));
    try {
      const newStatus = !currentStatus;
      const response = await axios.put(`/api/flats/${flatId}`, { isActive: newStatus });
      if (response.data.success) {
        setFlats(prevFlats =>
          prevFlats.map(flat =>
            flat._id === flatId ? { ...flat, isActive: newStatus } : flat
          )
        );
      } else {
        setError(response.data.message || 'Failed to update status');
      }
    } catch (err: any) {
      console.error('Error updating flat status:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred while updating status.');
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [flatId]: false }));
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  const sortedAndFilteredFlats = useMemo(() => {
    let filtered = flats;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(flat => flat.isActive === (filterStatus === 'active'));
    }

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(flat =>
        (flat.title?.toLowerCase() || '').includes(lowerSearchTerm) ||
        (flat.locality?.toLowerCase() || '').includes(lowerSearchTerm) ||
        (flat.city?.toLowerCase() || '').includes(lowerSearchTerm)
      );
    }

    return sortData(filtered, sortConfig);
  }, [flats, searchTerm, filterStatus, sortConfig]);

  const requestSort = (key: keyof any) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof any) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <FiChevronDown className="h-4 w-4 opacity-30 group-hover:opacity-100" />;
    }
    return sortConfig.direction === 'ascending' ? <FiChevronUp className="h-4 w-4" /> : <FiChevronDown className="h-4 w-4" />;
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <FiLoader className="animate-spin h-8 w-8 text-sky-600" />
        <p className="ml-3 text-slate-500 dark:text-slate-400">Authenticating...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">My Property Listings</h1>
        <Link
          href="/dashboard/flats/new"
          className="inline-flex items-center justify-center px-5 py-2.5 bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        >
          <FiPlus className="-ml-1 mr-2 h-5 w-5" />
          Add New Property
        </Link>
      </div>

      {!user.isSubscribed && (
        <div className="bg-amber-50 dark:bg-amber-900/50 border-l-4 border-amber-400 dark:border-amber-500 rounded-r-lg p-5 shadow-md flex items-start">
          <FiAlertCircle className="h-6 w-6 text-amber-500 dark:text-amber-400 mr-4 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200">Subscription Required to List Properties</h3>
            <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
              To add and manage your property listings, an active subscription is needed.
              Please subscribe to unlock this feature and more.
            </p>
            <Link
              href="/pricing"
              className="mt-3 inline-block text-sm font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 hover:underline transition-colors duration-150"
            >
              Explore Subscription Plans &rarr;
            </Link>
          </div>
        </div>
      )}

      {user.isSubscribed && (
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-xl shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <div>
              <label htmlFor="search-flats" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                <FiSearch className="inline h-4 w-4 mr-1 text-slate-400 dark:text-slate-500" />
                Search Listings
              </label>
              <input
                type="text"
                id="search-flats"
                placeholder="Search by title, locality, city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-slate-700 dark:text-white transition-colors"
              />
            </div>
            <div>
              <label htmlFor="filter-status" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                <FiFilter className="inline h-4 w-4 mr-1 text-slate-400 dark:text-slate-500" />
                Filter by Status
              </label>
              <select
                id="filter-status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-slate-700 dark:text-white transition-colors appearance-none bg-no-repeat bg-right pr-8"
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")` }}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center h-80 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
          <FiLoader className="animate-spin h-12 w-12 text-sky-600 dark:text-sky-400" />
          <p className="mt-4 text-lg font-medium text-slate-600 dark:text-slate-300">Loading your properties...</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Please wait a moment.</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-600 rounded-r-lg p-6 shadow-md flex items-start">
          <FiAlertCircle className="h-8 w-8 text-red-600 dark:text-red-400 mr-4 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-semibold text-red-800 dark:text-red-200">Error Fetching Properties</h3>
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
              {error}
            </p>
            <button
              onClick={fetchFlats}
              className="mt-4 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-slate-900"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : !user.isSubscribed ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 text-center">
          <FiPackage className="h-16 w-16 mx-auto mb-5 text-slate-400 dark:text-slate-500" />
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">Subscription Needed</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Please subscribe to list and manage your properties.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center px-6 py-2.5 bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            View Pricing Plans
          </Link>
        </div>
      ) : sortedAndFilteredFlats.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 text-center">
          <FiPackage className="h-16 w-16 mx-auto mb-5 text-slate-400 dark:text-slate-500" />
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">
            {searchTerm || filterStatus !== 'all' ? 'No Properties Match Your Criteria' : 'No Properties Listed Yet'}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {searchTerm || filterStatus !== 'all'
              ? 'Try adjusting your search or filter terms.'
              : "You haven't listed any properties yet. Get started by adding one!"}
          </p>
          <Link
            href="/dashboard/flats/new"
            className="inline-flex items-center px-6 py-2.5 bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            <FiPlus className="-ml-1 mr-2 h-5 w-5" />
            List Your First Property
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-900/50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 dark:text-white sm:pl-6 group cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors" onClick={() => requestSort('title')}>
                    <div className="flex items-center">
                      Property Details {getSortIcon('title')}
                    </div>
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white hidden lg:table-cell group cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors" onClick={() => requestSort('city')}>
                    <div className="flex items-center">
                      Location {getSortIcon('city')}
                    </div>
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white hidden md:table-cell group cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors" onClick={() => requestSort('monthlyRent')}>
                    <div className="flex items-center">
                      Rent & Deposit {getSortIcon('monthlyRent')}
                    </div>
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white hidden sm:table-cell group cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors" onClick={() => requestSort('availability')}>
                    <div className="flex items-center">
                      Availability {getSortIcon('availability')}
                    </div>
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white group cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors" onClick={() => requestSort('isActive')}>
                    <div className="flex items-center">
                      Status {getSortIcon('isActive')}
                    </div>
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right text-sm font-semibold text-slate-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-800">
                {sortedAndFilteredFlats.map((flat: any) => (
                  <tr key={flat._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-150">
                    <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-slate-900 dark:text-white sm:w-auto sm:max-w-none sm:pl-6">
                      <div className="flex items-center">
                        <div className="h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 relative mr-4">
                          <Image
                            src={flat.photos?.[0] || '/building.jpg'}
                            alt={flat.title}
                            fill
                            sizes="(max-width: 640px) 64px, 80px"
                            className="rounded-lg object-cover border border-slate-200 dark:border-slate-600 shadow-sm"
                          />
                        </div>
                        <div>
                          <Link href={`/flats/${flat._id}`} className="font-semibold text-sky-600 dark:text-sky-400 hover:underline truncate" title={flat.title}>
                            {flat.title}
                          </Link>
                          <dl className="font-normal lg:hidden mt-1">
                            <dt className="sr-only">Location</dt>
                            <dd className="text-xs text-slate-500 dark:text-slate-400 truncate">{flat.locality}, {flat.city}</dd>
                            <dt className="sr-only sm:hidden">Rent & Deposit</dt>
                            <dd className="text-xs text-slate-500 dark:text-slate-400 sm:hidden">Rent: ₹{flat.monthlyRent.toLocaleString()}</dd>
                            <dt className="sr-only sm:hidden">Availability</dt>
                            <dd className="text-xs text-slate-500 dark:text-slate-400 sm:hidden capitalize">
                              {flat.availability === 'immediate' ? 'Immediate' : `From ${formatDate(flat.availableFrom)}`}
                            </dd>
                          </dl>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {flat.bhkType} <span className="mx-1">•</span> {flat.furnishingType.replace('-', ' ')} <span className="mx-1">•</span> {flat.propertyType}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-3 py-4 text-sm text-slate-500 dark:text-slate-400 lg:table-cell whitespace-nowrap">
                      {flat.locality}, {flat.city}
                    </td>
                    <td className="hidden px-3 py-4 text-sm text-slate-500 dark:text-slate-400 md:table-cell whitespace-nowrap">
                      <div>₹{flat.monthlyRent.toLocaleString('en-IN')}/month</div>
                      <div className="text-xs">Deposit: ₹{flat.depositAmount.toLocaleString('en-IN')}</div>
                    </td>
                    <td className="hidden px-3 py-4 text-sm text-slate-500 dark:text-slate-400 sm:table-cell whitespace-nowrap capitalize">
                      {flat.availability === 'immediate' ?
                        <span className="inline-flex items-center rounded-full bg-green-50 dark:bg-green-900/50 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-300 ring-1 ring-inset ring-green-600/20 dark:ring-green-500/30">
                          Immediate
                        </span> :
                        <span className="inline-flex items-center rounded-full bg-amber-50 dark:bg-amber-900/50 px-2 py-1 text-xs font-medium text-amber-700 dark:text-amber-300 ring-1 ring-inset ring-amber-600/20 dark:ring-amber-500/30">
                          {`From ${formatDate(flat.availableFrom)}`}
                        </span>
                      }
                    </td>
                    <td className="px-3 py-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleActiveStatus(flat._id, flat.isActive)}
                        disabled={updatingStatus[flat._id] || !user.isSubscribed}
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold leading-5 transition-colors group
                                          ${flat.isActive
                            ? 'bg-green-100 text-green-800 dark:bg-green-700/50 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-600/50'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-700/50 dark:text-rose-200 hover:bg-rose-200 dark:hover:bg-rose-600/50'
                          }
                                          ${updatingStatus[flat._id] ? 'opacity-50 cursor-not-allowed' : ''}
                                          ${!user.isSubscribed ? 'opacity-50 cursor-not-allowed !bg-slate-100 !text-slate-400 dark:!bg-slate-600 dark:!text-slate-500' : ''}
                                        `}
                        title={!user.isSubscribed ? "Subscription required to change status" : (flat.isActive ? "Deactivate Listing" : "Activate Listing")}
                      >
                        {updatingStatus[flat._id] ? (
                          <FiLoader className="-ml-0.5 mr-1 h-3.5 w-3.5 animate-spin" />
                        ) : flat.isActive ? (
                          <FiCheckCircle className="-ml-0.5 mr-1 h-3.5 w-3.5" />
                        ) : (
                          <FiXCircle className="-ml-0.5 mr-1 h-3.5 w-3.5" />
                        )}
                        {updatingStatus[flat._id] ? 'Updating...' : (flat.isActive ? 'Active' : 'Inactive')}
                      </button>
                    </td>
                    <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 whitespace-nowrap">
                      <div className="flex justify-end items-center space-x-2 sm:space-x-3">
                        <Link
                          href={`/flats/${flat._id}`}
                          className="p-1.5 rounded-md text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-700/50 transition-colors duration-150"
                          title="View Listing"
                        >
                          <FiEye className="h-4 w-4 sm:h-5 sm:w-5" />
                          <span className="sr-only">View</span>
                        </Link>
                        <Link
                          href={`/dashboard/flats/${flat._id}`}
                          className="p-1.5 rounded-md text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-700/50 transition-colors duration-150"
                          title="Edit Listing"
                        >
                          <FiEdit2 className="h-4 w-4 sm:h-5 sm:w-5" />
                          <span className="sr-only">Edit</span>
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(flat._id)}
                          className="p-1.5 rounded-md text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-700/50 transition-colors duration-150"
                          title="Delete Listing"
                          disabled={!user.isSubscribed || updatingStatus[flat._id]}
                        >
                          <FiTrash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                          <span className="sr-only">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-slate-500/75 dark:bg-slate-900/80 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-slate-200 dark:border-slate-700">
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50 sm:mx-0 sm:h-10 sm:w-10">
                    <FiAlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-semibold text-slate-900 dark:text-white" id="modal-title">
                      Confirm Deletion
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Are you sure you want to delete this property listing? This action is permanent and cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-slate-900 sm:w-auto sm:text-sm transition-colors duration-150"
                >
                  Delete Property
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full inline-flex justify-center rounded-md border border-slate-300 dark:border-slate-600 shadow-sm px-4 py-2 bg-white dark:bg-slate-700 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-slate-900 sm:w-auto sm:text-sm transition-colors duration-150"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardFlatsPage;
