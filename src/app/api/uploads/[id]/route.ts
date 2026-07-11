import { NextRequest, NextResponse } from 'next/server';
import { getFileById, createReadStream } from '@/lib/gridfs';
import { Readable } from 'stream';

/**
 * Get an uploaded file by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Get file metadata
    const file = await getFileById(id);
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'File not found' },
        { status: 404 }
      );
    }
    
    // Create a readable stream
    const stream = await createReadStream(id);
    
    // Convert stream to Response
    const response = new NextResponse(Readable.fromWeb(stream as any));
    
    // Set content type header
    response.headers.set('Content-Type', file.contentType);
    
    // Set cache control headers
    response.headers.set('Cache-Control', 'public, max-age=31536000'); // 1 year
    
    return response;
  } catch (error) {
    console.error('Error getting file:', error);
    
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
