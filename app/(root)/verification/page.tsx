'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, Shield, AlertTriangle, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function VerificationDisclosurePage() {
  const router = useRouter()

  return (
    <div className='min-h-screen bg-background'>
      <div className='max-w-4xl mx-auto p-6'>
        {/* Header */}
        <div className='flex items-center gap-4 mb-8'>
          <Button
            variant='text'
            size='sm'
            onClick={() => router.back()}
          >
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back
          </Button>
          <h1 className='text-3xl font-bold'>Verification Disclosure</h1>
        </div>

        <div className='bg-componentBackground rounded-lg p-8 shadow-lg space-y-8'>
          {/* Last Updated */}
          <div className='text-sm text-muted-foreground border-b pb-4'>
            Last updated:{' '}
            {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>

          {/* Important Notice */}
          <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6'>
            <div className='flex items-start gap-3'>
              <AlertTriangle className='w-6 h-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0' />
              <div>
                <h3 className='text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2'>
                  Important Notice
                </h3>
                <p className='text-blue-800 dark:text-blue-200 leading-relaxed'>
                  <strong>
                    Verification does not guarantee safety or successful
                    transactions.
                  </strong>
                  While we verify user identities, we cannot guarantee the
                  quality of items, the honesty of users, or the outcome of
                  transactions. Users transact at their own risk.
                </p>
              </div>
            </div>
          </div>

          {/* What Verification Means */}
          <section>
            <h2 className='text-2xl font-semibold mb-4 flex items-center gap-2'>
              <CheckCircle className='w-6 h-6 text-green-600' />
              What Our Verification Process Confirms
            </h2>
            <p className='text-foreground leading-relaxed mb-4'>
              Our verification process confirms the following information:
            </p>
            <ul className='list-disc list-inside space-y-2 text-foreground'>
              <li>
                <strong>Identity Verification:</strong> The user has provided
                valid government-issued identification
              </li>
              <li>
                <strong>Address Verification:</strong> The user has provided
                proof of their current address
              </li>
              <li>
                <strong>Profile Completion:</strong> The user has completed
                their profile with basic information
              </li>
              <li>
                <strong>Email Verification:</strong> The user has confirmed
                their email address
              </li>
              <li>
                <strong>Phone Verification:</strong> The user has verified their
                phone number (if provided)
              </li>
            </ul>
          </section>

          {/* What Verification Does NOT Mean */}
          <section>
            <h2 className='text-2xl font-semibold mb-4 flex items-center gap-2'>
              <AlertTriangle className='w-6 h-6 text-orange-600' />
              What Verification Does NOT Guarantee
            </h2>
            <p className='text-foreground leading-relaxed mb-4'>
              <strong>Important:</strong> Our verification process does NOT
              guarantee:
            </p>
            <ul className='list-disc list-inside space-y-2 text-foreground'>
              <li>
                <strong>Item Quality:</strong> The quality, condition, or
                authenticity of items being sold
              </li>
              <li>
                <strong>User Honesty:</strong> That users will be honest in
                their dealings or descriptions
              </li>
              <li>
                <strong>Transaction Success:</strong> That transactions will be
                completed successfully
              </li>
              <li>
                <strong>Item Delivery:</strong> That items will be delivered as
                promised
              </li>
              <li>
                <strong>Payment Security:</strong> That payments will be secure
                or refunded if issues arise
              </li>
              <li>
                <strong>Legal Compliance:</strong> That users will comply with
                all applicable laws
              </li>
              <li>
                <strong>Future Behavior:</strong> That verified users will not
                engage in fraudulent activities
              </li>
            </ul>
          </section>

          {/* Trust Rating System */}
          <section>
            <h2 className='text-2xl font-semibold mb-4 flex items-center gap-2'>
              <Shield className='w-6 h-6 text-blue-600' />
              Trust Rating System
            </h2>
            <p className='text-foreground leading-relaxed mb-4'>
              Our trust rating system is based on various factors including:
            </p>
            <ul className='list-disc list-inside space-y-2 text-foreground mb-4'>
              <li>Profile completion percentage</li>
              <li>Number of successful transactions</li>
              <li>User reviews and ratings</li>
              <li>Account age and activity</li>
              <li>Verification status</li>
            </ul>
            <div className='bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4'>
              <p className='text-yellow-800 dark:text-yellow-200 text-sm'>
                <strong>Note:</strong> Trust ratings are based on user-reported
                data and may not reflect the current reliability of a user.
                Always exercise caution and use your own judgment when
                transacting.
              </p>
            </div>
          </section>

          {/* User Responsibilities */}
          <section>
            <h2 className='text-2xl font-semibold mb-4'>
              Your Responsibilities
            </h2>
            <p className='text-foreground leading-relaxed mb-4'>
              As a user of our platform, you are responsible for:
            </p>
            <ul className='list-disc list-inside space-y-2 text-foreground'>
              <li>
                <strong>Due Diligence:</strong> Researching sellers and items
                before making purchases
              </li>
              <li>
                <strong>Safe Transactions:</strong> Using safe payment methods
                and meeting in secure locations
              </li>
              <li>
                <strong>Verification:</strong> Verifying item condition and
                authenticity in person when possible
              </li>
              <li>
                <strong>Communication:</strong> Clearly communicating
                expectations and requirements
              </li>
              <li>
                <strong>Documentation:</strong> Keeping records of transactions
                and communications
              </li>
              <li>
                <strong>Reporting:</strong> Reporting suspicious or fraudulent
                activities
              </li>
            </ul>
          </section>

          {/* Risk Disclaimer */}
          <section>
            <h2 className='text-2xl font-semibold mb-4'>Risk Disclaimer</h2>
            <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6'>
              <p className='text-red-800 dark:text-red-200 leading-relaxed'>
                <strong>By using our platform, you acknowledge that:</strong>
              </p>
              <ul className='list-disc list-inside space-y-2 text-red-800 dark:text-red-200 mt-4'>
                <li>All transactions are conducted at your own risk</li>
                <li>
                  We are not responsible for any losses, damages, or disputes
                </li>
                <li>
                  Verification does not eliminate the need for caution and
                  common sense
                </li>
                <li>You should always verify items and users independently</li>
                <li>
                  We may assist with disputes but are not liable for outcomes
                </li>
                <li>
                  If you are the victim of a scam or fraud, you should report
                  the incident to the police. If law enforcement contacts us as
                  part of an official investigation, we may provide relevant
                  documents or information to assist with the investigation. We
                  are not a party to transactions between users and do not
                  mediate or resolve disputes, but we will cooperate with
                  authorities as required by law.
                </li>
              </ul>
            </div>
          </section>

          {/* Best Practices */}
          <section>
            <h2 className='text-2xl font-semibold mb-4'>
              Best Practices for Safe Transactions
            </h2>
            <div className='grid md:grid-cols-2 gap-6'>
              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-green-700 dark:text-green-400'>
                  ✅ Do&apos;s
                </h3>
                <ul className='list-disc list-inside space-y-2 text-foreground'>
                  <li>Meet in public, well-lit locations</li>
                  <li>Inspect items thoroughly before purchasing</li>
                  <li>Use secure payment methods when possible</li>
                  <li>Keep all transaction records</li>
                  <li>
                    Trust your instincts - if something seems off, walk away
                  </li>
                  <li>Report suspicious behavior immediately</li>
                </ul>
              </div>
              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-red-700 dark:text-red-400'>
                  ❌ Don&apos;ts
                </h3>
                <ul className='list-disc list-inside space-y-2 text-foreground'>
                  <li>Don&apos;t meet in isolated or unsafe locations</li>
                  <li>Don&apos;t pay before seeing the item</li>
                  <li>Don&apos;t share personal financial information</li>
                  <li>Don&apos;t ignore red flags or pressure tactics</li>
                  <li>Don&apos;t assume verification guarantees safety</li>
                  <li>Don&apos;t hesitate to cancel suspicious transactions</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className='text-2xl font-semibold mb-4'>Need Help?</h2>
            <p className='text-foreground leading-relaxed mb-4'>
              If you have questions about our verification process or need
              assistance with a transaction:
            </p>
            <div className='space-y-2'>
              <p className='text-foreground'>
                <strong>General Support:</strong>{' '}
                <a
                  href='mailto:support@marketplace.com'
                  className='text-blue-600 hover:underline'
                >
                  support@marketplace.com
                </a>
              </p>
              <p className='text-foreground'>
                <strong>Report Fraud:</strong>{' '}
                <a
                  href='mailto:fraud@marketplace.com'
                  className='text-blue-600 hover:underline'
                >
                  fraud@marketplace.com
                </a>
              </p>
              <p className='text-foreground'>
                <strong>Verification Issues:</strong>{' '}
                <a
                  href='mailto:verification@marketplace.com'
                  className='text-blue-600 hover:underline'
                >
                  verification@marketplace.com
                </a>
              </p>
            </div>
          </section>

          {/* Footer */}
          <div className='border-t pt-6 mt-8'>
            <p className='text-sm text-muted-foreground text-center'>
              By using our platform, you acknowledge that you have read and
              understood this Verification Disclosure and agree to transact at
              your own risk.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
