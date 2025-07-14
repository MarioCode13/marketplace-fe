'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function PrivacyPolicyPage() {
  const router = useRouter()

  return (
    <div className='min-h-screen bg-background'>
      <div className='w-full flex justify-center'>
        <div className='w-full max-w-4xl py-8 px-6'>
          {/* Header */}
          <div className='flex items-center gap-4 mb-8'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => router.back()}
            >
              <ArrowLeft className='w-4 h-4 mr-2' />
              Back
            </Button>
            <h1 className='text-3xl font-bold'>Privacy Policy</h1>
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

            {/* Introduction */}
            <section>
              <h2 className='text-2xl font-semibold mb-4'>1. Introduction</h2>
              <p className='text-foreground leading-relaxed'>
                This Privacy Policy explains how we collect, use, and protect
                your personal information when you use our marketplace platform.
                We are committed to protecting your privacy and complying with
                applicable data protection laws, including the Protection of
                Personal Information Act (POPIA) and the General Data Protection
                Regulation (GDPR).
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className='text-2xl font-semibold mb-4'>
                2. Information We Collect
              </h2>

              <h3 className='text-xl font-medium mb-3'>
                2.1 Personal Information
              </h3>
              <p className='text-foreground leading-relaxed mb-4'>
                We collect the following personal information:
              </p>
              <ul className='list-disc list-inside space-y-2 text-foreground mb-6'>
                <li>
                  <strong>Account Information:</strong> Username, email address,
                  password
                </li>
                <li>
                  <strong>Profile Information:</strong> First name, last name,
                  bio, location, contact number
                </li>
                <li>
                  <strong>Identity Verification:</strong> ID photos,
                  driver&apos;s license, proof of address
                </li>
                <li>
                  <strong>Listing Information:</strong> Item descriptions,
                  photos, prices, locations
                </li>
                <li>
                  <strong>Transaction Data:</strong> Sale records, buyer/seller
                  information, payment methods
                </li>
                <li>
                  <strong>Communication Data:</strong> Messages between users,
                  support requests
                </li>
              </ul>

              <h3 className='text-xl font-medium mb-3'>
                2.2 Technical Information
              </h3>
              <p className='text-foreground leading-relaxed mb-4'>
                We automatically collect technical information when you use our
                platform:
              </p>
              <ul className='list-disc list-inside space-y-2 text-foreground'>
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Usage patterns and preferences</li>
                <li>Cookies and similar technologies</li>
              </ul>
            </section>

            {/* How We Use Information */}
            <section>
              <h2 className='text-2xl font-semibold mb-4'>
                3. How We Use Your Information
              </h2>
              <p className='text-foreground leading-relaxed mb-4'>
                We use your personal information for the following purposes:
              </p>
              <ul className='list-disc list-inside space-y-2 text-foreground'>
                <li>To provide and maintain our marketplace platform</li>
                <li>To verify your identity and prevent fraud</li>
                <li>To facilitate transactions between users</li>
                <li>
                  To communicate with you about your account and transactions
                </li>
                <li>To provide customer support and resolve disputes</li>
                <li>To improve our services and develop new features</li>
                <li>To comply with legal obligations and enforce our terms</li>
                <li>To send you important updates and notifications</li>
              </ul>
            </section>

            {/* Legal Basis for Processing */}
            <section>
              <h2 className='text-2xl font-semibold mb-4'>
                4. Legal Basis for Processing
              </h2>
              <p className='text-foreground leading-relaxed mb-4'>
                We process your personal information based on the following
                legal grounds:
              </p>
              <ul className='list-disc list-inside space-y-2 text-foreground'>
                <li>
                  <strong>Contract:</strong> To fulfill our obligations under
                  our Terms of Use
                </li>
                <li>
                  <strong>Legitimate Interest:</strong> To provide and improve
                  our services
                </li>
                <li>
                  <strong>Consent:</strong> For marketing communications and
                  optional features
                </li>
                <li>
                  <strong>Legal Obligation:</strong> To comply with applicable
                  laws and regulations
                </li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section>
              <h2 className='text-2xl font-semibold mb-4'>
                5. Information Sharing and Disclosure
              </h2>
              <p className='text-foreground leading-relaxed mb-4'>
                We do not sell your personal information. We may share your
                information in the following circumstances:
              </p>
              <ul className='list-disc list-inside space-y-2 text-foreground'>
                <li>
                  <strong>With Other Users:</strong> Basic profile information
                  and listing details are visible to other users
                </li>
                <li>
                  <strong>Service Providers:</strong> With trusted third-party
                  services that help us operate our platform
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose your
                  personal information if required to do so by law or in the
                  good faith belief that such disclosure is necessary to:
                  <ul className='list-disc list-inside ml-6 mt-2'>
                    <li>Comply with a legal obligation,</li>
                    <li>
                      Assist with the investigation of suspected fraud or
                      illegal activity,
                    </li>
                    <li>
                      Protect the rights, safety, or property of our users or
                      the public.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Business Transfers:</strong> In connection with a
                  merger, acquisition, or sale of assets
                </li>
                <li>
                  <strong>With Your Consent:</strong> When you explicitly
                  authorize us to share your information
                </li>
              </ul>
              <p className='text-foreground leading-relaxed mt-4'>
                <strong>
                  We will never disclose your personal documents or identifying
                  information to other users or third parties without a lawful
                  basis.
                </strong>
              </p>
            </section>

            {/* Fraud & Scam Investigations */}
            <section>
              <h2 className='text-2xl font-semibold mb-4'>
                6. Our Role in Fraud or Scam Investigations
              </h2>
              <p className='text-foreground leading-relaxed mb-4'>
                If you believe you have been the victim of a scam or fraudulent
                activity on our platform, you should report the incident to the
                police or relevant law enforcement authority. If law enforcement
                contacts us as part of an official investigation, we may provide
                relevant documents or information to assist with the
                investigation. We are not a party to transactions between users
                and do not mediate or resolve disputes, but we will cooperate
                with authorities as required by law.
              </p>
            </section>

            {/* Data Security */}
            <section>
              <h2 className='text-2xl font-semibold mb-4'>6. Data Security</h2>
              <p className='text-foreground leading-relaxed mb-4'>
                We implement appropriate technical and organizational measures
                to protect your personal information:
              </p>
              <ul className='list-disc list-inside space-y-2 text-foreground'>
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication measures</li>
                <li>Secure data storage and backup procedures</li>
                <li>Employee training on data protection</li>
              </ul>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className='text-2xl font-semibold mb-4'>7. Data Retention</h2>
              <p className='text-foreground leading-relaxed mb-4'>
                We retain your personal information for as long as necessary to:
              </p>
              <ul className='list-disc list-inside space-y-2 text-foreground'>
                <li>Provide our services to you</li>
                <li>Comply with legal obligations</li>
                <li>Resolve disputes and enforce agreements</li>
                <li>Maintain security and prevent fraud</li>
              </ul>
              <p className='text-foreground leading-relaxed mt-4'>
                When we no longer need your information, we will securely delete
                or anonymize it.
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className='text-2xl font-semibold mb-4'>8. Your Rights</h2>
              <p className='text-foreground leading-relaxed mb-4'>
                You have the following rights regarding your personal
                information:
              </p>
              <ul className='list-disc list-inside space-y-2 text-foreground'>
                <li>
                  <strong>Access:</strong> Request a copy of your personal
                  information
                </li>
                <li>
                  <strong>Correction:</strong> Request correction of inaccurate
                  information
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your personal
                  information
                </li>
                <li>
                  <strong>Portability:</strong> Request transfer of your data to
                  another service
                </li>
                <li>
                  <strong>Restriction:</strong> Request limitation of processing
                </li>
                <li>
                  <strong>Objection:</strong> Object to processing based on
                  legitimate interests
                </li>
                <li>
                  <strong>Withdraw Consent:</strong> Withdraw consent for
                  processing based on consent
                </li>
              </ul>
              <p className='text-foreground leading-relaxed mt-4'>
                To exercise these rights, please contact us at{' '}
                <a
                  href='mailto:privacy@marketplace.com'
                  className='text-blue-600 hover:underline'
                >
                  privacy@marketplace.com
                </a>
              </p>
            </section>

            <section>
              <h2 className='text-2xl font-semibold mb-4'>
                9. Cookies and Similar Technologies
              </h2>
              <p className='text-foreground leading-relaxed mb-4'>
                We use cookies and similar technologies to:
              </p>
              <ul className='list-disc list-inside space-y-2 text-foreground'>
                <li>Remember your preferences and settings</li>
                <li>Analyze how you use our platform</li>
                <li>Provide personalized content and features</li>
                <li>Ensure security and prevent fraud</li>
              </ul>
              <p className='text-foreground leading-relaxed mt-4'>
                You can control cookie settings through your browser
                preferences. However, disabling certain cookies may affect the
                functionality of our platform.
              </p>
            </section>

            <section>
              <h2 className='text-2xl font-semibold mb-4'>
                10. International Data Transfers
              </h2>
              <p className='text-foreground leading-relaxed'>
                Your personal information may be transferred to and processed in
                countries other than your own. We ensure that such transfers
                comply with applicable data protection laws and implement
                appropriate safeguards to protect your information.
              </p>
            </section>

            <section>
              <h2 className='text-2xl font-semibold mb-4'>
                11. Children&apos;s Privacy
              </h2>
              <p className='text-foreground leading-relaxed'>
                Our platform is not intended for children under the age of 18.
                We do not knowingly collect personal information from children
                under 18. If you believe we have collected information from a
                child under 18, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className='text-2xl font-semibold mb-4'>
                12. Changes to This Privacy Policy
              </h2>
              <p className='text-foreground leading-relaxed'>
                We may update this Privacy Policy from time to time. We will
                notify you of significant changes via email or through our
                platform. We encourage you to review this policy periodically to
                stay informed about how we protect your information.
              </p>
            </section>

            <section>
              <h2 className='text-2xl font-semibold mb-4'>
                13. Contact Information
              </h2>
              <p className='text-foreground leading-relaxed'>
                If you have questions about this Privacy Policy or our data
                practices, please contact us at:
              </p>
              <div className='mt-4 space-y-2'>
                <p className='text-foreground'>
                  <strong>Email:</strong>{' '}
                  <a
                    href='mailto:privacy@marketplace.com'
                    className='text-blue-600 hover:underline'
                  >
                    privacy@marketplace.com
                  </a>
                </p>
                <p className='text-foreground'>
                  <strong>Data Protection Officer:</strong>{' '}
                  <a
                    href='mailto:dpo@marketplace.com'
                    className='text-blue-600 hover:underline'
                  >
                    dpo@marketplace.com
                  </a>
                </p>
              </div>
            </section>

            <div className='border-t pt-6 mt-8'>
              <p className='text-sm text-muted-foreground text-center'>
                By using our platform, you acknowledge that you have read and
                understood this Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
