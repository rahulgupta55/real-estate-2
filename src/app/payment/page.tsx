'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { UserRole } from '@/models/User';
import axios from 'axios';

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Client component using useSearchParams
function PaymentContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [plan, setPlan] = useState<UserRole | null>(null);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    // Get plan from URL
    const planParam = searchParams.get('plan');
    if (planParam && Object.values(UserRole).includes(planParam as UserRole)) {
      setPlan(planParam as UserRole);

      // Set amount based on plan
      switch (planParam) {
        case UserRole.BROKER:
          setAmount(1000);
          break;
        case UserRole.OWNER:
          setAmount(800);
          break;
        case UserRole.TENANT:
          setAmount(500);
          break;
        default:
          setAmount(0);
      }
    } else {
      // If no valid plan is provided, redirect to pricing page
      router.push('/pricing');
    }

    // Check if user is logged in
    if (!user) {
      router.push('/login');
    }

    return () => {
      // Clean up script
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, [searchParams, router, user]);

  const handlePayment = async () => {
    if (!plan || !user) return;

    try {
      setLoading(true);
      setError('');

      // Create order
      const { data } = await axios.post('/api/payment/create-order', {
        subscriptionType: plan,
      });

      if (!data.success) {
        throw new Error(data.message || 'Failed to create order');
      }

      // Initialize Razorpay
      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'MyFlat',
        description: `${plan} Subscription`,
        order_id: data.order.id,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyData = await axios.post('/api/payment/verify', {
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              subscriptionType: plan,
              amount: data.order.amount,
            });

            if (verifyData.data.success) {
              setSuccess(true);
              setTimeout(() => {
                router.push('/dashboard');
              }, 3000);
            } else {
              setError('Payment verification failed');
            }
          } catch (error: any) {
            setError(error.response?.data?.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || '',
        },
        theme: {
          color: '#2563EB',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      setError(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!plan || !user) {
    return (
      <div className="flex-grow flex items-center justify-center bg-gray-50 dark:bg-gray-800">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-gray-50 dark:bg-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden">
        {success ? (
          <div className="p-8 text-center">
            <FiCheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Successful!</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Your subscription has been activated. You will be redirected to your dashboard shortly.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Complete Your Subscription</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                You're subscribing to the {plan} plan for ₹{amount}/month.
              </p>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md p-4 text-red-600 dark:text-red-300 flex items-start mb-6">
                  <FiAlertCircle className="h-5 w-5 mr-3 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Subscription Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Plan:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{plan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Amount:</span>
                    <span className="font-medium text-gray-900 dark:text-white">₹{amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Duration:</span>
                    <span className="font-medium text-gray-900 dark:text-white">30 days</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Pay Now'}
              </button>

              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                By clicking "Pay Now", you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 px-8 py-4 border-t border-gray-200 dark:border-gray-600">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Secured by Razorpay. We do not store your payment information.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Main component with Suspense
const PaymentPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Suspense fallback={<div className="flex-grow flex justify-center items-center">Loading payment details...</div>}>
        <PaymentContent />
      </Suspense>
      <Footer />
    </div>
  );
};

export default PaymentPage;
