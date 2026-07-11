'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FlatCard from '@/components/FlatCard';
import FilterSidebar from '@/components/FilterSidebar';
import { FiGrid, FiList, FiSearch } from 'react-icons/fi';

// Client component that uses useSearchParams
function FlatsContent() {
  const searchParams = useSearchParams();
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    locality: searchParams.get('locality') || '',
    bhkType: searchParams.get('bhkType') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    furnishingType: searchParams.get('furnishingType') || '',
    preferredTenants: searchParams.get('preferredTenants') || '',
    hasAC: false,
    hasWifi: false,
    hasWashingMachine: false,
    hasRefrigerator: false,
    hasPowerBackup: false,
    hasGatedSecurity: false,
    hasCCTV: false,
    hasElevator: false,
    hasParking: false,
    hasBalcony: false,
    isPetFriendly: false,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    totalFlats: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchFlats();
  }, [filters, pagination.page]);

  const fetchFlats = async () => {
    try {
      setLoading(true);

      // Build query string
      const queryParams = new URLSearchParams();
      queryParams.append('page', pagination.page.toString());
      queryParams.append('limit', pagination.limit.toString());

      if (filters.city) queryParams.append('city', filters.city);
      if (filters.locality) queryParams.append('locality', filters.locality);
      if (filters.bhkType) queryParams.append('bhkType', filters.bhkType);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
      if (filters.furnishingType) queryParams.append('furnishingType', filters.furnishingType);
      if (filters.preferredTenants) queryParams.append('preferredTenants', filters.preferredTenants);

      // Add amenities filters
      Object.entries(filters).forEach(([key, value]) => {
        if (key.startsWith('has') && value === true) {
          queryParams.append(key, 'true');
        }
      });

      if (filters.isPetFriendly) queryParams.append('isPetFriendly', 'true');

      const { data } = await axios.get(`/api/flats?${queryParams.toString()}`);

      if (data.success) {
        setFlats(data.flats);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching flats:', error);
      setError('Failed to fetch flats');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setPagination({ ...pagination, page: 1 }); // Reset to first page when filters change
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update filters with search term
    setFilters({
      ...filters,
      city: searchTerm,
    });
    setPagination({ ...pagination, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    setPagination({ ...pagination, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex-grow bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row">
          {/* Filters */}
          <FilterSidebar onFilterChange={handleFilterChange} filters={filters} />

          {/* Main content */}
          <div className="flex-1 md:ml-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {loading ? 'Loading flats...' : `${pagination.totalFlats} Flats Found`}
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${viewMode === 'grid'
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  aria-label="Grid view"
                >
                  <FiGrid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${viewMode === 'list'
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  aria-label="List view"
                >
                  <FiList className="h-5 w-5" />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md p-4 text-red-600 dark:text-red-300">
                {error}
              </div>
            ) : flats.length === 0 ? (
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-8 text-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No flats found</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Try adjusting your filters or search for a different location.
                </p>
              </div>
            ) : (
              <>
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3'
                      : 'space-y-1.5'
                  }
                >
                  {flats.map((flat: any) => (
                    <FlatCard key={flat._id} flat={flat} viewMode={viewMode} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <nav className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="px-3 py-1 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>

                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                        .filter(
                          (page) =>
                            page === 1 ||
                            page === pagination.totalPages ||
                            (page >= pagination.page - 1 && page <= pagination.page + 1)
                        )
                        .map((page, index, array) => {
                          // Add ellipsis
                          if (index > 0 && page - array[index - 1] > 1) {
                            return (
                              <span key={`ellipsis-${page}`} className="px-3 py-1 text-gray-700 dark:text-gray-300">
                                ...
                              </span>
                            );
                          }

                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-1 rounded-md ${pagination.page === page
                                ? 'bg-blue-600 text-white'
                                : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                                }`}
                            >
                              {page}
                            </button>
                          );
                        })}

                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                        className="px-3 py-1 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component wrapped with suspense
const FlatsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="bg-blue-600 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-6">Find Your Perfect Flat</h1>

          <form className="flex">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-l-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-white sm:text-sm"
                placeholder="Search by city, locality..."
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <Suspense fallback={<div className="flex-grow flex justify-center items-center">Loading flats...</div>}>
        <FlatsContent />
      </Suspense>

      <Footer />
    </div>
  );
};

export default FlatsPage;
