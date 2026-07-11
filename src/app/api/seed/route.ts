import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User, { UserRole } from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    await connectDB();
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@mail.com' });
    
    if (existingAdmin) {
      return NextResponse.json({
        success: true,
        message: 'Admin user already exists',
      });
    }
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin@123', 10);
    
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@mail.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
      isSubscribed: true,
      subscriptionExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    });
    
    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Error seeding admin user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to seed admin user' },
      { status: 500 }
    );
  }
}
