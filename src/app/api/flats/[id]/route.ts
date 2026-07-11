import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Flat from '@/models/Flat';
import { authMiddleware, subscriptionMiddleware } from '@/lib/auth';

// Get a single flat by ID (public)
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const flat = await Flat.findById(params.id)
      .populate('createdBy', 'name email role phone');
    
    if (!flat) {
      return NextResponse.json(
        { success: false, message: 'Flat not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, flat });
  } catch (error) {
    console.error('Error fetching flat:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    );
  }
}

// Update a flat (authenticated & subscribed users only)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await subscriptionMiddleware(req);
    
    if (auth instanceof NextResponse) {
      return auth;
    }
    
    await connectDB();
    
    // Find flat
    const flat = await Flat.findById(params.id);
    
    if (!flat) {
      return NextResponse.json(
        { success: false, message: 'Flat not found' },
        { status: 404 }
      );
    }
    
    // Check if user owns the flat
    if (flat.createdBy.toString() !== auth.userId) {
      return NextResponse.json(
        { success: false, message: 'Not authorized to update this flat' },
        { status: 403 }
      );
    }
    
    // Update flat
    const flatData = await req.json();
    
    // Remove createdBy from update data if present
    delete flatData.createdBy;
    
    const updatedFlat = await Flat.findByIdAndUpdate(
      params.id,
      flatData,
      { new: true, runValidators: true }
    );
    
    return NextResponse.json({ success: true, flat: updatedFlat });
  } catch (error) {
    console.error('Error updating flat:', error);
    
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

// Delete a flat (authenticated & subscribed users only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await subscriptionMiddleware(req);
    
    if (auth instanceof NextResponse) {
      return auth;
    }
    
    await connectDB();
    
    // Find flat
    const flat = await Flat.findById(params.id);
    
    if (!flat) {
      return NextResponse.json(
        { success: false, message: 'Flat not found' },
        { status: 404 }
      );
    }
    
    // Check if user owns the flat
    if (flat.createdBy.toString() !== auth.userId) {
      return NextResponse.json(
        { success: false, message: 'Not authorized to delete this flat' },
        { status: 403 }
      );
    }
    
    // Delete flat
    await Flat.findByIdAndDelete(params.id);
    
    return NextResponse.json({
      success: true,
      message: 'Flat deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting flat:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
