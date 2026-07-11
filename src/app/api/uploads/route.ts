import { NextRequest, NextResponse } from 'next/server';
import { uploadFile } from '@/lib/gridfs';
import { authMiddleware, subscriptionMiddleware } from '@/lib/auth';

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed file types
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp'
];

/**
 * Upload an image (authenticated & subscribed users only)
 */
export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated and subscribed
    const auth = await subscriptionMiddleware(req);
    
    if (auth instanceof NextResponse) {
      return auth;
    }
    
    // Check if request is multipart/form-data
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { success: false, message: 'Content type must be multipart/form-data' },
        { status: 400 }
      );
    }
    
    // Parse form data
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    
    // Check if file exists
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded' },
        { status: 400 }
      );
    }
    
    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'File type not allowed. Allowed types: JPEG, PNG, GIF, WebP' },
        { status: 400 }
      );
    }
    
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: 'File size exceeds the limit of 5MB' },
        { status: 400 }
      );
    }
    
    // Generate a unique filename
    const timestamp = Date.now();
    const originalName = file.name;
    const extension = originalName.split('.').pop() || '';
    const filename = `${auth.userId}_${timestamp}.${extension}`;
    
    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Upload file to GridFS
    const fileId = await uploadFile(buffer, filename, file.type);
    
    // Return file ID and URL
    return NextResponse.json({
      success: true,
      fileId,
      url: `/api/uploads/${fileId}`
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    
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
