import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Payment, { PaymentStatus } from '@/models/Payment';
import User from '@/models/User';
import { UserRole } from '@/models/User';
import { roleMiddleware } from '@/lib/auth';
import { calculateSubscriptionEndDate } from '@/lib/razorpay';

// Get a single payment by ID (admin only)
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is admin
    const adminCheck = await roleMiddleware([UserRole.ADMIN])(req);
    
    if (adminCheck instanceof NextResponse) {
      return adminCheck;
    }
    
    await connectDB();
    
    const payment = await Payment.findById(params.id)
      .populate('user', 'name email role phone');
    
    if (!payment) {
      return NextResponse.json(
        { success: false, message: 'Payment not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, payment });
  } catch (error) {
    console.error('Error fetching payment:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    );
  }
}

// Update a payment status (admin only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is admin
    const adminCheck = await roleMiddleware([UserRole.ADMIN])(req);
    
    if (adminCheck instanceof NextResponse) {
      return adminCheck;
    }
    
    await connectDB();
    
    // Find payment
    const payment = await Payment.findById(params.id);
    
    if (!payment) {
      return NextResponse.json(
        { success: false, message: 'Payment not found' },
        { status: 404 }
      );
    }
    
    // Update payment status
    const { status } = await req.json();
    
    if (!Object.values(PaymentStatus).includes(status as PaymentStatus)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status value' },
        { status: 400 }
      );
    }
    
    payment.status = status as PaymentStatus;
    await payment.save();
    
    // If payment is completed, update user subscription
    if (status === PaymentStatus.COMPLETED) {
      const user = await User.findById(payment.user);
      
      if (user) {
        const subscriptionStartDate = new Date();
        const subscriptionEndDate = calculateSubscriptionEndDate(subscriptionStartDate);
        
        user.isSubscribed = true;
        user.subscriptionExpiryDate = subscriptionEndDate;
        await user.save();
        
        // Update payment subscription dates
        payment.subscriptionStartDate = subscriptionStartDate;
        payment.subscriptionEndDate = subscriptionEndDate;
        await payment.save();
      }
    }
    
    return NextResponse.json({
      success: true,
      payment,
      message: `Payment status updated to ${status} successfully`,
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    );
  }
}

// Delete a payment (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is admin
    const adminCheck = await roleMiddleware([UserRole.ADMIN])(req);
    
    if (adminCheck instanceof NextResponse) {
      return adminCheck;
    }
    
    await connectDB();
    
    // Find payment
    const payment = await Payment.findById(params.id);
    
    if (!payment) {
      return NextResponse.json(
        { success: false, message: 'Payment not found' },
        { status: 404 }
      );
    }
    
    // Delete payment
    await Payment.findByIdAndDelete(params.id);
    
    return NextResponse.json({
      success: true,
      message: 'Payment deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting payment:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
