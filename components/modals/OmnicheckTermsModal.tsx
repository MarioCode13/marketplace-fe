import React from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'
import Link from 'next/link'

interface OmnicheckTermsModalProps {
  setShowTermsModal: (show: boolean) => void
  business?: boolean
}

export default function OmnicheckTermsModal({
  setShowTermsModal,
  business,
}: OmnicheckTermsModalProps) {
  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'
      onClick={() => setShowTermsModal(false)}
    >
      <div
        className='bg-white dark:bg-componentBackground rounded-lg p-6 max-w-md w-full shadow-lg flex flex-col items-center'
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className='text-lg font-bold mb-2'>OmniCheck Terms</h3>

        {business ? (
          <p className='text-sm mb-4 text-center'>
            By verifying your business, you agree to share your business
            information with OmniCheck for the purpose of business identity
            verification. Your data will be processed securely and in accordance
            with our privacy policy. For more details, please visit the
            OmniCheck website.
          </p>
        ) : (
          <p className='text-sm mb-4 text-center'>
            By verifying your identity, you agree to share your information with
            OmniCheck for the purpose of identity verification. Your data will
            be processed securely and in accordance with our privacy policy. For
            more details, please visit the OmniCheck website.
          </p>
        )}
        <Link
          href='https://www.verifyid.co.za/'
          target='_blank'
          rel='noopener noreferrer'
          className='mb-4'
        >
          <Image
            src='/omnicheck.svg'
            alt='OmniCheck'
            className='h-10 mb-4'
            height={400}
            width={800}
          />
        </Link>

        <Button
          type='button'
          variant='contained'
          color='primary'
          className='w-full'
          onClick={() => setShowTermsModal(false)}
        >
          Close
        </Button>
      </div>
    </div>
  )
}
