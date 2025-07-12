'use client';

import React from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImagePreviewProps {
  images: string[];
  onRemoveImage: (index: number) => void;
  maxImages?: number;
  loading?: boolean;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  images,
  onRemoveImage,
  maxImages = 5,
  loading = false
}) => {
  if (images.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">
          Uploaded Images ({images.length}/{maxImages})
        </h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {images.map((imageUrl, index) => (
          <div key={index} className="relative group">
            <div className="aspect-square rounded-lg overflow-hidden border border-border bg-muted">
              <Image
                src={imageUrl}
                alt={`Uploaded image ${index + 1}`}
                width={200}
                height={200}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Remove button */}
            {!loading && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onRemoveImage(index)}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
            
            {/* Image number badge */}
            <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
              {index + 1}
            </div>
          </div>
        ))}
      </div>
      
      {images.length >= maxImages && (
        <p className="text-xs text-muted-foreground text-center">
          Maximum {maxImages} images allowed
        </p>
      )}
    </div>
  );
}; 