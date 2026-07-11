'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  FiMapPin,
  FiHome,
  FiDollarSign,
  FiCalendar,
  FiUser,
  FiPhone,
  FiMail,
  FiCheck,
  FiX,
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import { BiBed } from 'react-icons/bi';

const FlatDetailsPage = () => {
  const { id } = useParams();
  const [flat, setFlat] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchFlatDetails = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/flats/${id}`);

        if (data.success) {
          setFlat(data.flat);
        }
      } catch (error) {
        console.error('Error fetching flat details:', error);
        setError('Failed to fetch flat details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFlatDetails();
    }
  }, [id]);

  const nextImage = () => {
    if (flat && flat.images.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === flat.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (flat && flat.images.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? flat.images.length - 1 : prevIndex - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !flat) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex justify-center items-center p-4">
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md p-6 max-w-md w-full text-center">
            <h2 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-2">
              {error || 'Flat not found'}
            </h2>
            <p className="text-red-600 dark:text-red-400 mb-4">
              The flat you're looking for doesn't exist or has been removed.
            </p>
            <Link
              href="/flats"
              className="inline-flex items-center text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <FiArrowLeft className="mr-2" /> Back to flats
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow bg-gray-50 dark:bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link
              href="/flats"
              className="inline-flex items-center text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <FiArrowLeft className="mr-2" /> Back to flats
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden">
            {/* Image Gallery */}
            <div className="relative h-64 sm:h-96">
              {flat.images && flat.images.length > 0 ? (
                <>
                  <Image
                    src={flat.images[currentImageIndex] || '/placeholder-flat.jpg'}
                    alt={flat.title}
                    fill
                    className="object-cover"
                  />

                  {flat.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                      >
                        <FiChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                      >
                        <FiChevronRight className="h-6 w-6" />
                      </button>

                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {flat.images.map((_, index: number) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`h-2 w-2 rounded-full ${currentImageIndex === index ? 'bg-white' : 'bg-gray-400'
                              }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-600">
                  <FiHome className="h-16 w-16 text-gray-400 dark:text-gray-500" />
                </div>
              )}
            </div>

            {/* Flat Details */}
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{flat.title}</h1>
                  <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                    <FiMapPin className="h-4 w-4 mr-1" />
                    <span>{flat.address}, {flat.locality}, {flat.city}, {flat.state} - {flat.pincode}</span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-md">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    ₹{flat.monthlyRent.toLocaleString('en-IN')}<span className="text-sm font-normal">/month</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Deposit: ₹{flat.depositAmount.toLocaleString('en-IN')}
                  </div>
                  {flat.isRentNegotiable && (
                    <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                      Rent is negotiable
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Type</div>
                  <div className="font-medium text-gray-900 dark:text-white flex items-center">
                    <BiBed className="mr-1" /> {flat.bhkType}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Furnishing</div>
                  <div className="font-medium text-gray-900 dark:text-white flex items-center">
                    <FiHome className="mr-1" /> {flat.furnishingType}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Available From</div>
                  <div className="font-medium text-gray-900 dark:text-white flex items-center">
                    <FiCalendar className="mr-1" /> {new Date(flat.availabilityDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Preferred Tenants</div>
                  <div className="font-medium text-gray-900 dark:text-white flex items-center">
                    <FiUser className="mr-1" /> {flat.preferredTenants}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-600 pt-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Description</h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{flat.description}</p>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-600 pt-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Property Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Property Type</h3>
                    <p className="text-gray-900 dark:text-white">{flat.propertyType}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Floor</h3>
                    <p className="text-gray-900 dark:text-white">{flat.floorNumber} out of {flat.totalFloors}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Built-up Area</h3>
                    <p className="text-gray-900 dark:text-white">{flat.builtUpArea} sq.ft.</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Carpet Area</h3>
                    <p className="text-gray-900 dark:text-white">{flat.carpetArea} sq.ft.</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Age of Property</h3>
                    <p className="text-gray-900 dark:text-white">{flat.propertyAge} years</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Facing Direction</h3>
                    <p className="text-gray-900 dark:text-white">{flat.facingDirection}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-600 pt-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                  ].map((amenity) => (
                    <div key={amenity.id} className="flex items-center">
                      {flat[amenity.id] ? (
                        <FiCheck className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <FiX className="h-5 w-5 text-red-500 mr-2" />
                      )}
                      <span className="text-gray-700 dark:text-gray-300">{amenity.label}</span>
                    </div>
                  ))}
                  <div className="flex items-center">
                    {flat.isPetFriendly ? (
                      <FiCheck className="h-5 w-5 text-green-500 mr-2" />
                    ) : (
                      <FiX className="h-5 w-5 text-red-500 mr-2" />
                    )}
                    <span className="text-gray-700 dark:text-gray-300">Pet Friendly</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Water Supply</h3>
                    <p className="text-gray-900 dark:text-white">{flat.waterSupplyType}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-600 pt-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Preferences</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Preferred Tenants</h3>
                    <p className="text-gray-900 dark:text-white">{flat.preferredTenants}</p>
                  </div>
                  {flat.genderPreference && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Gender Preference</h3>
                      <p className="text-gray-900 dark:text-white">{flat.genderPreference}</p>
                    </div>
                  )}
                  <div className="flex items-center">
                    {flat.isSmokingAllowed ? (
                      <FiCheck className="h-5 w-5 text-green-500 mr-2" />
                    ) : (
                      <FiX className="h-5 w-5 text-red-500 mr-2" />
                    )}
                    <span className="text-gray-700 dark:text-gray-300">Smoking Allowed</span>
                  </div>
                  <div className="flex items-center">
                    {flat.isNonVegAllowed ? (
                      <FiCheck className="h-5 w-5 text-green-500 mr-2" />
                    ) : (
                      <FiX className="h-5 w-5 text-red-500 mr-2" />
                    )}
                    <span className="text-gray-700 dark:text-gray-300">Non-Veg Allowed</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h2>
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-md">
                  <div className="flex items-start mb-3">
                    <FiUser className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {flat.createdBy?.name || 'Owner'}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {flat.createdBy?.role || 'Owner'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center mb-3">
                    <FiPhone className="h-5 w-5 text-blue-500 mr-3" />
                    <a
                      href={`tel:${flat.contactNumber}`}
                      className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {flat.contactNumber}
                    </a>
                  </div>
                  {flat.createdBy?.email && (
                    <div className="flex items-center">
                      <FiMail className="h-5 w-5 text-blue-500 mr-3" />
                      <a
                        href={`mailto:${flat.createdBy.email}`}
                        className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        {flat.createdBy.email}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FlatDetailsPage;
