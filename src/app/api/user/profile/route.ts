import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { authMiddleware } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = await authMiddleware(req);
    
    if (auth instanceof NextResponse) {
      return auth;
    }
    
    await connectDB();
    
    const user = await User.findById(auth.userId);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        isSubscribed: user.isSubscribed,
        subscriptionExpiryDate: user.subscriptionExpiryDate,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = await authMiddleware(req);
    
    if (auth instanceof NextResponse) {
      return auth;
    }
    
    await connectDB();
    
    const { name, phone, profilePicture } = await req.json();
    
    const user = await User.findById(auth.userId);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Update user
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (profilePicture) user.profilePicture = profilePicture;
    
    await user.save();
    
    return NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        isSubscribed: user.isSubscribed,
        subscriptionExpiryDate: user.subscriptionExpiryDate,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
