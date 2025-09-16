import React from 'react'
import { Card } from '@/components/ui/card'
import { MapPin, Phone, Mail, Building } from 'lucide-react'

interface BusinessDetailsCardProps {
  business: {
    name: string
    email?: string
    contactNumber?: string
    addressLine1?: string
    addressLine2?: string
    city?: {
      name: string
      region?: {
        name: string
        country?: {
          name: string
        }
      }
    }
    postalCode?: string
  }
  className?: string
}

export default function BusinessDetailsCard({
  business,
  className = '',
}: BusinessDetailsCardProps) {
  const fullAddress = [
    business.addressLine1,
    business.addressLine2,
    business.city?.name,
    business.city?.region?.name,
    business.city?.region?.country?.name,
    business.postalCode,
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <Card className={`p-6 bg-white shadow-sm ${className}`}>
      <div className='flex items-center gap-3 mb-4'>
        <Building className='w-5 h-5 text-gray-600' />
        <h3 className='text-lg font-semibold text-gray-900'>
          Business Details
        </h3>
      </div>

      <div className='space-y-3'>
        <div className='flex items-start gap-3'>
          <Building className='w-4 h-4 text-gray-500 mt-1 flex-shrink-0' />
          <div>
            <p className='font-medium text-gray-900'>{business.name}</p>
            <p className='text-sm text-gray-600'>Business Name</p>
          </div>
        </div>

        {business.email && (
          <div className='flex items-start gap-3'>
            <Mail className='w-4 h-4 text-gray-500 mt-1 flex-shrink-0' />
            <div>
              <p className='text-gray-900'>{business.email}</p>
              <p className='text-sm text-gray-600'>Email Address</p>
            </div>
          </div>
        )}

        {business.contactNumber && (
          <div className='flex items-start gap-3'>
            <Phone className='w-4 h-4 text-gray-500 mt-1 flex-shrink-0' />
            <div>
              <p className='text-gray-900'>{business.contactNumber}</p>
              <p className='text-sm text-gray-600'>Contact Number</p>
            </div>
          </div>
        )}

        {fullAddress && (
          <div className='flex items-start gap-3'>
            <MapPin className='w-4 h-4 text-gray-500 mt-1 flex-shrink-0' />
            <div>
              <p className='text-gray-900'>{fullAddress}</p>
              <p className='text-sm text-gray-600'>Business Address</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
