import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Flat from '@/models/Flat';
import { UserRole } from '@/models/User';
import { roleMiddleware } from '@/lib/auth';

// Get all flats (admin only)
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
    const city = searchParams.get('city');
    const locality = searchParams.get('locality');
    const bhkType = searchParams.get('bhkType');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');
    const isActive = searchParams.get('isActive');
    
    // Build query
    const query: any = {};
    
    if (city) query.city = { $regex: city, $options: 'i' };
    if (locality) query.locality = { $regex: locality, $options: 'i' };
    if (bhkType) query.bhkType = bhkType;
    if (minPrice) query.monthlyRent = { ...query.monthlyRent, $gte: parseInt(minPrice) };
    if (maxPrice) query.monthlyRent = { ...query.monthlyRent, $lte: parseInt(maxPrice) };
    if (isActive === 'true') query.isActive = true;
    if (isActive === 'false') query.isActive = false;
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { locality: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Execute query
    const flats = await Flat.find(query)
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count
    const totalFlats = await Flat.countDocuments(query);
    
    // Get recent flats
    const recentFlats = await Flat.find()
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 })
      .limit(5);
    
    return NextResponse.json({
      success: true,
      flats,
      totalFlats,
      recentFlats,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalFlats / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching flats:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
