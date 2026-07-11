'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiMapPin, FiHome, FiDollarSign, FiCalendar, FiUser } from 'react-icons/fi';
import { IFlat } from '@/models/Flat';

interface FlatCardProps {
  flat: IFlat;
  viewMode?: 'grid' | 'list';
}

const FlatCard: React.FC<FlatCardProps> = ({ flat, viewMode = 'grid' }) => {
  if (viewMode === 'list') {
    // Super compact list view
    return (
      <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm overflow-hidden transition-transform duration-300 hover:shadow-md hover:-translate-y-0.5 w-full">
        <div className="flex items-center">
          {/* Very compact image */}
          <div className="relative h-20 w-20 sm:w-28 sm:h-20 flex-shrink-0">
            <Image
              src={flat.images[0] || '/placeholder-flat.jpg'}
              alt={flat.title}
              fill
              sizes="(max-width: 640px) 80px, 112px"
              className="object-cover"
            />
          </div>

          {/* Minimal content container */}
          <div className="p-2 sm:p-3 flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate pr-2">
                {flat.title}
              </h3>

              <div className="flex items-center mt-0.5 sm:mt-0">
                <div className="bg-blue-100 dark:bg-blue-900 rounded px-1.5 py-0.5 mr-1">
                  <span className="text-xs font-medium text-blue-800 dark:text-blue-200">
                    ₹{flat.monthlyRent.toLocaleString('en-IN')}
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {flat.bhkType} • {flat.furnishingType}
                </span>
              </div>
            </div>

            <div className="flex items-center text-gray-600 dark:text-gray-300 mt-1">
              <FiMapPin className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="text-xs truncate">{flat.locality}, {flat.city}</span>

              <Link
                href={`/flats/${flat._id}`}
                className="ml-auto text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs font-medium"
              >
                Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // More compact grid view
  return (
    <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm overflow-hidden transition-transform duration-300 hover:shadow-md hover:-translate-y-0.5 h-full flex flex-col">
      <div className="relative pt-[50%]">
        <Image
          src={flat.images[0] || '/placeholder-flat.jpg'}
          alt={flat.title}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover absolute inset-0"
        />
        <div className="absolute top-1 right-1 bg-blue-600 text-white px-1.5 py-0.5 rounded text-xs font-medium">
          ₹{flat.monthlyRent.toLocaleString('en-IN')}
        </div>
      </div>

      <div className="p-3 flex-1 flex flex-col">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 truncate">
          {flat.title}
        </h3>

        <div className="flex items-center text-gray-600 dark:text-gray-300 mb-1.5">
          <FiMapPin className="h-3 w-3 mr-1 flex-shrink-0" />
          <span className="text-xs truncate">{flat.locality}, {flat.city}</span>
        </div>

        <div className="grid grid-cols-2 gap-x-2 gap-y-1 mb-2 text-xs">
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <FiUser className="h-3 w-3 mr-1 flex-shrink-0" />
            <span className="truncate">{flat.bhkType}</span>
          </div>

          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <FiHome className="h-3 w-3 mr-1 flex-shrink-0" />
            <span className="truncate">{flat.furnishingType}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-auto pt-1 border-t border-gray-100 dark:border-gray-700">
          <Link
            href={`/flats/${flat._id}`}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs font-medium"
          >
            View Details
          </Link>

          <div className="text-xs text-gray-500 dark:text-gray-400">
            {flat.preferredTenants}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlatCard;
