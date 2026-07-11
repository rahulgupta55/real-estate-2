'use client';

import React, { useState } from 'react';
import { FiFilter, FiX } from 'react-icons/fi';
import { 
  BHKType, 
  PropertyType, 
  FurnishingType, 
  PreferredTenants 
} from '@/models/Flat';

interface FilterSidebarProps {
  onFilterChange: (filters: any) => void;
  filters: any;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilterChange, filters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox inputs
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setLocalFilters({
        ...localFilters,
        [name]: checkbox.checked,
      });
      return;
    }
    
    setLocalFilters({
      ...localFilters,
      [name]: value,
    });
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const resetFilters = () => {
    const resetFilters = {
      city: '',
      locality: '',
      bhkType: '',
      minPrice: '',
      maxPrice: '',
      furnishingType: '',
      preferredTenants: '',
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
    };
    
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <>
      {/* Mobile filter button */}
      <div className="md:hidden fixed bottom-4 right-4 z-20">
        <button
          onClick={toggleSidebar}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg"
        >
          <FiFilter className="h-6 w-6" />
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative top-0 right-0 h-full bg-white dark:bg-gray-800 w-80 shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        } md:block md:w-64 md:z-0 overflow-y-auto`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Filters</h2>
            <button
              onClick={toggleSidebar}
              className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Location Filters */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Location</h3>
              <div className="space-y-3">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={localFilters.city}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label htmlFor="locality" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Locality
                  </label>
                  <input
                    type="text"
                    id="locality"
                    name="locality"
                    value={localFilters.locality}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter locality"
                  />
                </div>
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Price Range</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Min (₹)
                  </label>
                  <input
                    type="number"
                    id="minPrice"
                    name="minPrice"
                    value={localFilters.minPrice}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Min"
                  />
                </div>
                <div>
                  <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Max (₹)
                  </label>
                  <input
                    type="number"
                    id="maxPrice"
                    name="maxPrice"
                    value={localFilters.maxPrice}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>

            {/* Property Type */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Property Type</h3>
              <div className="space-y-3">
                <div>
                  <label htmlFor="bhkType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    BHK Type
                  </label>
                  <select
                    id="bhkType"
                    name="bhkType"
                    value={localFilters.bhkType}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">All BHK Types</option>
                    {Object.values(BHKType).map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="furnishingType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Furnishing
                  </label>
                  <select
                    id="furnishingType"
                    name="furnishingType"
                    value={localFilters.furnishingType}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">All Furnishing Types</option>
                    {Object.values(FurnishingType).map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="preferredTenants" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Preferred Tenants
                  </label>
                  <select
                    id="preferredTenants"
                    name="preferredTenants"
                    value={localFilters.preferredTenants}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">All Tenant Types</option>
                    {Object.values(PreferredTenants).map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Amenities</h3>
              <div className="space-y-2">
                {[
                  { id: 'hasAC', label: 'Air Conditioning' },
                  { id: 'hasWifi', label: 'WiFi' },
                  { id: 'hasWashingMachine', label: 'Washing Machine' },
                  { id: 'hasRefrigerator', label: 'Refrigerator' },
                  { id: 'hasPowerBackup', label: 'Power Backup' },
                  { id: 'hasGatedSecurity', label: 'Gated Security' },
                  { id: 'hasCCTV', label: 'CCTV' },
                  { id: 'hasElevator', label: 'Elevator' },
                  { id: 'hasParking', label: 'Parking' },
                  { id: 'hasBalcony', label: 'Balcony' },
                  { id: 'isPetFriendly', label: 'Pet Friendly' },
                ].map((amenity) => (
                  <div key={amenity.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={amenity.id}
                      name={amenity.id}
                      checked={localFilters[amenity.id] || false}
                      onChange={handleFilterChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={amenity.id} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      {amenity.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={applyFilters}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Apply Filters
              </button>
              <button
                onClick={resetFilters}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
