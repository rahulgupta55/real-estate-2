'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiCheck, FiX } from 'react-icons/fi';
import { UserRole } from '@/models/User';

const PricingPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<UserRole | null>(null);

  const handleSelectPlan = (plan: UserRole) => {
    setSelectedPlan(plan);
    
    if (!user) {
      // If user is not logged in, redirect to register page with selected role
      router.push(`/register?role=${plan}`);
      return;
    }
    
    // If user is logged in, redirect to payment page with selected plan
    router.push(`/payment?plan=${plan}`);
  };

  const plans = [
    {
      title: 'Broker',
      price: '₹1,000',
      role: UserRole.BROKER,
      description: 'Perfect for real estate brokers managing multiple properties',
      features: [
        'List unlimited flats',
        'Advanced search visibility',
        'Priority listing placement',
        'Detailed analytics dashboard',
        'Client management tools',
        'Email notifications for inquiries',
        'Verified broker badge',
        'Premium customer support',
      ],
    },
    {
      title: 'Owner',
      price: '₹800',
      role: UserRole.OWNER,
      description: 'Ideal for property owners looking to rent their flats',
      features: [
        'List up to 5 flats',
        'Enhanced search visibility',
        'Verified owner badge',
        'Tenant screening tools',
        'Document management',
        'Email notifications for inquiries',
        'Standard customer support',
      ],
    },
    {
      title: 'Tenant',
      price: '₹500',
      role: UserRole.TENANT,
      description: 'For tenants with extra space looking to sublet',
      features: [
        'List up to 2 flats',
        'Standard search visibility',
        'Verified tenant badge',
        'Basic analytics',
        'Email notifications for inquiries',
        'Basic customer support',
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow bg-gray-50 dark:bg-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight">
              Simple, transparent pricing
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500 dark:text-gray-300">
              Choose the plan that best suits your needs. All plans include a 30-day subscription.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.role}
                className={`bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 ${
                  selectedPlan === plan.role ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{plan.title}</h2>
                  <p className="mt-4 flex items-baseline">
                    <span className="text-4xl font-extrabold text-gray-900 dark:text-white">{plan.price}</span>
                    <span className="ml-1 text-xl font-medium text-gray-500 dark:text-gray-300">/month</span>
                  </p>
                  <p className="mt-4 text-gray-500 dark:text-gray-300">{plan.description}</p>

                  <button
                    onClick={() => handleSelectPlan(plan.role)}
                    className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {user ? 'Subscribe Now' : 'Get Started'}
                  </button>
                </div>

                <div className="px-6 pt-4 pb-8">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wide mb-4">
                    What's included
                  </h3>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <FiCheck className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                        <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-white dark:bg-gray-700 rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  How does the subscription work?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our subscriptions are billed monthly. You'll be charged the subscription amount at the beginning of each billing cycle.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Can I cancel my subscription?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes, you can cancel your subscription at any time. Your subscription will remain active until the end of the current billing period.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We accept all major credit and debit cards through our secure payment processor, Razorpay.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  What happens if I don't renew my subscription?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  If you don't renew your subscription, your listings will become inactive and you'll lose access to premium features.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PricingPage;
