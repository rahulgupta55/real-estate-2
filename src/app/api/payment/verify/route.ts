import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Payment, { PaymentStatus } from '@/models/Payment';
import { authMiddleware } from '@/lib/auth';
import { verifyPayment, calculateSubscriptionEndDate } from '@/lib/razorpay';

export async function POST(req: NextRequest) {
  try {
    const auth = await authMiddleware(req);

    if (auth instanceof NextResponse) {
      return auth;
    }

    await connectDB();

    const {
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      subscriptionType,
      amount,
    } = await req.json();

    // Validate input
    if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature || !subscriptionType || !amount) {
      return NextResponse.json(
        { success: false, message: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    // Verify payment
    const isValid = verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Calculate subscription dates
    const subscriptionStartDate = new Date();
    const subscriptionEndDate = calculateSubscriptionEndDate(subscriptionStartDate);

    // Create payment record
    const payment = await Payment.create({
      user: auth.userId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      amount,
      status: PaymentStatus.COMPLETED,
      subscriptionType,
      subscriptionStartDate,
      subscriptionEndDate,
    });

    // Update user subscription status
    const user = await User.findByIdAndUpdate(
      auth.userId,
      {
        isSubscribed: true,
        subscriptionExpiryDate: subscriptionEndDate,
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      payment,
      user: {
        _id: user?._id,
        name: user?.name,
        email: user?.email,
        role: user?.role,
        isSubscribed: user?.isSubscribed,
        subscriptionExpiryDate: user?.subscriptionExpiryDate,
      },
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
