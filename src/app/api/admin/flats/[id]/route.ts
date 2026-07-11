import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Flat from '@/models/Flat';
import { UserRole } from '@/models/User';
import { roleMiddleware } from '@/lib/auth';

// Get a single flat by ID (admin only)
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Check if user is admin
    const adminCheck = await roleMiddleware([UserRole.ADMIN])(req);

    if (adminCheck instanceof NextResponse) {
      return adminCheck;
    }

    await connectDB();

    const flat = await Flat.findById(context.params.id)
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

// Update a flat (admin only)
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Check if user is admin
    const adminCheck = await roleMiddleware([UserRole.ADMIN])(req);

    if (adminCheck instanceof NextResponse) {
      return adminCheck;
    }

    await connectDB();

    // Find flat
    const flat = await Flat.findById(context.params.id);

    if (!flat) {
      return NextResponse.json(
        { success: false, message: 'Flat not found' },
        { status: 404 }
      );
    }

    // Update flat
    const flatData = await req.json();

    const updatedFlat = await Flat.findByIdAndUpdate(
      context.params.id,
      flatData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email role phone');

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

// Delete a flat (admin only)
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Check if user is admin
    const adminCheck = await roleMiddleware([UserRole.ADMIN])(req);

    if (adminCheck instanceof NextResponse) {
      return adminCheck;
    }

    await connectDB();

    // Find flat
    const flat = await Flat.findById(context.params.id);

    if (!flat) {
      return NextResponse.json(
        { success: false, message: 'Flat not found' },
        { status: 404 }
      );
    }

    // Delete flat
    await Flat.findByIdAndDelete(context.params.id);

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

// Patch a flat (for status updates) (admin only)
export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Check if user is admin
    const adminCheck = await roleMiddleware([UserRole.ADMIN])(req);

    if (adminCheck instanceof NextResponse) {
      return adminCheck;
    }

    await connectDB();

    // Find flat
    const flat = await Flat.findById(context.params.id);

    if (!flat) {
      return NextResponse.json(
        { success: false, message: 'Flat not found' },
        { status: 404 }
      );
    }

    // Update flat status
    const { isActive } = await req.json();

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { success: false, message: 'Invalid status value' },
        { status: 400 }
      );
    }

    flat.isActive = isActive;
    await flat.save();

    return NextResponse.json({
      success: true,
      flat,
      message: `Flat ${isActive ? 'activated' : 'deactivated'} successfully`,
    });
  } catch (error) {
    console.error('Error updating flat status:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
