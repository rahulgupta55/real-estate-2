'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiDownload, FiFilter } from 'react-icons/fi';
import { PaymentStatus } from '@/models/Payment';
import { UserRole } from '@/models/User';

const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      
      // In a real application, you would have an API endpoint for this
      // For now, we'll simulate with dummy data
      // const { data } = await axios.get('/api/admin/payments');
      
      // if (data.success) {
      //   setPayments(data.payments);
      //   setTotalRevenue(data.totalRevenue);
      // }
      
      // Dummy data for development
      const dummyPayments = [
        { 
          _id: '1', 
          user: { _id: '1', name: 'John Doe', email: 'john@example.com', role: 'broker' },
          razorpayPaymentId: 'pay_123456789',
          razorpayOrderId: 'order_123456789',
          amount: 1000 * 100, // in paise
          currency: 'INR',
          status: PaymentStatus.COMPLETED,
          subscriptionType: UserRole.BROKER,
          subscriptionStartDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
          subscriptionEndDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() // 15 days ago
        },
        { 
          _id: '2', 
          user: { _id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'owner' },
          razorpayPaymentId: 'pay_987654321',
          razorpayOrderId: 'order_987654321',
          amount: 800 * 100, // in paise
          currency: 'INR',
          status: PaymentStatus.COMPLETED,
          subscriptionType: UserRole.OWNER,
          subscriptionStartDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
          subscriptionEndDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days from now
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days ago
        },
        { 
          _id: '3', 
          user: { _id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'tenant' },
          razorpayPaymentId: 'pay_123123123',
          razorpayOrderId: 'order_123123123',
          amount: 500 * 100, // in paise
          currency: 'INR',
          status: PaymentStatus.PENDING,
          subscriptionType: UserRole.TENANT,
          subscriptionStartDate: new Date().toISOString(),
          subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          createdAt: new Date().toISOString()
        },
        { 
          _id: '4', 
          user: { _id: '1', name: 'John Doe', email: 'john@example.com', role: 'broker' },
          razorpayPaymentId: 'pay_456456456',
          razorpayOrderId: 'order_456456456',
          amount: 1000 * 100, // in paise
          currency: 'INR',
          status: PaymentStatus.FAILED,
          subscriptionType: UserRole.BROKER,
          subscriptionStartDate: null,
          subscriptionEndDate: null,
          createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() // 20 days ago
        },
        { 
          _id: '5', 
          user: { _id: '4', name: 'Alice Brown', email: 'alice@example.com', role: 'broker' },
          razorpayPaymentId: 'pay_789789789',
          razorpayOrderId: 'order_789789789',
          amount: 1000 * 100, // in paise
          currency: 'INR',
          status: PaymentStatus.COMPLETED,
          subscriptionType: UserRole.BROKER,
          subscriptionStartDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
          subscriptionEndDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days from now
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
        },
        { 
          _id: '6', 
          user: { _id: '5', name: 'Charlie Wilson', email: 'charlie@example.com', role: 'owner' },
          razorpayPaymentId: 'pay_321321321',
          razorpayOrderId: 'order_321321321',
          amount: 800 * 100, // in paise
          currency: 'INR',
          status: PaymentStatus.COMPLETED,
          subscriptionType: UserRole.OWNER,
          subscriptionStartDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          subscriptionEndDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(), // 28 days from now
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
        }
      ];
      
      setPayments(dummyPayments);
      
      // Calculate total revenue from completed payments
      const revenue = dummyPayments
        .filter((payment: any) => payment.status === PaymentStatus.COMPLETED)
        .reduce((total: number, payment: any) => total + payment.amount, 0) / 100; // Convert from paise to rupees
      
      setTotalRevenue(revenue);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setError('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    // In a real application, you would implement CSV export functionality
    alert('CSV export functionality would be implemented here');
  };

  const filteredPayments = payments.filter((payment: any) => {
    const matchesSearch = 
      payment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      payment.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.razorpayPaymentId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus ? payment.status === selectedStatus : true;
    const matchesRole = selectedRole ? payment.subscriptionType === selectedRole : true;
    
    let matchesDate = true;
    if (dateRange.startDate && dateRange.endDate) {
      const paymentDate = new Date(payment.createdAt);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      endDate.setHours(23, 59, 59, 999); // Set to end of day
      
      matchesDate = paymentDate >= startDate && paymentDate <= endDate;
    }
    
    return matchesSearch && matchesStatus && matchesRole && matchesDate;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payments</h1>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiDownload className="mr-2 -ml-1 h-5 w-5" />
          Export CSV
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md p-4 mb-6 text-red-600 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Total Revenue</h2>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">₹{totalRevenue.toLocaleString('en-IN')}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Completed Payments</h2>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {payments.filter((payment: any) => payment.status === PaymentStatus.COMPLETED).length}
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Pending Payments</h2>
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
            {payments.filter((payment: any) => payment.status === PaymentStatus.PENDING).length}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder="Search by name, email, or payment ID..."
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                <option value="">All Statuses</option>
                <option value={PaymentStatus.COMPLETED}>Completed</option>
                <option value={PaymentStatus.PENDING}>Pending</option>
                <option value={PaymentStatus.FAILED}>Failed</option>
              </select>
            </div>
            
            <div>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                <option value="">All Subscription Types</option>
                <option value={UserRole.BROKER}>Broker</option>
                <option value={UserRole.OWNER}>Owner</option>
                <option value={UserRole.TENANT}>Tenant</option>
              </select>
            </div>
            
            <div>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="Start Date"
              />
            </div>
            
            <div>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="End Date"
              />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No payments found</h3>
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
                    Payment ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Subscription
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                {filteredPayments.map((payment: any) => (
                  <tr key={payment._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{payment.razorpayPaymentId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{payment.user.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{payment.user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        ₹{(payment.amount / 100).toLocaleString('en-IN')}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{payment.currency}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{payment.subscriptionType}</div>
                      {payment.subscriptionStartDate && payment.subscriptionEndDate && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(payment.subscriptionStartDate).toLocaleDateString()} - {new Date(payment.subscriptionEndDate).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        payment.status === PaymentStatus.COMPLETED
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : payment.status === PaymentStatus.PENDING
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(payment.createdAt).toLocaleTimeString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPaymentsPage;
