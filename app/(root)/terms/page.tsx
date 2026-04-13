'use client'

import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/Container'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function TermsOfUsePage() {
  const router = useRouter()

  return (
    <div className='min-h-screen bg-background'>
      <Container className='py-8'>
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
            {new Date('04-12-2026').toLocaleDateString('en-US', {
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
              your use of our service and constitute a legally binding agreement
              between you and our platform. By accessing or using our service,
              you agree to be bound by these terms.
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
              where users can connect to buy and sell items, and where
              businesses can manage their stores.
            </p>
            <ul className='list-disc list-inside space-y-2 text-foreground'>
              <li>
                We do not own, sell, or take possession of any items listed on
                our platform
              </li>
              <li>
                We do not guarantee the quality, safety, or authenticity of any
                items
              </li>
              <li>We do not handle payments or shipping between users</li>
              <li>
                We are not responsible for the delivery or condition of items
              </li>
            </ul>
          </section>

          {/* Account Types */}
          <section>
            <h2 className='text-2xl font-semibold mb-4'>2.1 Account Types</h2>
            <p className='text-foreground leading-relaxed mb-4'>
              Our platform offers two types of accounts:
            </p>

            <h3 className='text-lg font-medium mb-3 mt-4'>Personal Account</h3>
            <ul className='list-disc list-inside space-y-2 text-foreground mb-4'>
              <li>For individual users buying and selling items</li>
              <li>Listings are owned by the individual user</li>
              <li>Subject to user type listing limits (see Section 2.3)</li>
              <li>Cannot manage team members</li>
              <li>Cannot access multi-user business features</li>
            </ul>

            <h3 className='text-lg font-medium mb-3'>Business Account</h3>
            <ul className='list-disc list-inside space-y-2 text-foreground'>
              <li>
                For businesses and bulk sellers to manage store presence and
                inventory
              </li>
              <li>Listings are owned by the business, not individual users</li>
              <li>
                <strong>Requires subscription to access full features</strong>
                (see Section 2.2)
              </li>
              <li>Supports team management with multiple user roles</li>
              <li>Includes customizable store front and branding options</li>
            </ul>
          </section>

          {/* Business Subscriptions */}
          <section>
            <h2 className='text-2xl font-semibold mb-4'>
              2.2 Business Subscriptions
            </h2>
            <p className='text-foreground leading-relaxed mb-4'>
              Business accounts operate under a subscription model:
            </p>
            <ul className='list-disc list-inside space-y-2 text-foreground mb-4'>
              <li>
                <strong>Free Business Account:</strong> Can customize your
                business profile but cannot create listings or access your
                public store URL
              </li>
              <li>
                <strong>Pro Store Subscription:</strong> Required to create
                listings, manage inventory, and operate a public store with
                unlimited listing capacity
              </li>
              <li>
                When a subscription expires, the business and all associated
                listings are automatically archived
              </li>
              <li>
                Archived businesses cannot create or edit listings, and their
                store URL becomes inaccessible
              </li>
              <li>
                Archived listings and businesses are permanently deleted after
                14 days unless the subscription is renewed
              </li>
              <li>
                If a subscription is renewed within 14 days, the business and
                listings are automatically restored
              </li>
            </ul>
          </section>

          {/* User Types and Listing Limits */}
          <section>
            <h2 className='text-2xl font-semibold mb-4'>
              2.3 User Types and Listing Limits
            </h2>
            <p className='text-foreground leading-relaxed mb-4'>
              Personal accounts with different user types have different listing
              limits:
            </p>
            <ul className='list-disc list-inside space-y-2 text-foreground mb-4'>
              <li>
                <strong>Free User:</strong> Up to 3 active listings at any time
              </li>
              <li>
                <strong>Verified User:</strong> Up to 8 active listings at any
                time
              </li>
              <li>
                <strong>Reseller:</strong> Up to 20 active listings at any time
              </li>
              <li>
                <strong>Pro Store:</strong> Unlimited listings (business account
                with active subscription)
              </li>
            </ul>
            <p className='text-foreground leading-relaxed mt-4'>
              If you attempt to create a listing beyond your limit, the creation
              will be rejected with an error message. You must delete or mark
              existing listings as sold to create new ones within your limit.
            </p>
          </section>

          {/* User Responsibilities */}
          <section>
            <h2 className='text-2xl font-semibold mb-4'>
              3. User Responsibilities
            </h2>
            <p className='text-foreground leading-relaxed mb-4'>
              As a user of our platform, you agree to:
            </p>
            <ul className='list-disc list-inside space-y-2 text-foreground mb-4'>
              <li>
                Provide accurate and truthful information in your listings and
                profile
              </li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Not list prohibited, illegal, or counterfeit items</li>
              <li>Not engage in fraudulent activities or misrepresentation</li>
              <li>Respect other users and their property</li>
              <li>Handle transactions safely and responsibly</li>
              <li>Report suspicious or illegal activities</li>
              <li>
                Respect the confidentiality of business information if you are a
                team member of a business account
              </li>
              <li>
                Act in good faith when accepting business account invitations
                and managing team roles
              </li>
            </ul>
          </section>

          {/* Business Account Team Management */}
          <section>
            <h2 className='text-2xl font-semibold mb-4'>
              3.1 Business Account Team Management
            </h2>
            <p className='text-foreground leading-relaxed mb-4'>
              If you are part of a business account, you acknowledge the
              following:
            </p>
            <ul className='list-disc list-inside space-y-2 text-foreground mb-4'>
              <li>
                Business owners can invite registered users to join the business
                team
              </li>
              <li>
                Invitations are sent through in-app notifications and require
                explicit acceptance
              </li>
              <li>
                Team members are assigned roles with specific permissions:
                <ul className='list-disc list-inside ml-6 mt-2'>
                  <li>
                    <strong>Owner:</strong> Full permissions including account
                    deletion, all business management, and team management
                  </li>
                  <li>
                    <strong>Manager:</strong> Can manage listings, edit store
                    branding (except slug), and invite users
                  </li>
                  <li>
                    <strong>Contributor:</strong> Can create and manage listings
                    only
                  </li>
                </ul>
              </li>
              <li>
                Role assignments do not require your consent but notifications
                will be sent
              </li>
              <li>You can decline business invitations at any time</li>
            </ul>
          </section>

          {/* Prohibited Activities */}
          <section>
            <h2 className='text-2xl font-semibold mb-4'>
              4. Prohibited Activities
            </h2>
            <p className='text-foreground leading-relaxed mb-4'>
              The following activities are strictly prohibited and may result in
              immediate account suspension or termination:
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
              <li>
                For business accounts: unauthorized team member access or role
                manipulation
              </li>
              <li>
                For business accounts: attempting to remove subscription
                requirements or access features without active subscription
              </li>
              <li>
                Abusing invitations or business account features to deceive
                other users
              </li>
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
                We make no warranties about the quality, safety, or authenticity
                of items
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
              <li>
                We do not guarantee uninterrupted service or availability of
                business store features
              </li>
              <li>
                We are not responsible for data loss resulting from service
                interruptions or archival of listings
              </li>
              <li>
                Business account subscriptions are subject to our terms and
                conditions of service
              </li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className='text-2xl font-semibold mb-4'>
              6. Limitation of Liability
            </h2>
            <p className='text-foreground leading-relaxed mb-4'>
              To the maximum extent permitted by law, our platform shall not be
              liable for:
            </p>
            <ul className='list-disc list-inside space-y-2 text-foreground'>
              <li>
                Any direct, indirect, incidental, or consequential damages
              </li>
              <li>Loss of profits, data, or business opportunities</li>
              <li>Damages resulting from user transactions or interactions</li>
              <li>Security breaches or unauthorized access to user data</li>
              <li>Service interruptions or technical issues</li>
              <li>
                Any losses or damages resulting from scams or fraudulent
                activity. In the event of a scam, your recourse is to report the
                matter to law enforcement. Our role is limited to cooperating
                with authorities if contacted as part of an official
                investigation.
              </li>
              <li>
                Archival or deletion of business accounts and listings due to
                expired subscriptions or non-renewal within the 14-day grace
                period
              </li>
              <li>
                Suspension or termination of business accounts due to violation
                of these Terms
              </li>
              <li>
                Any consequences of role changes, team member removals, or
                business account management decisions
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
              disputes between users, but we are not obligated to do so and are
              not liable for any resolution outcomes. If you believe you have
              been the victim of a scam or fraud, you should report the incident
              to the police. If law enforcement contacts us as part of an
              official investigation, we may provide relevant documents or
              information to assist with the investigation. We are not a party
              to transactions between users and do not mediate or resolve
              disputes, but we will cooperate with authorities as required by
              law.
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
              <li>
                Business account disputes are subject to the same restrictions
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
            <ul className='list-disc list-inside space-y-2 text-foreground mb-4'>
              <li>Violation of these Terms of Use</li>
              <li>Fraudulent or illegal activities</li>
              <li>Repeated complaints from other users</li>
              <li>Providing false or misleading information</li>
              <li>Any other reason at our sole discretion</li>
            </ul>

            <h3 className='text-lg font-medium mb-3'>
              Business Account Archival and Deletion
            </h3>
            <p className='text-foreground leading-relaxed mb-4'>
              Business accounts are subject to the following archival and
              deletion policies:
            </p>
            <ul className='list-disc list-inside space-y-2 text-foreground'>
              <li>
                When a subscription expires, the business account and all
                associated listings are automatically archived
              </li>
              <li>Archived accounts cannot create, edit, or manage listings</li>
              <li>Archived store URLs become inaccessible to the public</li>
              <li>
                Archived accounts have a 14-day grace period to renew their
                subscription
              </li>
              <li>
                If a subscription is renewed within the 14-day period, the
                business and listings are automatically restored
              </li>
              <li>
                If a subscription is not renewed within 14 days, the business
                account and all associated listings are permanently deleted
              </li>
              <li>
                Only the business owner can renew a subscription or delete the
                account
              </li>
            </ul>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className='text-2xl font-semibold mb-4'>
              9. Business Data Ownership and Responsibility
            </h2>
            <p className='text-foreground leading-relaxed mb-4'>
              For business accounts, please note the following regarding data
              ownership and responsibility:
            </p>
            <ul className='list-disc list-inside space-y-2 text-foreground mb-6'>
              <li>
                All listings created on a business account are owned by the
                business, not the individual user who created them
              </li>
              <li>
                The business owner (OWNER role) is responsible for all business
                account activities
              </li>
              <li>
                All team members with access to the business account share
                responsibility for compliance with these Terms
              </li>
              <li>
                The business owner is responsible for all data associated with
                the business account, including billing and subscription
                management
              </li>
              <li>
                <strong>Backup Responsibility:</strong> You are responsible for
                maintaining backups of your business data. We are not obligated
                to provide access to archived or deleted account data
              </li>
            </ul>
          </section>

          {/* Subscription Refunds and Cancellations */}
          <section>
            <h2 className='text-2xl font-semibold mb-4'>
              10. Subscription Refunds and Cancellations
            </h2>
            <p className='text-foreground leading-relaxed mb-4'>
              <strong>Subscriptions are non-refundable.</strong> All business
              account subscriptions are paid in advance for a specified billing
              period. Once purchased, subscription fees cannot be refunded,
              including for partial months or unused service time.
            </p>

            <h3 className='text-lg font-medium mb-3'>Cancellation</h3>
            <p className='text-foreground leading-relaxed mb-4'>
              You can cancel your subscription at any time through your Account
              Settings. Cancellation takes effect at the end of your current
              billing period. You will continue to have access to all Pro Store
              features until your subscription expires.
            </p>
            <ul className='list-disc list-inside space-y-2 text-foreground mb-4'>
              <li>
                Cancellation is final—you may be charged again if you renew
                later
              </li>
              <li>
                No refund is issued for the remainder of your current billing
                period
              </li>
              <li>
                After cancellation, your business will be archived at the end of
                your billing cycle
              </li>
            </ul>

            <h3 className='text-lg font-medium mb-3'>Renewal and Billing</h3>
            <ul className='list-disc list-inside space-y-2 text-foreground mb-4'>
              <li>
                Subscriptions renew automatically on your renewal date using
                your saved payment method
              </li>
              <li>
                You will receive a renewal notification before you are charged
              </li>
              <li>
                If payment fails, you will have a grace period to update your
                payment method before your subscription is cancelled
              </li>
              <li>
                Currency and pricing may change based on your location and
                payment method
              </li>
            </ul>

            <h3 className='text-lg font-medium mb-3'>Disputed Charges</h3>
            <p className='text-foreground leading-relaxed'>
              If you believe you were charged in error, contact us at{' '}
              <a
                href='mailto:info@dealio.org.za'
                className='text-blue-600 hover:underline'
              >
                info@dealio.org.za
              </a>{' '}
              within 30 days of the charge with supporting documentation. We
              will investigate and respond within 10 business days. Chargebacks
              and payment disputes reported to your payment provider may result
              in account suspension.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className='text-2xl font-semibold mb-4'>
              11. Changes to Terms
            </h2>
            <p className='text-foreground leading-relaxed'>
              We may update these Terms of Use from time to time. We will notify
              users of significant changes via email or through our platform.
              Continued use of our service after changes constitutes acceptance
              of the new terms.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className='text-2xl font-semibold mb-4'>
              12. Contact Information
            </h2>
            <p className='text-foreground leading-relaxed'>
              If you have questions about these Terms of Use, please contact us
              at:{' '}
              <a
                href='mailto:info@dealio.org.za'
                className='text-blue-600 hover:underline'
              >
                info@dealio.org.za
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
      </Container>
    </div>
  )
}
