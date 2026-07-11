'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { BHKType, PropertyType, FurnishingType, FacingDirection, WaterSupplyType, PreferredTenants, GenderPreference } from '@/models/Flat';
import DashboardLayout from '@/components/DashboardLayout';
import ImageUploader from '@/components/ImageUploader';
import { format } from 'date-fns';

const EditFlatPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    monthlyRent: '',
    depositAmount: '',
    availabilityDate: '',
    isRentNegotiable: false,
    contactNumber: '',

    // Location
    address: '',
    city: '',
    locality: '',
    state: '',
    pincode: '',
    landmarks: '',
    googleMapsLink: '',

    // Property Details
    bhkType: BHKType.ONE_BHK,
    propertyType: PropertyType.FLAT,
    floorNumber: '',
    totalFloors: '',
    builtUpArea: '',
    carpetArea: '',
    propertyAge: '',
    facingDirection: FacingDirection.EAST,

    // Amenities
    furnishingType: FurnishingType.SEMI_FURNISHED,
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
    waterSupplyType: WaterSupplyType.MUNICIPAL,
    isPetFriendly: false,

    // Preferences
    preferredTenants: PreferredTenants.ANYONE,
    genderPreference: GenderPreference.ANY,
    isSmokingAllowed: false,
    isNonVegAllowed: false,

    // Media
    images: [''],
    videoLink: '',
  });

  useEffect(() => {
    if (!user) {
      return;
    }

    if (!user.isSubscribed) {
      setIsFetching(false);
      return;
    }

    fetchFlatDetails();
  }, [user, id]);

  const fetchFlatDetails = async () => {
    try {
      setIsFetching(true);
      const { data } = await axios.get(`/api/flats/${id}`);

      if (data.success) {
        const flat = data.flat;

        // Check if the user is the owner of the flat
        if (flat.createdBy._id !== user?._id) {
          setUnauthorized(true);
          setIsFetching(false);
          return;
        }

        // Format date for input field (YYYY-MM-DD)
        const availabilityDate = flat.availabilityDate ?
          format(new Date(flat.availabilityDate), 'yyyy-MM-dd') : '';

        setFormData({
          title: flat.title || '',
          description: flat.description || '',
          monthlyRent: flat.monthlyRent || '',
          depositAmount: flat.depositAmount || '',
          availabilityDate,
          isRentNegotiable: flat.isRentNegotiable || false,
          contactNumber: flat.contactNumber || user?.phone || '',

          // Location
          address: flat.address || '',
          city: flat.city || '',
          locality: flat.locality || '',
          state: flat.state || '',
          pincode: flat.pincode || '',
          landmarks: flat.landmarks || '',
          googleMapsLink: flat.googleMapsLink || '',

          // Property Details
          bhkType: flat.bhkType || BHKType.ONE_BHK,
          propertyType: flat.propertyType || PropertyType.FLAT,
          floorNumber: flat.floorNumber || '',
          totalFloors: flat.totalFloors || '',
          builtUpArea: flat.builtUpArea || '',
          carpetArea: flat.carpetArea || '',
          propertyAge: flat.propertyAge || '',
          facingDirection: flat.facingDirection || FacingDirection.EAST,

          // Amenities
          furnishingType: flat.furnishingType || FurnishingType.SEMI_FURNISHED,
          hasAC: flat.hasAC || false,
          hasWifi: flat.hasWifi || false,
          hasWashingMachine: flat.hasWashingMachine || false,
          hasRefrigerator: flat.hasRefrigerator || false,
          hasPowerBackup: flat.hasPowerBackup || false,
          hasGatedSecurity: flat.hasGatedSecurity || false,
          hasCCTV: flat.hasCCTV || false,
          hasElevator: flat.hasElevator || false,
          hasParking: flat.hasParking || false,
          hasBalcony: flat.hasBalcony || false,
          waterSupplyType: flat.waterSupplyType || WaterSupplyType.MUNICIPAL,
          isPetFriendly: flat.isPetFriendly || false,

          // Preferences
          preferredTenants: flat.preferredTenants || PreferredTenants.ANYONE,
          genderPreference: flat.genderPreference || GenderPreference.ANY,
          isSmokingAllowed: flat.isSmokingAllowed || false,
          isNonVegAllowed: flat.isNonVegAllowed || false,

          // Media
          images: flat.images || [''],
          videoLink: flat.videoLink || '',
        });
      }
    } catch (error) {
      console.error('Error fetching flat details:', error);
      setNotFound(true);
      setError('Failed to fetch flat details');
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'monthlyRent' || name === 'depositAmount' || name === 'floorNumber' ||
      name === 'totalFloors' || name === 'builtUpArea' || name === 'carpetArea' ||
      name === 'propertyAge') {
      // Handle numeric inputs
      const numValue = value === '' ? '' : Number(value);
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate required fields
      const requiredFields = [
        'title', 'description', 'monthlyRent', 'depositAmount', 'availabilityDate',
        'contactNumber', 'address', 'city', 'locality', 'state', 'pincode',
        'floorNumber', 'totalFloors', 'builtUpArea', 'carpetArea', 'propertyAge'
      ];

      const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);

      if (missingFields.length > 0) {
        setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
        setIsLoading(false);
        return;
      }

      // Submit the form
      const response = await axios.put(`/api/flats/${id}`, formData);

      if (response.data.success) {
        setSuccess('Flat updated successfully!');
        // Redirect to the flat details page
        setTimeout(() => {
          router.push(`/flats/${id}`);
        }, 2000);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update flat. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  if (!user.isSubscribed) {
    return (
      <DashboardLayout>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Subscription Required</h1>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            You need an active subscription to edit flats on our platform.
          </p>
          <button
            onClick={() => router.push('/pricing')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            View Subscription Plans
          </button>
        </div>
      </DashboardLayout>
    );
  }

  if (notFound) {
    return (
      <DashboardLayout>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Flat Not Found</h1>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            The flat you are trying to edit does not exist or has been removed.
          </p>
          <button
            onClick={() => router.push('/dashboard/flats')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to My Flats
          </button>
        </div>
      </DashboardLayout>
    );
  }

  if (unauthorized) {
    return (
      <DashboardLayout>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Unauthorized</h1>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            You are not authorized to edit this flat. You can only edit flats that you have created.
          </p>
          <button
            onClick={() => router.push('/dashboard/flats')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to My Flats
          </button>
        </div>
      </DashboardLayout>
    );
  }

  if (isFetching) {
    return (
      <DashboardLayout>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Flat</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Title*</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Description*</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Monthly Rent (₹)*</label>
                <input
                  type="number"
                  name="monthlyRent"
                  value={formData.monthlyRent}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Deposit Amount (₹)*</label>
                <input
                  type="number"
                  name="depositAmount"
                  value={formData.depositAmount}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Availability Date*</label>
                <input
                  type="date"
                  name="availabilityDate"
                  value={formData.availabilityDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isRentNegotiable"
                  checked={formData.isRentNegotiable}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-gray-700 dark:text-gray-300">Rent is negotiable</label>
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Address*</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">City*</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Locality*</label>
                <input
                  type="text"
                  name="locality"
                  value={formData.locality}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">State*</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Pincode*</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Landmarks</label>
                <input
                  type="text"
                  name="landmarks"
                  value={formData.landmarks}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Google Maps Link</label>
                <input
                  type="text"
                  name="googleMapsLink"
                  value={formData.googleMapsLink}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Property Details Section */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Property Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">BHK Type*</label>
                <select
                  name="bhkType"
                  value={formData.bhkType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  required
                >
                  {Object.values(BHKType).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Property Type*</label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  required
                >
                  {Object.values(PropertyType).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Floor Number*</label>
                <input
                  type="number"
                  name="floorNumber"
                  value={formData.floorNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Total Floors*</label>
                <input
                  type="number"
                  name="totalFloors"
                  value={formData.totalFloors}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Built-up Area (sq ft)*</label>
                <input
                  type="number"
                  name="builtUpArea"
                  value={formData.builtUpArea}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Carpet Area (sq ft)*</label>
                <input
                  type="number"
                  name="carpetArea"
                  value={formData.carpetArea}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Property Age (years)*</label>
                <input
                  type="number"
                  name="propertyAge"
                  value={formData.propertyAge}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Facing Direction</label>
                <select
                  name="facingDirection"
                  value={formData.facingDirection}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                >
                  {Object.values(FacingDirection).map(direction => (
                    <option key={direction} value={direction}>{direction}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Amenities Section */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Amenities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Furnishing Type</label>
                <select
                  name="furnishingType"
                  value={formData.furnishingType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                >
                  {Object.values(FurnishingType).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Water Supply Type</label>
                <select
                  name="waterSupplyType"
                  value={formData.waterSupplyType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                >
                  {Object.values(WaterSupplyType).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="hasAC"
                  checked={formData.hasAC}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-gray-700 dark:text-gray-300">Air Conditioning</label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="hasWifi"
                  checked={formData.hasWifi}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-gray-700 dark:text-gray-300">WiFi</label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="hasWashingMachine"
                  checked={formData.hasWashingMachine}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-gray-700 dark:text-gray-300">Washing Machine</label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="hasRefrigerator"
                  checked={formData.hasRefrigerator}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-gray-700 dark:text-gray-300">Refrigerator</label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="hasPowerBackup"
                  checked={formData.hasPowerBackup}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-gray-700 dark:text-gray-300">Power Backup</label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="hasGatedSecurity"
                  checked={formData.hasGatedSecurity}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-gray-700 dark:text-gray-300">Gated Security</label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="hasCCTV"
                  checked={formData.hasCCTV}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-gray-700 dark:text-gray-300">CCTV</label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="hasElevator"
                  checked={formData.hasElevator}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-gray-700 dark:text-gray-300">Elevator</label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="hasParking"
                  checked={formData.hasParking}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-gray-700 dark:text-gray-300">Parking</label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="hasBalcony"
                  checked={formData.hasBalcony}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-gray-700 dark:text-gray-300">Balcony</label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isPetFriendly"
                  checked={formData.isPetFriendly}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-gray-700 dark:text-gray-300">Pet Friendly</label>
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Preferred Tenants</label>
                <select
                  name="preferredTenants"
                  value={formData.preferredTenants}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                >
                  {Object.values(PreferredTenants).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Gender Preference</label>
                <select
                  name="genderPreference"
                  value={formData.genderPreference}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                >
                  {Object.values(GenderPreference).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isSmokingAllowed"
                  checked={formData.isSmokingAllowed}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-gray-700 dark:text-gray-300">Smoking Allowed</label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isNonVegAllowed"
                  checked={formData.isNonVegAllowed}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-gray-700 dark:text-gray-300">Non-Veg Allowed</label>
              </div>
            </div>
          </div>

          {/* Media Section */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Media</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Images*</label>
                <ImageUploader
                  images={formData.images}
                  onChange={(images) => setFormData(prev => ({ ...prev, images }))}
                  maxImages={5}
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Video Link (YouTube or other)</label>
                <input
                  type="text"
                  name="videoLink"
                  value={formData.videoLink}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {isLoading ? 'Updating...' : 'Update Flat'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditFlatPage;
