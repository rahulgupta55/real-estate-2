import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import connectDB from './db';

let bucket: GridFSBucket;

/**
 * Initialize GridFS bucket
 */
export const initBucket = async () => {
  await connectDB();
  const db = mongoose.connection.db;
  bucket = new GridFSBucket(db, {
    bucketName: 'uploads'
  });
  return bucket;
};

/**
 * Get GridFS bucket
 */
export const getBucket = async () => {
  if (!bucket) {
    return await initBucket();
  }
  return bucket;
};

/**
 * Upload a file to GridFS
 * @param file File buffer
 * @param filename Filename
 * @param contentType Content type
 */
export const uploadFile = async (
  file: Buffer,
  filename: string,
  contentType: string
): Promise<string> => {
  const bucket = await getBucket();
  
  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, {
      contentType
    });
    
    uploadStream.on('error', (error) => {
      reject(error);
    });
    
    uploadStream.on('finish', () => {
      resolve(uploadStream.id.toString());
    });
    
    uploadStream.end(file);
  });
};

/**
 * Get file by ID
 * @param id File ID
 */
export const getFileById = async (id: string) => {
  const bucket = await getBucket();
  
  try {
    const _id = new mongoose.Types.ObjectId(id);
    const files = await bucket.find({ _id }).toArray();
    
    if (!files || files.length === 0) {
      return null;
    }
    
    return files[0];
  } catch (error) {
    console.error('Error getting file by ID:', error);
    return null;
  }
};

/**
 * Delete file by ID
 * @param id File ID
 */
export const deleteFile = async (id: string): Promise<boolean> => {
  const bucket = await getBucket();
  
  try {
    const _id = new mongoose.Types.ObjectId(id);
    await bucket.delete(_id);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

/**
 * Create a readable stream for a file
 * @param id File ID
 */
export const createReadStream = async (id: string) => {
  const bucket = await getBucket();
  
  try {
    const _id = new mongoose.Types.ObjectId(id);
    return bucket.openDownloadStream(_id);
  } catch (error) {
    console.error('Error creating read stream:', error);
    throw error;
  }
};
