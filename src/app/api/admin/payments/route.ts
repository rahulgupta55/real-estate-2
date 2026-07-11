import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Payment, { PaymentStatus } from '@/models/Payment';
import { UserRole } from '@/models/User';
import { roleMiddleware } from '@/lib/auth';

// Get all payments (admin only)
export async function GET(req: NextRequest) {
  try {
    // Check if user is admin
    const adminCheck = await roleMiddleware([UserRole.ADMIN])(req);
    
    if (adminCheck instanceof NextResponse) {
      return adminCheck;
    }
    
    await connectDB();
    
    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const subscriptionType = searchParams.get('subscriptionType');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const search = searchParams.get('search');
    
    // Build query
    const query: any = {};
    
    if (status) query.status = status;
    if (subscriptionType) query.subscriptionType = subscriptionType;
    
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      query.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.createdAt = { $lte: new Date(endDate) };
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Execute query
    const payments = await Payment.find(query)
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // If search is provided, filter payments by user name or email
    let filteredPayments = payments;
    if (search) {
      filteredPayments = payments.filter((payment: any) => {
        const userName = payment.user?.name?.toLowerCase() || '';
        const userEmail = payment.user?.email?.toLowerCase() || '';
        const paymentId = payment.razorpayPaymentId?.toLowerCase() || '';
        const searchTerm = search.toLowerCase();
        
        return userName.includes(searchTerm) || 
               userEmail.includes(searchTerm) || 
               paymentId.includes(searchTerm);
      });
    }
    
    // Get total count
    const totalPayments = await Payment.countDocuments(query);
    
    // Get recent payments
    const recentPayments = await Payment.find()
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Calculate total revenue from completed payments
    const completedPayments = await Payment.find({ status: PaymentStatus.COMPLETED });
    const totalRevenue = completedPayments.reduce((total, payment) => total + payment.amount, 0) / 100; // Convert from paise to rupees
    
    return NextResponse.json({
      success: true,
      payments: filteredPayments,
      totalPayments,
      totalRevenue,
      recentPayments,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalPayments / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
