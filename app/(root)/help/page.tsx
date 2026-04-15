import Link from 'next/link'
import { BackButton } from '@/components/BackButton'
import { HelpFAQ } from '@/components/HelpFAQ'

const faqItems = [
  // Account & Sign-up
  {
    category: 'Account & Sign-up',
    question: 'What types of accounts can I create?',
    answer:
      "You can create either a Personal Account for individual buying and selling, or a Business Account for managing a store. Choose your account type during registration. You cannot switch between account types—if you need both, you'll need to register separate accounts with different email addresses.",
  },
  {
    category: 'Account & Sign-up',
    question: 'How do I verify my account?',
    answer:
      'Account verification helps build trust on our platform. You may need to provide a valid government ID, proof of address, or other documents depending on your user type and activity level. Verified users can create more listings and access additional features.',
  },
  {
    category: 'Account & Sign-up',
    question: 'Can I delete my account?',
    answer:
      'Yes, you can delete your personal account anytime. For business accounts, only the owner can delete the account. When you delete an account, all associated listings and data are permanently removed. We cannot recover deleted accounts.',
  },
  {
    category: 'Account & Sign-up',
    question: 'How do I change my password?',
    answer:
      'You can change your password in your Account Settings. If you forgot your password, click "Forgot Password" on the login page and follow the email instructions to reset it.',
  },

  // Listings
  {
    category: 'Listings',
    question: 'What are listing limits?',
    answer:
      'Listing limits depend on your account type: Free Users can create up to 3 listings, Verified Users up to 8, Resellers up to 20, and Pro Store business accounts have unlimited listings (requires active subscription). If you reach your limit, delete or mark items as sold to create new listings.',
  },
  {
    category: 'Listings',
    question: 'How do I create a listing?',
    answer:
      'Go to the "Create Listing" or "Sell" section. Upload clear photos, write an accurate description, set a price, and specify your location. For business accounts, make sure your subscription is active. Review your listing before publishing—once live, other users can see and contact you about the item.',
  },
  {
    category: 'Listings',
    question: 'What items can I list?',
    answer:
      'You can list most items for sale. Prohibited items include illegal goods, counterfeit products, stolen items, weapons, and hazardous materials. If you list a prohibited item, it will be removed and your account may face suspension. Always comply with local laws regarding what you can sell.',
  },
  {
    category: 'Listings',
    question: 'How do I mark an item as sold?',
    answer:
      'Once you\'ve sold an item, visit the listing and click "Mark as Sold." This removes it from active listings. The listing history remains in your account for reference but is no longer visible to buyers.',
  },
  {
    category: 'Listings',
    question: 'Can I edit a listing after posting?',
    answer:
      'Yes, you can edit your listing descriptions, photos, and prices at any time before marking it as sold. For business accounts, contributors cannot edit business details or store branding, only listing content.',
  },

  // Business Accounts
  {
    category: 'Business Accounts',
    question: 'What is a business account?',
    answer:
      'A business account allows you to create a branded store, upload unlimited listings (with a Pro Store subscription), and manage a team. All listings belong to the business, not individuals. Business accounts are ideal for resellers, shops, and bulk sellers.',
  },
  {
    category: 'Business Accounts',
    question: 'Do I need a subscription for my business account?',
    answer:
      'A free business account lets you set up your profile and branding, but you cannot create listings or access your public store URL. To sell, you need a Pro Store subscription. Subscriptions are automatically renewed based on your billing cycle.',
  },
  {
    category: 'Business Accounts',
    question: 'What happens when my business subscription expires?',
    answer:
      "When a subscription expires, your business and all listings are automatically archived. You have 14 days to renew your subscription. If you renew within 14 days, everything is restored. If you don't renew, your business account and listings are permanently deleted after 14 days.",
  },
  {
    category: 'Business Accounts',
    question: 'How do I invite team members to my business?',
    answer:
      "As a business owner, go to Team Management and enter the email or username of a registered user on our platform. They'll receive an invitation notification. Once they accept, they'll be assigned a role (Owner, Manager, or Contributor) with specific permissions. Role assignments do not require their consent but they'll be notified.",
  },
  {
    category: 'Business Accounts',
    question: 'What are the different team roles?',
    answer:
      'Owner: Full permissions including account deletion, all business settings, and team management. Manager: Can manage listings, edit store branding (except slug), and invite users. Contributor: Can create and manage listings only. Only the owner can delete the business account.',
  },
  {
    category: 'Business Accounts',
    question: 'Can team members be removed from a business?',
    answer:
      'Yes, only the owner or manager can remove team members. When removed, the user loses access to business listings and management immediately. They keep their personal account but are no longer part of the business team.',
  },

  // Buying & Selling
  {
    category: 'Buying & Selling',
    question: 'How do I contact a seller?',
    answer:
      'Click "Contact Seller" on any listing to send a message. The seller can respond through the messaging system. Keep communication respectful and use the platform for transaction planning. Never share payment methods in messages.',
  },
  {
    category: 'Buying & Selling',
    question: 'How are transactions handled?',
    answer:
      'Transactions are between buyers and sellers directly—we are a marketplace facilitator and do not handle payments or shipping. Arrange payment and delivery directly with the other party. We recommend meeting in safe public locations for in-person sales.',
  },
  {
    category: 'Buying & Selling',
    question: "What should I do if I'm scammed?",
    answer:
      'If you believe you are a victim of fraud or scam, report it immediately to local law enforcement and provide them with evidence. You can also report the seller\'s account to us through the "Report User" feature, and we will cooperate with authorities if contacted as part of an official investigation.',
  },
  {
    category: 'Buying & Selling',
    question: 'Can I dispute a transaction?',
    answer:
      'We facilitate dispute resolution but are not responsible for transaction outcomes. Users are responsible for resolving disputes directly. If you cannot reach an agreement, report the issue to us and we may help mediate, but resolution is not guaranteed.',
  },

  // Verification & Safety
  {
    category: 'Verification & Safety',
    question: 'Why do I need to verify my identity?',
    answer:
      "Identity verification helps prevent fraud and builds trust in the marketplace. It's required for certain activities and account types. We protect your identifying information and only share it with team members of your business account or law enforcement if required.",
  },
  {
    category: 'Verification & Safety',
    question: 'How is my personal information protected?',
    answer:
      'We use encryption, secure storage, and access controls to protect your data. We never sell your personal information. Your identifying documents are not visible to other users. For more details, please review our Privacy Policy.',
  },
  {
    category: 'Verification & Safety',
    question: 'What should I do to stay safe?',
    answer:
      'Never share payment methods, banking details, or personal documents through messages. Meet in safe, public locations for transactions. Verify item listings with photos and detailed descriptions. Report suspicious activity. Trust your instincts—if something feels wrong, it probably is.',
  },
  {
    category: 'Verification & Safety',
    question: 'What happens if I violate the Terms of Use?',
    answer:
      'Violations can result in account suspension or termination. Serious violations like fraud, illegal activities, or impersonation lead to immediate bans. Repeated violations from multiple warnings may also result in account closure. Terminated accounts cannot be restored.',
  },

  // Payments & Subscriptions
  {
    category: 'Payments & Subscriptions',
    question: 'What payment methods do you accept?',
    answer:
      'Payment methods are handled between you and your payment processor. For business subscriptions, we accept major credit cards and other payment methods through our payment partner. Check your Account Settings or subscription page for available options.',
  },
  {
    category: 'Payments & Subscriptions',
    question: 'How do I manage my subscription?',
    answer:
      'Go to your Account Settings and find the Subscription section. You can view your current plan, renewal date, update payment methods, and renew or cancel anytime. Changes take effect on your next billing cycle.',
  },
  {
    category: 'Payments & Subscriptions',
    question: 'Can I get a refund?',
    answer:
      'Subscription refunds are subject to our refund policy. For details on cancellations or refunds, contact our support team. Please note that if your business subscription expires and you delete your account, archived listings cannot be recovered.',
  },

  // Technical Issues
  {
    category: 'Technical Issues',
    question: "Why can't I upload photos to my listing?",
    answer:
      'Check your file size—images should be under 10MB. Supported formats are JPG, PNG, and GIF. Try refreshing the page or clearing your browser cache. If problems persist, try a different browser or contact support.',
  },
  {
    category: 'Technical Issues',
    question: 'I forgot my password. How do I reset it?',
    answer:
      'Click "Forgot Password" on the login page, enter your email, and follow the reset link sent to your inbox. If you don\'t receive the email, check your spam folder or contact support for help.',
  },
  {
    category: 'Technical Issues',
    question: 'Why am I seeing an error message?',
    answer:
      "Error messages appear when something needs your attention. Common causes include reaching listing limits, subscription expiration, or incomplete profile information. Read the error carefully and follow the suggested steps. If you're unsure, contact support.",
  },
]

export default function HelpPage() {
  return (
    <div className='min-h-screen bg-background'>
      <div className='w-full flex justify-center'>
        <div className='w-full max-w-4xl py-8 px-6'>
          {/* Header */}
          <div className='flex items-center gap-4 mb-8'>
            <BackButton />
            <h1 className='text-3xl font-bold'>Help Center</h1>
          </div>

          <div className='bg-componentBackground rounded-lg p-8 shadow-lg space-y-8'>
            {/* Introduction */}
            <section className='border-b pb-6'>
              <p className='text-foreground leading-relaxed'>
                Welcome to our Help Center! Find answers to common questions
                about accounts, listings, buying, selling, and using our
                marketplace platform. If you can&apos;t find what you&apos;re
                looking for, scroll to the bottom for contact information.
              </p>
            </section>

            <HelpFAQ faqItems={faqItems} />

            {/* Contact Section */}
            <section className='border-t pt-8'>
              <h2 className='text-2xl font-semibold mb-4'>Still Need Help?</h2>
              <p className='text-foreground leading-relaxed mb-4'>
                If you didn&apos;t find the answer to your question, please
                reach out to our support team. We&apos;re here to help!
              </p>
              <div className='space-y-3'>
                <p className='text-foreground'>
                  <strong>Email:</strong>{' '}
                  <a
                    href='mailto:info@dealio.org.za'
                    className='text-blue-600 hover:underline'
                  >
                    info@dealio.org.za
                  </a>
                </p>
                <p className='text-foreground'>
                  <strong>Response time:</strong> We typically respond to
                  inquiries within 24-48 hours during business days.
                </p>
              </div>
            </section>

            {/* Footer */}
            <div className='border-t pt-6 mt-8'>
              <p className='text-sm text-muted-foreground text-center'>
                For legal information, visit our{' '}
                <Link
                  href='/privacy'
                  className='text-blue-600 hover:underline'
                >
                  Privacy Policy
                </Link>{' '}
                and{' '}
                <Link
                  href='/terms'
                  className='text-blue-600 hover:underline'
                >
                  Terms of Use
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
