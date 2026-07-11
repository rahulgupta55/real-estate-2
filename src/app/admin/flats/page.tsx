'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { FiEdit2, FiTrash2, FiEye, FiSearch, FiAlertCircle } from 'react-icons/fi';

const AdminFlatsPage = () => {
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchFlats();
  }, []);

  const fetchFlats = async () => {
    try {
      setLoading(true);
      
      // In a real application, you would have an API endpoint for this
      // For now, we'll simulate with dummy data
      // const { data } = await axios.get('/api/admin/flats');
      
      // if (data.success) {
      //   setFlats(data.flats);
      // }
      
      // Dummy data for development
      setFlats([
        { 
          _id: '1', 
          title: 'Modern 2BHK in Indiranagar', 
          city: 'Bangalore', 
          locality: 'Indiranagar', 
          bhkType: '2 BHK', 
          monthlyRent: 25000, 
          isActive: true,
          createdBy: { name: 'John Doe', role: 'broker' },
          images: ['/building.jpg']
        },
        { 
          _id: '2', 
          title: 'Spacious 3BHK in Koramangala', 
          city: 'Bangalore', 
          locality: 'Koramangala', 
          bhkType: '3 BHK', 
          monthlyRent: 35000, 
          isActive: true,
          createdBy: { name: 'Jane Smith', role: 'owner' },
          images: ['/building.jpg']
        },
        { 
          _id: '3', 
          title: 'Cozy 1BHK in HSR Layout', 
          city: 'Bangalore', 
          locality: 'HSR Layout', 
          bhkType: '1 BHK', 
          monthlyRent: 18000, 
          isActive: false,
          createdBy: { name: 'Bob Johnson', role: 'tenant' },
          images: ['/building.jpg']
        },
        { 
          _id: '4', 
          title: 'Luxury 4BHK in Whitefield', 
          city: 'Bangalore', 
          locality: 'Whitefield', 
          bhkType: '4 BHK', 
          monthlyRent: 45000, 
          isActive: true,
          createdBy: { name: 'Alice Brown', role: 'broker' },
          images: ['/building.jpg']
        },
        { 
          _id: '5', 
          title: 'Budget 1BHK in Electronic City', 
          city: 'Bangalore', 
          locality: 'Electronic City', 
          bhkType: '1 BHK', 
          monthlyRent: 15000, 
          isActive: true,
          createdBy: { name: 'Charlie Wilson', role: 'owner' },
          images: ['/building.jpg']
        },
        { 
          _id: '6', 
          title: 'Penthouse in South Mumbai', 
          city: 'Mumbai', 
          locality: 'Worli', 
          bhkType: '4 BHK', 
          monthlyRent: 120000, 
          isActive: true,
          createdBy: { name: 'John Doe', role: 'broker' },
          images: ['/building.jpg']
        },
        { 
          _id: '7', 
          title: 'Sea-facing 3BHK in Bandra', 
          city: 'Mumbai', 
          locality: 'Bandra', 
          bhkType: '3 BHK', 
          monthlyRent: 85000, 
          isActive: true,
          createdBy: { name: 'Jane Smith', role: 'owner' },
          images: ['/building.jpg']
        },
        { 
          _id: '8', 
          title: 'Modern 2BHK in Andheri', 
          city: 'Mumbai', 
          locality: 'Andheri', 
          bhkType: '2 BHK', 
          monthlyRent: 45000, 
          isActive: false,
          createdBy: { name: 'Bob Johnson', role: 'tenant' },
          images: ['/building.jpg']
        }
      ]);
    } catch (error) {
      console.error('Error fetching flats:', error);
      setError('Failed to fetch flats');
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
      // In a real application, you would have an API endpoint for this
      // const { data } = await axios.delete(`/api/admin/flats/${deleteId}`);
      
      // if (data.success) {
      //   setFlats(flats.filter((flat: any) => flat._id !== deleteId));
      //   setShowDeleteModal(false);
      //   setDeleteId(null);
      // }
      
      // For development
      setFlats(flats.filter((flat: any) => flat._id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting flat:', error);
      setError('Failed to delete flat');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      // In a real application, you would have an API endpoint for this
      // const { data } = await axios.patch(`/api/admin/flats/${id}`, {
      //   isActive: !currentStatus
      // });
      
      // if (data.success) {
      //   setFlats(flats.map((flat: any) => 
      //     flat._id === id ? { ...flat, isActive: !currentStatus } : flat
      //   ));
      // }
      
      // For development
      setFlats(flats.map((flat: any) => 
        flat._id === id ? { ...flat, isActive: !currentStatus } : flat
      ));
    } catch (error) {
      console.error('Error updating flat status:', error);
      setError('Failed to update flat status');
    }
  };

  // Get unique cities for filter
  const cities = Array.from(new Set(flats.map((flat: any) => flat.city)));

  const filteredFlats = flats.filter((flat: any) => {
    const matchesSearch = flat.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          flat.locality.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity ? flat.city === selectedCity : true;
    return matchesSearch && matchesCity;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Flats</h1>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md p-4 mb-6 text-red-600 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder="Search flats..."
            />
          </div>
          <div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredFlats.length === 0 ? (
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No flats found</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Flat
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Owner
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                {filteredFlats.map((flat: any) => (
                  <tr key={flat._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 relative">
                          <Image
                            src={flat.images[0] || '/placeholder-flat.jpg'}
                            alt={flat.title}
                            fill
                            className="rounded-md object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {flat.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {flat.bhkType}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{flat.locality}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{flat.city}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        ₹{flat.monthlyRent.toLocaleString('en-IN')}/month
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{flat.createdBy.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{flat.createdBy.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(flat._id, flat.isActive)}
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          flat.isActive
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                      >
                        {flat.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/flats/${flat._id}`}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="View"
                        >
                          <FiEye className="h-5 w-5" />
                        </Link>
                        <button
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                          title="Edit"
                        >
                          <FiEdit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(flat._id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete"
                        >
                          <FiTrash2 className="h-5 w-5" />
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                    <FiAlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Delete Flat
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Are you sure you want to delete this flat? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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

export default AdminFlatsPage;
