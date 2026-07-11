import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User, { UserRole } from '@/models/User';
import { authMiddleware, roleMiddleware } from '@/lib/auth';

// Get all users (admin only)
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
    const role = searchParams.get('role');
    const search = searchParams.get('search');
    
    // Build query
    const query: any = {};
    
    if (role) {
      query.role = role;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Execute query
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count
    const totalUsers = await User.countDocuments(query);
    
    // Get active subscriptions count
    const activeSubscriptions = await User.countDocuments({ isSubscribed: true });
    
    // Get recent users
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);
    
    return NextResponse.json({
      success: true,
      users,
      totalUsers,
      activeSubscriptions,
      recentUsers,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalUsers / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    );
  }
}

// Create a new user (admin only)
export async function POST(req: NextRequest) {
  try {
    // Check if user is admin
    const adminCheck = await roleMiddleware([UserRole.ADMIN])(req);
    
    if (adminCheck instanceof NextResponse) {
      return adminCheck;
    }
    
    await connectDB();
    
    const userData = await req.json();
    
    // Validate input
    if (!userData.name || !userData.email || !userData.password || !userData.role) {
      return NextResponse.json(
        { success: false, message: 'Please provide all required fields' },
        { status: 400 }
      );
    }
    
    // Check if email already exists
    const existingUser = await User.findOne({ email: userData.email });
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already exists' },
        { status: 400 }
      );
    }
    
    // Create user
    const user = await User.create(userData);
    
    return NextResponse.json(
      {
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          isSubscribed: user.isSubscribed,
          subscriptionExpiryDate: user.subscriptionExpiryDate,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
