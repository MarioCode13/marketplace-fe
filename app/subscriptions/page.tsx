'use client'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { RootState } from '@/store/store'
import { ShieldCheck, User, Store, Star, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useQuery } from '@apollo/client'
import { GET_ME } from '@/lib/graphql/queries/getMe'

const tiers = [
  {
    name: 'Free User',
    price: 'R0/mo',
    icon: User,
    accountType: 'Personal',
    features: [
      'Browse all listings',
      'Create up to 3 listings',
      'Basic trust rating',
      'Community support',
      'Contact sellers directly',
    ],
    limitations: [
      'No verification badge',
      'Limited listing visibility',
      'Basic search ranking',
      'Maximum 3 active listings',
    ],
    highlight: false,
    badge: undefined,
    isSetupOnly: false,
  },
  {
    name: 'Verified User',
    price: 'R49/mo',
    icon: ShieldCheck,
    accountType: 'Personal',
    features: [
      'All Free User features',
      'Verified badge & trust boost',
      'Create up to 8 listings',
      'Priority in search results',
      'Document verification',
      'Enhanced buyer protection',
      'Priority support',
    ],
    limitations: ['Maximum 8 active listings'],
    highlight: false,
    badge: undefined,
    isSetupOnly: false,
  },
  {
    name: 'Reseller',
    price: 'R99/mo',
    icon: Store,
    accountType: 'Business',
    features: [
      'Business account with basic branding',
      'Create up to 20 listings',
      'Business verification badge',
      'Basic store customization',
      'Business analytics dashboard',
      'Single user (owner only)',
      'Business contact details display',
    ],
    limitations: [
      'Maximum 20 active listings',
      'No team members allowed',
      'Limited branding customization',
      'Basic analytics only',
    ],
    highlight: false,
    badge: undefined,
    isSetupOnly: false,
  },
  {
    name: 'Pro Store',
    price: 'R299/mo',
    icon: Star,
    accountType: 'Business',
    features: [
      'Unlimited listings',
      'Full custom branding & storefront',
      'Custom store URL (slug)',
      'Team collaboration (unlimited members)',
      'Advanced role management (Owner, Manager, Contributor)',
      'Advanced analytics & insights',
      'Featured placement opportunities',
      'Priority support',
      'Business invitation system',
    ],
    limitations: [],
    highlight: true,
    badge: 'Most Popular',
    isSetupOnly: false,
  },
]

export default function SubscriptionsPage() {
  const [loadingTier, setLoadingTier] = useState<string | null>(null)
  const JWT = useSelector((state: RootState) => state.auth.token)
  const { data: meData } = useQuery(GET_ME)
  const userEmail = meData?.me?.email || ''
  const isLoggedIn = !!JWT && !!meData?.me

  const handleSubscribe = async (tier: (typeof tiers)[0]) => {
    // Free plan doesn't require payment
    if (tier.name === 'Free User') {
      // Handle free plan selection (redirect to registration or account setup)
      return
    }

    setLoadingTier(tier.name)
    let recurringAmount = '0.00'
    let planType = ''

    if (tier.name === 'Verified User') {
      recurringAmount = '49.00'
      planType = 'verified_user'
    }
    if (tier.name === 'Reseller') {
      recurringAmount = '99.00'
      planType = 'reseller'
    }
    if (tier.name === 'Pro Store') {
      recurringAmount = '299.00'
      planType = 'pro_store'
    }

    try {
      const params = new URLSearchParams({
        itemName: tier.name + ' Subscription',
        amount: recurringAmount,
        recurringAmount,
        frequency: '3', // monthly
        cycles: '0', // indefinite
        planType,
        userEmail,
      })
      const res = await fetch(
        `http://localhost:8080/api/payments/payfast/subscription-url?${params.toString()}`,
        {
          credentials: 'include', // if using cookies for auth
          headers: {
            Authorization: `Bearer ${JWT}`,
          },
        }
      )
      const url = await res.text()
      window.location.href = url
    } catch (e) {
      alert(
        'Failed to initiate payment. Please try again. ' + (e as Error).message
      )
    } finally {
      setLoadingTier(null)
    }
  }

  return (
    <div className='min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 py-12 px-4'>
      <h1 className='text-4xl font-extrabold mb-2 text-center text-gray-900 dark:text-white drop-shadow-sm'>
        Choose Your Plan
      </h1>
      <p className='text-center text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto'>
        Whether you&apos;re an individual seller or a growing business, we have
        the perfect plan to help you succeed in the marketplace.
      </p>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-10'>
        {tiers.map((tier) => {
          const Icon = tier.icon
          const isPaid = tier.name !== 'Free User'
          return (
            <div
              key={tier.name}
              className={`relative flex flex-col justify-between items-center rounded-2xl shadow-xl p-6 bg-componentBackground border transition-transform duration-200 hover:scale-105 ${
                tier.highlight
                  ? 'border-blue-600 dark:border-blue-400 ring-2 ring-blue-200 dark:ring-blue-900 z-10 '
                  : 'border-gray-200 dark:border-gray-800'
              }`}
              style={tier.highlight ? { minHeight: 480 } : { minHeight: 460 }}
            >
              <div>
                {tier.badge && (
                  <span className='absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 dark:bg-blue-500 text-white text-xs font-semibold px-4 py-1 rounded-xl shadow-lg z-20'>
                    {tier.badge}
                  </span>
                )}
                <div
                  className={`mb-4 flex items-center justify-center w-16 h-16 rounded-full ${
                    tier.highlight
                      ? 'bg-blue-100 dark:bg-blue-900'
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  <Icon
                    className={`w-8 h-8 ${
                      tier.highlight
                        ? 'text-blue-600 dark:text-blue-300'
                        : 'text-gray-500 dark:text-gray-300'
                    }`}
                  />
                </div>
                <h2
                  className={`text-2xl font-bold mb-1 ${
                    tier.highlight
                      ? 'text-blue-700 dark:text-blue-300'
                      : 'text-gray-800 dark:text-white'
                  }`}
                >
                  {tier.name}
                </h2>
                <div
                  className={`text-sm font-medium mb-2 ${
                    tier.accountType === 'Business'
                      ? 'text-purple-600 dark:text-purple-400'
                      : 'text-blue-600 dark:text-blue-400'
                  }`}
                >
                  {tier.accountType} Account
                </div>
                <div className='text-3xl font-extrabold mb-4 text-gray-900 dark:text-white'>
                  {tier.price}
                </div>
                <div className='mb-6'>
                  <h4 className='font-semibold text-green-600 dark:text-green-400 mb-2'>
                    ✓ Included Features
                  </h4>
                  <ul className='text-gray-700 dark:text-gray-200 text-sm space-y-1'>
                    {tier.features.map((feature) => (
                      <li
                        key={feature}
                        className='flex items-start'
                      >
                        <span className='mr-2 text-green-500 dark:text-green-400 mt-0.5'>
                          •
                        </span>
                        <span className='flex-1'>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {tier.limitations && tier.limitations.length > 0 && (
                  <div className='mb-6'>
                    <h4 className='font-semibold text-orange-600 dark:text-orange-400 mb-2'>
                      ⚠ Limitations
                    </h4>
                    <ul className='text-gray-600 dark:text-gray-300 text-sm space-y-1'>
                      {tier.limitations.map((limitation) => (
                        <li
                          key={limitation}
                          className='flex items-start'
                        >
                          <span className='mr-2 text-orange-500 dark:text-orange-400 mt-0.5'>
                            •
                          </span>
                          <span className='flex-1'>{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        disabled={!isLoggedIn || loadingTier === tier.name}
                        variant={tier.highlight ? 'contained' : 'outlined'}
                        className={`w-full py-2 text-base ${
                          tier.highlight
                            ? 'bg-blue-600 dark:bg-blue-700 text-white'
                            : ''
                        } ${
                          !isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={() => handleSubscribe(tier)}
                      >
                        {loadingTier === tier.name
                          ? 'Redirecting...'
                          : isPaid
                          ? 'Subscribe'
                          : 'Current Plan'}
                      </Button>
                    </div>
                  </TooltipTrigger>
                  {!isLoggedIn && (
                    <TooltipContent>
                      <p>Please create an account first</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>
          )
        })}
      </div>
      {/* Account Type Explanation */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12'>
        <div className='bg-componentBackground p-6 rounded-xl border border-gray-200 dark:border-gray-700'>
          <div className='flex items-center gap-3 mb-3'>
            <User className='w-6 h-6 text-blue-500' />
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
              Personal Accounts
            </h3>
          </div>
          <p className='text-gray-600 dark:text-gray-300 text-sm'>
            For individual sellers and casual users. Create personal listings.
            Cannot be used for business purposes or team collaboration.
          </p>
        </div>
        <div className='bg-componentBackground p-6 rounded-xl border border-gray-200 dark:border-gray-700'>
          <div className='flex items-center gap-3 mb-3'>
            <Store className='w-6 h-6 text-purple-500' />
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
              Business Accounts
            </h3>
          </div>
          <p className='text-gray-600 dark:text-gray-300 text-sm'>
            For businesses and professional sellers. All listings belong to the
            business. Sign up and create a business profile with the reseller or
            pro store options.
          </p>
        </div>
      </div>

      {/* Account Creation Section */}
      {!isLoggedIn && (
        <div className='mt-16 max-w-4xl mx-auto'>
          <div className='text-center mb-8'>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
              Ready to Get Started?
            </h2>
            <p className='text-gray-600 dark:text-gray-300'>
              Create your account to begin selling in the marketplace
            </p>
          </div>

          <div className='flex justify-center '>
            <div className='bg-componentBackground p-6 w-full rounded-xl border border-gray-200 dark:border-gray-700 text-center max-w-[300px]'>
              <div className='flex justify-center mb-4'>
                <div className='w-16 h-16 bg-blue-200 dark:bg-blue-900 rounded-full flex items-center justify-center'>
                  <UserPlus className='w-8 h-8 text-blue-600 dark:text-blue-300' />
                </div>
              </div>
              <Button
                variant='outlined'
                onClick={() => (window.location.href = '/register')}
              >
                Create Account
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
