'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { FiCheck, FiCreditCard, FiCalendar, FiAlertCircle } from 'react-icons/fi';
import { UserRole } from '@/models/User';

const SubscriptionPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [payments, setPayments] = useState([]);
  
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get('/api/payment/history');
        if (response.data.success) {
          setPayments(response.data.payments);
        }
      } catch (error) {
        console.error('Error fetching payment history:', error);
      }
    };
    
    fetchPayments();
  }, []);
  
  const handleSubscribe = (plan: UserRole) => {
    router.push(`/payment?plan=${plan.toLowerCase()}`);
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const subscriptionPlans = [
    {
      role: UserRole.BROKER,
      title: 'Broker Plan',
      price: '₹1,000',
      features: [
        'List unlimited properties',
        'Featured listings',
        'Priority customer support',
        'Access to premium leads',
        'Detailed analytics',
      ],
    },
    {
      role: UserRole.OWNER,
      title: 'Owner Plan',
      price: '₹800',
      features: [
        'List up to 5 properties',
        'Direct tenant communication',
        'Rental agreement templates',
        'Tenant verification',
        'Basic analytics',
      ],
    },
    {
      role: UserRole.TENANT,
      title: 'Tenant Plan',
      price: '₹500',
      features: [
        'Early access to new listings',
        'Saved searches and alerts',
        'Direct owner communication',
        'Rental history tracking',
        'Move-in assistance',
      ],
    },
  ];
  
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Current Subscription Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Subscription Status</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className={`p-3 rounded-full ${
                user?.isSubscribed 
                  ? 'bg-green-100 dark:bg-green-900' 
                  : 'bg-red-100 dark:bg-red-900'
              }`}>
                {user?.isSubscribed ? (
                  <FiCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                ) : (
                  <FiAlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                )}
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  {user?.isSubscribed ? 'Active Subscription' : 'No Active Subscription'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {user?.isSubscribed 
                    ? `Your ${user.role} subscription is active.` 
                    : 'Subscribe to access premium features.'}
                </p>
              </div>
            </div>
            
            {user?.isSubscribed && user?.subscriptionExpiryDate && (
              <div className="flex items-center">
                <FiCalendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  Expires on: {formatDate(user.subscriptionExpiryDate.toString())}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Subscription Plans */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Subscription Plans</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subscriptionPlans.map((plan) => (
              <div 
                key={plan.role}
                className={`border rounded-lg overflow-hidden ${
                  user?.role === plan.role && user?.isSubscribed
                    ? 'border-blue-500 dark:border-blue-400'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className={`p-6 ${
                  user?.role === plan.role && user?.isSubscribed
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : 'bg-white dark:bg-gray-800'
                }`}>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{plan.title}</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{plan.price}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">per month</p>
                </div>
                
                <div className="p-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <FiCheck className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    onClick={() => handleSubscribe(plan.role)}
                    disabled={isLoading || (user?.role === plan.role && user?.isSubscribed)}
                    className={`w-full mt-6 py-2 px-4 rounded-md flex items-center justify-center ${
                      user?.role === plan.role && user?.isSubscribed
                        ? 'bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <FiCreditCard className="mr-2" />
                    {user?.role === plan.role && user?.isSubscribed
                      ? 'Current Plan'
                      : 'Subscribe Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Payment History */}
        {payments.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Payment History</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {payments.map((payment: any) => (
                    <tr key={payment._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {formatDate(payment.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        ₹{(payment.amount / 100).toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 capitalize">
                        {payment.subscriptionType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          payment.status === 'completed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : payment.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionPage;
