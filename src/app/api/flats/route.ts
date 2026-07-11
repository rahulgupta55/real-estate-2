import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Flat from '@/models/Flat';
import { authMiddleware, subscriptionMiddleware } from '@/lib/auth';

// Get all flats (public)
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const city = searchParams.get('city');
    const locality = searchParams.get('locality');
    const bhkType = searchParams.get('bhkType');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const furnishingType = searchParams.get('furnishingType');
    const preferredTenants = searchParams.get('preferredTenants');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const createdBy = searchParams.get('createdBy');
    
    // Build query
    const query: any = { isActive: true };
    
    if (city) query.city = { $regex: city, $options: 'i' };
    if (locality) query.locality = { $regex: locality, $options: 'i' };
    if (bhkType) query.bhkType = bhkType;
    if (minPrice) query.monthlyRent = { ...query.monthlyRent, $gte: parseInt(minPrice) };
    if (maxPrice) query.monthlyRent = { ...query.monthlyRent, $lte: parseInt(maxPrice) };
    if (furnishingType) query.furnishingType = furnishingType;
    if (preferredTenants) query.preferredTenants = preferredTenants;
    if (createdBy) query.createdBy = createdBy;
    
    // Build sort
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Execute query
    const flats = await Flat.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email role phone');
    
    // Get total count
    const totalFlats = await Flat.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      flats,
      pagination: {
        page,
        limit,
        totalFlats,
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

// Create a new flat (authenticated & subscribed users only)
export async function POST(req: NextRequest) {
  try {
    const auth = await subscriptionMiddleware(req);
    
    if (auth instanceof NextResponse) {
      return auth;
    }
    
    await connectDB();
    
    const flatData = await req.json();
    
    // Add user ID to flat data
    flatData.createdBy = auth.userId;
    
    // Create flat
    const flat = await Flat.create(flatData);
    
    return NextResponse.json(
      { success: true, flat },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating flat:', error);
    
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
