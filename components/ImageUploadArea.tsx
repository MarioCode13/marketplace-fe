'use client'

import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, ImageIcon, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageUploadAreaProps {
  onImageUpload: (file: File) => void
  loading?: boolean
  disabled?: boolean
  maxImages?: number
  currentImageCount?: number
}

export const ImageUploadArea: React.FC<ImageUploadAreaProps> = ({
  onImageUpload,
  loading = false,
  disabled = false,
  maxImages = 5,
  currentImageCount = 0,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (
        acceptedFiles.length > 0 &&
        !disabled &&
        currentImageCount < maxImages
      ) {
        onImageUpload(acceptedFiles[0])
      }
    },
    [onImageUpload, disabled, currentImageCount, maxImages]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    multiple: false,
    disabled: disabled || loading,
  })

  const isAtLimit = currentImageCount >= maxImages

  return (
    <div
      {...getRootProps()}
      data-disabled={disabled || loading || isAtLimit}
      className={cn(
        'border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200',
        {
          'border-primary bg-primary/5':
            isDragActive && !disabled && !isAtLimit,
          'border-muted-foreground/25 bg-muted/50':
            !isDragActive || disabled || isAtLimit,
          'cursor-pointer hover:border-primary/50 hover:bg-primary/5':
            !disabled && !isAtLimit && !loading,
          'cursor-not-allowed opacity-50': disabled || isAtLimit || loading,
        }
      )}
    >
      <input {...getInputProps()} />

      <div className='flex flex-col items-center space-y-2'>
        {loading ? (
          <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
        ) : (
          <div className='flex items-center space-x-2'>
            <ImageIcon className='h-8 w-8 text-muted-foreground' />
            <Upload className='h-6 w-6 text-muted-foreground' />
          </div>
        )}

        <div className='space-y-1'>
          {isAtLimit ? (
            <p className='text-sm font-medium text-muted-foreground'>
              Maximum {maxImages} images reached
            </p>
          ) : disabled ? (
            <p className='text-sm font-medium text-muted-foreground'>
              Upload disabled
            </p>
          ) : loading ? (
            <p className='text-sm font-medium text-muted-foreground'>
              Uploading...
            </p>
          ) : (
            <>
              <p className='text-sm font-medium text-foreground'>
                {isDragActive
                  ? 'Drop image here'
                  : 'Click to upload or drag and drop'}
              </p>
              <p className='text-xs text-muted-foreground'>
                PNG, JPG, GIF up to 20MB
              </p>
              <p className='text-xs text-muted-foreground'>
                {currentImageCount}/{maxImages} images
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
