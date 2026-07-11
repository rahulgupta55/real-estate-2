'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onChange,
  maxImages = 5
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check if maximum number of images is reached
    if (images.length + files.length > maxImages) {
      setError(`You can upload a maximum of ${maxImages} images`);
      return;
    }

    setIsUploading(true);
    setError('');

    const uploadPromises = Array.from(files).map(async (file) => {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post('/api/uploads', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.data.success) {
          return response.data.url;
        } else {
          console.error('Upload failed:', response.data.message);
          return null;
        }
      } catch (error) {
        console.error('Upload error:', error);
        return null;
      }
    });

    const uploadedUrls = await Promise.all(uploadPromises);
    const validUrls = uploadedUrls.filter(url => url !== null) as string[];

    onChange([...images, ...validUrls]);
    setIsUploading(false);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {images.map((image, index) => (
          <div 
            key={index} 
            className="relative w-32 h-32 border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden group"
          >
            <Image
              src={image}
              alt={`Uploaded image ${index + 1}`}
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove image"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <div 
            className="w-32 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            onClick={handleBrowseClick}
          >
            {isUploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            ) : (
              <>
                <FiUpload className="h-8 w-8 text-gray-400 dark:text-gray-500 mb-2" />
                <span className="text-xs text-gray-500 dark:text-gray-400 text-center px-2">
                  Click to upload
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        multiple
        onChange={handleUpload}
        className="hidden"
        disabled={isUploading || images.length >= maxImages}
      />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Supported formats: JPEG, PNG, GIF, WebP. Max size: 5MB per image.
      </p>
    </div>
  );
};

export default ImageUploader;
