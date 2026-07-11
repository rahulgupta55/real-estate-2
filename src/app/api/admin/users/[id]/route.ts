import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User, { UserRole } from '@/models/User';
import { roleMiddleware } from '@/lib/auth';

// Get a single user by ID (admin only)
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
    
    const user = await User.findById(params.id).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    );
  }
}

// Update a user (admin only)
export async function PUT(
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
    
    const userData = await req.json();
    
    // Find user
    const user = await User.findById(params.id);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Update user
    // If password is provided, it will be hashed by the pre-save hook in the User model
    const updatedUser = await User.findByIdAndUpdate(
      params.id,
      userData,
      { new: true, runValidators: true }
    ).select('-password');
    
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    );
  }
}

// Delete a user (admin only)
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
    
    // Find user
    const user = await User.findById(params.id);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Delete user
    await User.findByIdAndDelete(params.id);
    
    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
