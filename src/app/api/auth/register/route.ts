import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User, { UserRole } from '@/models/User';
import { createToken, setTokenCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const { name, email, password, role, phone } = await req.json();
    
    // Validate input
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { success: false, message: 'Please provide all required fields' },
        { status: 400 }
      );
    }
    
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already exists' },
        { status: 400 }
      );
    }
    
    // Validate role
    if (!Object.values(UserRole).includes(role as UserRole)) {
      return NextResponse.json(
        { success: false, message: 'Invalid role' },
        { status: 400 }
      );
    }
    
    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,
      isSubscribed: false,
    });
    
    // Create token
    const token = createToken(user);
    
    const response = NextResponse.json(
      {
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          isSubscribed: user.isSubscribed,
        },
      },
      { status: 201 }
    );
    setTokenCookie(token, response);

    return response;
    
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
