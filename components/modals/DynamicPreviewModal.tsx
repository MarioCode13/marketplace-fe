import React, { useState } from 'react'
import Image from 'next/image'
import ListingCard, { CardListing } from '@/components/cards/ListingCard'
import { X, ListFilter, Palette, EyeOff } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { getTextColor } from '@/lib/utils'
import { useTheme } from '@/context/ThemeContext'

interface DynamicPreviewModalProps {
  form: {
    storeName: string
    about: string
    themeColor: string
    primaryColor: string
    secondaryColor: string
    backgroundColor: string
    backgroundColorEnd: string
    backgroundType: string
    linearGradientDirection: string
    radialGradientShape: string
    textColor: string
    cardTextColor: string
    lightOrDark: string
    logoUrl: string
    bannerUrl: string
  }
  businessDetails?: {
    email?: string
    contactNumber?: string
    addressLine1?: string
    addressLine2?: string
    postalCode?: string
    cityName?: string
    regionName?: string
    countryName?: string
  }
  onFormChange: (field: string, value: string) => void
  setShowPreview: (show: boolean) => void
  onSave?: () => void
}

const dummyListings: CardListing[] = [
  {
    id: '1',
    title: 'Sample Listing 1',
    description: 'A great product for preview purposes.',
    price: '99.99',
    images: ['/logo.png'],
    createdAt: new Date().toISOString(),
    user: {
      id: 'dummy',
      username: 'DemoSeller',
      trustRating: {
        overallScore: 90,
        starRating: 4.8,
        trustLevel: 'Trusted',
        totalReviews: 12,
        positiveReviews: 11,
        verifiedId: true,
      },
    },
  },
  {
    id: '2',
    title: 'Sample Listing 2',
    description: 'Another example listing to show the preview.',
    price: '49.50',
    images: ['/logo.png'],
    createdAt: new Date().toISOString(),
    user: {
      id: 'dummy',
      username: 'DemoSeller',
      trustRating: {
        overallScore: 90,
        starRating: 4.8,
        trustLevel: 'Trusted',
        totalReviews: 12,
        positiveReviews: 11,
        verifiedId: true,
      },
    },
  },
]

export default function DynamicPreviewModal({
  form,
  businessDetails,
  onFormChange,
  setShowPreview,
  onSave,
}: DynamicPreviewModalProps) {
  const [showColorPanel, setShowColorPanel] = useState(false)

  // Generate background style based on type
  const getBackgroundStyle = () => {
    const backgroundColor = form.backgroundColor || '#f8f9fa'

    if (form.backgroundType === 'LINEAR_GRADIENT') {
      const endColor = form.backgroundColorEnd || '#ffffff'
      let direction = 'to bottom'

      switch (form.linearGradientDirection) {
        case 'TOP_TO_BOTTOM':
          direction = 'to bottom'
          break
        case 'LEFT_TO_RIGHT':
          direction = 'to right'
          break
        case 'DIAGONAL_TL_BR':
          direction = 'to bottom right'
          break
        case 'DIAGONAL_TR_BL':
          direction = 'to bottom left'
          break
      }

      return {
        background: `linear-gradient(${direction}, ${backgroundColor}, ${endColor})`,
      }
    } else if (form.backgroundType === 'RADIAL_GRADIENT') {
      const endColor = form.backgroundColorEnd || '#ffffff'
      const shape =
        form.radialGradientShape === 'ellipse' ? 'ellipse' : 'circle'

      return {
        background: `radial-gradient(${shape}, ${backgroundColor}, ${endColor})`,
      }
    } else {
      return {
        backgroundColor: backgroundColor,
      }
    }
  }

  // Match store page color usage exactly
  const primaryColor = form.primaryColor || '#fff'
  const cardTextColor = form.cardTextColor || '#222'
  const textColor = form.textColor || '#222'
  const secondaryColor = form.secondaryColor || '#1f1b30'
  const themeColor = form.themeColor || '#1f1b30'
  const bannerUrl = form.bannerUrl
  const logoUrl = form.logoUrl
  const about = form.about
  const storeName = form.storeName || 'Store Name'
  const details = businessDetails || {}
  const contactTextColor = getTextColor(themeColor)
  const hasDetails =
    Boolean(details.email) ||
    Boolean(details.contactNumber) ||
    Boolean(details.addressLine1) ||
    Boolean(details.addressLine2) ||
    Boolean(details.cityName) ||
    Boolean(details.postalCode)

  const { theme: siteTheme } = useTheme()
  const modalBackground = siteTheme === 'dark' ? '#0f172a' : '#ffffff'
  const modalTextColor = siteTheme === 'dark' ? '#e5e7eb' : '#111827'

  return (
    <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto'>
      <div
        className='relative w-full max-w-7xl rounded-lg shadow-xl overflow-hidden my-8 border border-gray-500'
        style={{
          backgroundColor: modalBackground,
          color: modalTextColor,
        }}
      >
        {/* Header */}
        <div className='flex items-center justify-between p-4 border-b border-gray-500'>
          <h2 className='text-lg font-semibold'>Store Preview</h2>
          <div className='flex items-center gap-2'>
            {onSave && (
              <Button
                variant='contained'
                size='sm'
                onClick={onSave}
              >
                Save Changes
              </Button>
            )}
            <Button
              variant='outlined'
              size='sm'
              onClick={() => setShowColorPanel(!showColorPanel)}
            >
              {showColorPanel ? (
                <>
                  <EyeOff className='w-4 h-4 mr-2' />
                  Hide Color Options
                </>
              ) : (
                <>
                  <Palette className='w-4 h-4 mr-2' />
                  Color Options
                </>
              )}
            </Button>
            <Button
              variant='text'
              color={'primary'}
              size={'icon'}
              className='rounded-full'
              onClick={() => setShowPreview(false)}
            >
              <X size={16} />
            </Button>
          </div>
        </div>

        <div className='flex'>
          {/* Preview Area */}
          <div className='flex-1 overflow-y-auto max-h-[80vh]'>
            <div
              className='relative  overflow-hidden'
              style={getBackgroundStyle()}
            >
              {/* Banner - ... */}
              {bannerUrl && (
                <div className='h-72 w-full overflow-hidden mb-6'>
                  <Image
                    width={2000}
                    height={1500}
                    src={bannerUrl}
                    alt='Store banner'
                    className='w-full h-full object-cover'
                  />
                </div>
              )}

              <div className='max-w-5xl mx-auto p-4'>
                <div className='flex items-center gap-4 mb-4'>
                  {logoUrl && (
                    <Image
                      width={80}
                      height={80}
                      src={logoUrl}
                      alt='Store logo'
                      className='w-20 h-20 rounded-full object-cover border shrink-0'
                      style={{
                        borderColor: themeColor,
                        borderWidth: 2,
                        borderStyle: 'solid',
                      }}
                    />
                  )}
                  <div className='flex-1 min-w-0'>
                    <h1
                      className='text-2xl font-bold'
                      style={{ color: secondaryColor }}
                    >
                      {storeName}
                    </h1>
                    {about && (
                      <p
                        className='mt-1'
                        style={{ color: textColor }}
                      >
                        {about}
                      </p>
                    )}
                    <div className='mt-2 flex items-center gap-2'>
                      <span
                        className='text-xs px-2 py-1 rounded'
                        style={{
                          backgroundColor: themeColor,
                          color: getTextColor(themeColor),
                        }}
                      >
                        Preview
                      </span>
                    </div>
                  </div>
                </div>

                {/* Filter area ... */}
                <div className='mt-8'>
                  <div className='flex items-center justify-start w-full mb-6'>
                    <div
                      className='flex items-center gap-4'
                      style={{ color: textColor }}
                    >
                      <Button
                        variant='outlined'
                        size='icon'
                        className='rounded-full p-3 pointer-events-none opacity-80'
                        style={{ backgroundColor: themeColor }}
                      >
                        <ListFilter
                          className='!w-5 !h-5'
                          strokeWidth={2}
                          style={{ color: textColor }}
                        />
                      </Button>
                    </div>
                  </div>

                  <div
                    className='w-full mb-4 text-sm'
                    style={{ color: textColor }}
                  >
                    {dummyListings.length} listing
                    {dummyListings.length !== 1 ? 's' : ''} found
                  </div>

                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full'>
                    {dummyListings.map((listing) => (
                      <ListingCard
                        key={listing.id}
                        listing={listing}
                        primaryColor={primaryColor}
                        cardTextColor={cardTextColor}
                        store
                      />
                    ))}
                  </div>
                </div>

                {hasDetails && (
                  <div
                    className='my-14 p-4 rounded-lg border'
                    style={{
                      borderColor: themeColor + '50',
                      backgroundColor: themeColor,
                      color: contactTextColor,
                    }}
                  >
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                      {details.email && (
                        <div>
                          <span
                            className='font-medium'
                            style={{ color: contactTextColor }}
                          >
                            Email:
                          </span>
                          <span
                            className='ml-2'
                            style={{ color: contactTextColor }}
                          >
                            {details.email}
                          </span>
                        </div>
                      )}
                      {details.contactNumber && (
                        <div>
                          <span
                            className='font-medium'
                            style={{ color: contactTextColor }}
                          >
                            Phone:
                          </span>
                          <span
                            className='ml-2'
                            style={{ color: contactTextColor }}
                          >
                            {details.contactNumber}
                          </span>
                        </div>
                      )}
                      {(details.addressLine1 ||
                        details.addressLine2 ||
                        details.cityName) && (
                        <div className='md:col-span-2'>
                          <span
                            className='font-medium'
                            style={{ color: contactTextColor }}
                          >
                            Address:
                          </span>
                          <div
                            className='ml-2'
                            style={{ color: contactTextColor }}
                          >
                            {details.addressLine1 && (
                              <div>{details.addressLine1}</div>
                            )}
                            {details.addressLine2 && (
                              <div>{details.addressLine2}</div>
                            )}
                            <div>
                              {details.cityName && `${details.cityName}, `}
                              {details.regionName && `${details.regionName}, `}
                              {details.countryName}
                              {details.postalCode && ` ${details.postalCode}`}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Color Controls Panel */}
          {showColorPanel && (
            <div className='w-80 border-l p-4 overflow-y-auto max-h-[80vh]'>
              <h3 className='font-medium mb-4 flex items-center gap-2'>
                <Palette className='w-4 h-4' />
                Color Controls
              </h3>

              <div className='space-y-4'>
                {/* Background Color */}
                <div>
                  <label className='block font-medium mb-1 text-sm'>
                    Background Color
                  </label>
                  <div className='flex items-center gap-2'>
                    <input
                      type='color'
                      value={form.backgroundColor}
                      onChange={(e) =>
                        onFormChange('backgroundColor', e.target.value)
                      }
                      className='w-8 h-8 rounded border border-gray-300 cursor-pointer'
                    />
                    <Input
                      value={form.backgroundColor.toUpperCase()}
                      onChange={(e) =>
                        onFormChange('backgroundColor', e.target.value)
                      }
                      className='flex-1 text-xs'
                    />
                  </div>
                </div>

                {/* Background Type */}
                <div>
                  <label className='block font-medium mb-1 text-sm'>
                    Background Type
                  </label>
                  <Select
                    value={form.backgroundType || 'SOLID'}
                    onValueChange={(value) =>
                      onFormChange('backgroundType', value)
                    }
                  >
                    <SelectTrigger className='h-8'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='SOLID'>Solid</SelectItem>
                      <SelectItem value='LINEAR_GRADIENT'>
                        Linear Gradient
                      </SelectItem>
                      <SelectItem value='RADIAL_GRADIENT'>
                        Radial Gradient
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* End Color for Gradients */}
                {(form.backgroundType === 'LINEAR_GRADIENT' ||
                  form.backgroundType === 'RADIAL_GRADIENT') && (
                  <div>
                    <label className='block font-medium mb-1 text-sm'>
                      End Color
                    </label>
                    <div className='flex items-center gap-2'>
                      <input
                        type='color'
                        value={form.backgroundColorEnd}
                        onChange={(e) =>
                          onFormChange('backgroundColorEnd', e.target.value)
                        }
                        className='w-8 h-8 rounded border border-gray-300 cursor-pointer'
                      />
                      <Input
                        value={form.backgroundColorEnd.toUpperCase()}
                        onChange={(e) =>
                          onFormChange('backgroundColorEnd', e.target.value)
                        }
                        className='flex-1 text-xs'
                      />
                    </div>
                  </div>
                )}

                {/* Linear Gradient Direction */}
                {form.backgroundType === 'LINEAR_GRADIENT' && (
                  <div>
                    <label className='block font-medium mb-1 text-sm'>
                      Direction
                    </label>
                    <Select
                      value={form.linearGradientDirection || 'TOP_TO_BOTTOM'}
                      onValueChange={(value) =>
                        onFormChange('linearGradientDirection', value)
                      }
                    >
                      <SelectTrigger className='h-8'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='TOP_TO_BOTTOM'>
                          Top to Bottom
                        </SelectItem>
                        <SelectItem value='LEFT_TO_RIGHT'>
                          Left to Right
                        </SelectItem>
                        <SelectItem value='DIAGONAL_TL_BR'>
                          Top Left to Bottom Right
                        </SelectItem>
                        <SelectItem value='DIAGONAL_TR_BL'>
                          Top Right to Bottom Left
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Radial Gradient Shape */}
                {form.backgroundType === 'RADIAL_GRADIENT' && (
                  <div>
                    <label className='block font-medium mb-1 text-sm'>
                      Shape
                    </label>
                    <Select
                      value={form.radialGradientShape || 'circle'}
                      onValueChange={(value) =>
                        onFormChange('radialGradientShape', value)
                      }
                    >
                      <SelectTrigger className='h-8'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='circle'>Circle</SelectItem>
                        <SelectItem value='ellipse'>Ellipse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Theme Color */}
                <div>
                  <label className='block font-medium mb-1 text-sm'>
                    Theme Color
                  </label>
                  <div className='flex items-center gap-2'>
                    <input
                      type='color'
                      value={form.themeColor}
                      onChange={(e) =>
                        onFormChange('themeColor', e.target.value)
                      }
                      className='w-8 h-8 rounded border border-gray-300 cursor-pointer'
                    />
                    <Input
                      value={form.themeColor.toUpperCase()}
                      onChange={(e) =>
                        onFormChange('themeColor', e.target.value)
                      }
                      className='flex-1 text-xs'
                    />
                  </div>
                </div>

                {/* Primary Color */}
                <div>
                  <label className='block font-medium mb-1 text-sm'>
                    Primary Color
                  </label>
                  <div className='flex items-center gap-2'>
                    <input
                      type='color'
                      value={form.primaryColor}
                      onChange={(e) =>
                        onFormChange('primaryColor', e.target.value)
                      }
                      className='w-8 h-8 rounded border border-gray-300 cursor-pointer'
                    />
                    <Input
                      value={form.primaryColor.toUpperCase()}
                      onChange={(e) =>
                        onFormChange('primaryColor', e.target.value)
                      }
                      className='flex-1 text-xs'
                    />
                  </div>
                </div>

                {/* Secondary Color */}
                <div>
                  <label className='block font-medium mb-1 text-sm'>
                    Secondary Color
                  </label>
                  <div className='flex items-center gap-2'>
                    <input
                      type='color'
                      value={form.secondaryColor}
                      onChange={(e) =>
                        onFormChange('secondaryColor', e.target.value)
                      }
                      className='w-8 h-8 rounded border border-gray-300 cursor-pointer'
                    />
                    <Input
                      value={form.secondaryColor.toUpperCase()}
                      onChange={(e) =>
                        onFormChange('secondaryColor', e.target.value)
                      }
                      className='flex-1 text-xs'
                    />
                  </div>
                </div>

                {/* Text Color */}
                <div>
                  <label className='block font-medium mb-1 text-sm'>
                    Text Color
                  </label>
                  <div className='flex items-center gap-2'>
                    <input
                      type='color'
                      value={form.textColor}
                      onChange={(e) =>
                        onFormChange('textColor', e.target.value)
                      }
                      className='w-8 h-8 rounded border border-gray-300 cursor-pointer'
                    />
                    <Input
                      value={form.textColor.toUpperCase()}
                      onChange={(e) =>
                        onFormChange('textColor', e.target.value)
                      }
                      className='flex-1 text-xs'
                    />
                  </div>
                </div>

                {/* Card Text Color */}
                <div>
                  <label className='block font-medium mb-1 text-sm'>
                    Card Text Color
                  </label>
                  <div className='flex items-center gap-2'>
                    <input
                      type='color'
                      value={form.cardTextColor}
                      onChange={(e) =>
                        onFormChange('cardTextColor', e.target.value)
                      }
                      className='w-8 h-8 rounded border border-gray-300 cursor-pointer'
                    />
                    <Input
                      value={form.cardTextColor.toUpperCase()}
                      onChange={(e) =>
                        onFormChange('cardTextColor', e.target.value)
                      }
                      className='flex-1 text-xs'
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
