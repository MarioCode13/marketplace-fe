'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function TermsOfUsePage() {
  const router = useRouter()

  return (
    <div className='min-h-screen bg-background'>
      <div className='w-full flex justify-center'>
        <div className='w-full max-w-4xl py-8 px-6'>
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
            <h1 className='text-3xl font-bold'>Terms of Use</h1>
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
                Welcome to our marketplace platform. These Terms of Use govern
                your use of our service and constitute a legally binding
                agreement between you and our platform. By accessing or using
                our service, you agree to be bound by these terms.
              </p>
            </section>

            {/* Platform Role */}
            <section>
              <h2 className='text-2xl font-semibold mb-4'>
                2. Our Role as a Facilitator
              </h2>
              <p className='text-foreground leading-relaxed mb-4'>
                <strong>Important:</strong> We operate as a marketplace
                facilitator, not as a seller. Our role is to provide a platform
                where users can connect to buy and sell items.
              </p>
              <ul className='list-disc list-inside space-y-2 text-foreground'>
                <li>
                  We do not own, sell, or take possession of any items listed on
                  our platform
                </li>
                <li>
                  We do not guarantee the quality, safety, or authenticity of
                  any items
                </li>
                <li>We do not handle payments or shipping between users</li>
                <li>
                  We are not responsible for the delivery or condition of items
                </li>
              </ul>
            </section>

            {/* User Responsibilities */}
            <section>
              <h2 className='text-2xl font-semibold mb-4'>
                3. User Responsibilities
              </h2>
              <p className='text-foreground leading-relaxed mb-4'>
                As a user of our platform, you agree to:
              </p>
              <ul className='list-disc list-inside space-y-2 text-foreground'>
                <li>
                  Provide accurate and truthful information in your listings and
                  profile
                </li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Not list prohibited, illegal, or counterfeit items</li>
                <li>
                  Not engage in fraudulent activities or misrepresentation
                </li>
                <li>Respect other users and their property</li>
                <li>Handle transactions safely and responsibly</li>
                <li>Report suspicious or illegal activities</li>
              </ul>
            </section>

            {/* Prohibited Activities */}
            <section>
              <h2 className='text-2xl font-semibold mb-4'>
                4. Prohibited Activities
              </h2>
              <p className='text-foreground leading-relaxed mb-4'>
                The following activities are strictly prohibited and may result
                in immediate account suspension or termination:
              </p>
              <ul className='list-disc list-inside space-y-2 text-foreground'>
                <li>Fraud, scams, or deceptive practices</li>
                <li>Using fake identification or impersonating others</li>
                <li>Listing counterfeit or stolen items</li>
                <li>Harassment, threats, or abusive behavior</li>
                <li>Spam, unsolicited advertising, or mass messaging</li>
                <li>Attempting to circumvent our verification systems</li>
                <li>Violating intellectual property rights</li>
                <li>Any illegal activities or violations of applicable laws</li>
              </ul>
            </section>

            {/* No Warranties */}
            <section>
              <h2 className='text-2xl font-semibold mb-4'>
                5. No Warranties and Disclaimers
              </h2>
              <p className='text-foreground leading-relaxed mb-4'>
                <strong>Important Disclaimers:</strong>
              </p>
              <ul className='list-disc list-inside space-y-2 text-foreground'>
                <li>
                  We make no warranties about the quality, safety, or
                  authenticity of items
                </li>
                <li>
                  We do not guarantee that items will be delivered or in the
                  described condition
                </li>
                <li>
                  We are not responsible for any losses, damages, or injuries
                  resulting from transactions
                </li>
                <li>Users transact at their own risk</li>
                <li>
                  We do not verify the accuracy of user-provided information
                </li>
              </ul>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className='text-2xl font-semibold mb-4'>
                6. Limitation of Liability
              </h2>
              <p className='text-foreground leading-relaxed mb-4'>
                To the maximum extent permitted by law, our platform shall not
                be liable for:
              </p>
              <ul className='list-disc list-inside space-y-2 text-foreground'>
                <li>
                  Any direct, indirect, incidental, or consequential damages
                </li>
                <li>Loss of profits, data, or business opportunities</li>
                <li>
                  Damages resulting from user transactions or interactions
                </li>
                <li>Security breaches or unauthorized access to user data</li>
                <li>Service interruptions or technical issues</li>
                <li>
                  Any losses or damages resulting from scams or fraudulent
                  activity. In the event of a scam, your recourse is to report
                  the matter to law enforcement. Our role is limited to
                  cooperating with authorities if contacted as part of an
                  official investigation.
                </li>
              </ul>
              <p className='text-foreground leading-relaxed mt-4'>
                Our total liability shall not exceed the amount you paid for our
                services in the twelve months preceding the claim.
              </p>
            </section>

            {/* Dispute Resolution */}
            <section>
              <h2 className='text-2xl font-semibold mb-4'>
                7. Dispute Resolution
              </h2>
              <p className='text-foreground leading-relaxed mb-4'>
                <strong>User Disputes:</strong> We may assist in resolving
                disputes between users, but we are not obligated to do so and
                are not liable for any resolution outcomes. If you believe you
                have been the victim of a scam or fraud, you should report the
                incident to the police. If law enforcement contacts us as part
                of an official investigation, we may provide relevant documents
                or information to assist with the investigation. We are not a
                party to transactions between users and do not mediate or
                resolve disputes, but we will cooperate with authorities as
                required by law.
              </p>
              <ul className='list-disc list-inside space-y-2 text-foreground'>
                <li>Users are responsible for resolving their own disputes</li>
                <li>
                  We may provide tools and guidelines for dispute resolution
                </li>
                <li>Our involvement in disputes is at our sole discretion</li>
                <li>
                  We may suspend or terminate accounts involved in unresolved
                  disputes
                </li>
              </ul>
            </section>

            {/* Account Termination */}
            <section>
              <h2 className='text-2xl font-semibold mb-4'>
                8. Account Termination
              </h2>
              <p className='text-foreground leading-relaxed mb-4'>
                We reserve the right to suspend or terminate accounts for:
              </p>
              <ul className='list-disc list-inside space-y-2 text-foreground'>
                <li>Violation of these Terms of Use</li>
                <li>Fraudulent or illegal activities</li>
                <li>Repeated complaints from other users</li>
                <li>Providing false or misleading information</li>
                <li>Any other reason at our sole discretion</li>
              </ul>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className='text-2xl font-semibold mb-4'>
                9. Changes to Terms
              </h2>
              <p className='text-foreground leading-relaxed'>
                We may update these Terms of Use from time to time. We will
                notify users of significant changes via email or through our
                platform. Continued use of our service after changes constitutes
                acceptance of the new terms.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className='text-2xl font-semibold mb-4'>
                10. Contact Information
              </h2>
              <p className='text-foreground leading-relaxed'>
                If you have questions about these Terms of Use, please contact
                us at:{' '}
                <a
                  href='mailto:legal@marketplace.com'
                  className='text-blue-600 hover:underline'
                >
                  legal@marketplace.com
                </a>
              </p>
            </section>

            {/* Footer */}
            <div className='border-t pt-6 mt-8'>
              <p className='text-sm text-muted-foreground text-center'>
                By using our platform, you acknowledge that you have read,
                understood, and agree to be bound by these Terms of Use.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
