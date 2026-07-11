import Razorpay from 'razorpay';
import crypto from 'crypto';
import { UserRole } from '@/models/User';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

// Get subscription price based on user role
export const getSubscriptionPrice = (role: UserRole): number => {
  switch (role) {
    case UserRole.BROKER:
      return 1000 * 100; // ₹1000 in paise
    case UserRole.OWNER:
      return 800 * 100; // ₹800 in paise
    case UserRole.TENANT:
      return 500 * 100; // ₹500 in paise
    default:
      return 0;
  }
};

// Create Razorpay order
export const createOrder = async (
  amount: number,
  currency: string = 'INR',
  receipt: string,
  notes: Record<string, string> = {}
) => {
  try {
    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt,
      notes,
    });
    
    return { success: true, order };
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return { success: false, error };
  }
};

// Verify Razorpay payment
export const verifyPayment = (
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
) => {
  try {
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');
    
    return generatedSignature === razorpaySignature;
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    return false;
  }
};

// Calculate subscription end date (30 days from start date)
export const calculateSubscriptionEndDate = (startDate: Date = new Date()): Date => {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 30);
  return endDate;
};
