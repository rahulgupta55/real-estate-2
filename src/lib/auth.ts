import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { IUser, UserRole } from '@/models/User';

// For client-side cookie operations
import Cookies from 'js-cookie';

// Define the JWT payload interface
interface JwtPayload {
  userId: string;
  role: UserRole;
  isSubscribed: boolean;
  iat?: number;
  exp?: number;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

// Create JWT token
export const createToken = (user: IUser) => {
  return jwt.sign(
    {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isSubscribed: user.isSubscribed
    },
    JWT_SECRET as jwt.Secret,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Verify JWT token
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET as jwt.Secret) as JwtPayload;
  } catch (error) {
    return null;
  }
};

// Set JWT token in cookie
export const setTokenCookie = (token: string, response: NextResponse) => {
  response.cookies.set({
    name: 'token',
    value: token,
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    sameSite: 'strict',
  });

  return response;
};

// Get JWT token from cookie (server-side)
export const getTokenFromCookie = (req: NextRequest) => {
  return req.cookies.get('token')?.value;
};

// Remove JWT token from cookie (server-side)
export const removeTokenCookie = () => {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: 'token',
    value: '',
    expires: new Date(0),
    path: '/',
  });
  return response;
};

// Client-side cookie functions
export const clientSetToken = (token: string) => {
  Cookies.set('token', token, {
    expires: 30, // 30 days
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
};

export const clientRemoveToken = () => {
  Cookies.remove('token', { path: '/' });
};

// Authentication middleware
export const authMiddleware = async (req: NextRequest) => {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: 'Authentication required' },
      { status: 401 }
    );
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return NextResponse.json(
      { success: false, message: 'Invalid or expired token' },
      { status: 401 }
    );
  }

  return decoded;
};

// Subscription check middleware
export const subscriptionMiddleware = async (req: NextRequest) => {
  const auth = await authMiddleware(req);

  if (auth instanceof NextResponse) {
    return auth;
  }

  if (!auth.isSubscribed) {
    return NextResponse.json(
      { success: false, message: 'Subscription required' },
      { status: 403 }
    );
  }

  return auth;
};

// Role-based access control middleware
export const roleMiddleware = (allowedRoles: string[]) => {
  return async (req: NextRequest) => {
    const auth = await authMiddleware(req);

    if (auth instanceof NextResponse) {
      return auth;
    }

    if (!allowedRoles.includes(auth.role)) {
      return NextResponse.json(
        { success: false, message: 'Access denied' },
        { status: 403 }
      );
    }

    return auth;
  };
};
