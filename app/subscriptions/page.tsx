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
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useSelector } from 'react-redux'

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
    name: 'User +',
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
    price: 'R149/mo',
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
  const userContext = useSelector((state: RootState) => state.userContext)
  const router = useRouter()
  const userEmail = userContext.email || ''
  const isLoggedIn = !!userContext.userId
  const userPlanType = userContext.planType || ''
  const businessPlanType = userContext.business?.planType || ''

  const handleSubscribe = async (tier: (typeof tiers)[0]) => {
    if (tier.name === 'Free User') {
      return
    }

    setLoadingTier(tier.name)
    let recurringAmount = '0.00'
    let planType = ''

    if (tier.name === 'Seller +') {
      recurringAmount = '49.00'
      planType = 'seller_plus'
    }
    if (tier.name === 'Reseller') {
      recurringAmount = '149.00'
      planType = 'reseller'
    }
    if (tier.name === 'Pro Store') {
      recurringAmount = '299.00'
      planType = 'pro_store'
    }

    try {
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL ||
        process.env.NEXT_PUBLIC_API_BASE ||
        ''
      const isLocal =
        typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' ||
          window.location.hostname === '127.0.0.1' ||
          apiBase.includes('localhost') ||
          process.env.NODE_ENV === 'development')

      if (isLocal) {
        // Local activation endpoint - backend activates subscription immediately
        // Try to obtain CSRF token (from cookie or csrf endpoint) and POST to activate
        const getCookie = (name: string) => {
          if (typeof document === 'undefined') return null
          const match = document.cookie.match(
            new RegExp('(^| )' + name + '=([^;]+)'),
          )
          return match ? decodeURIComponent(match[2]) : null
        }

        let csrfToken =
          getCookie('csrfToken') ||
          getCookie('XSRF-TOKEN') ||
          getCookie('csrf') ||
          getCookie('csrf_token') ||
          getCookie('CSRF-TOKEN')
        if (!csrfToken) {
          try {
            const tokenRes = await fetch(`${apiBase}/api/auth/csrf`, {
              credentials: 'include',
            })
            if (tokenRes.ok) {
              const tokenJson = await tokenRes.json()
              csrfToken =
                tokenJson?.csrfToken ||
                tokenJson?.csrf_token ||
                tokenJson?.token ||
                tokenJson?.xsrfToken ||
                tokenJson?.xsrf_token ||
                csrfToken
            }
          } catch (err) {
            console.error('Failed to retrieve CSRF token:', err)
            // ignore - we'll attempt without token and show server error if it fails
          }
        }

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        }
        if (csrfToken) {
          headers['X-CSRF-Token'] = csrfToken
          headers['X-XSRF-TOKEN'] = csrfToken
        }
        if (isLocal) console.debug('CSRF token used for activation:', csrfToken)

        const res = await fetch(
          `${apiBase}/api/payments/payfast/subscription-activate`,
          {
            method: 'POST',
            credentials: 'include',
            headers,
            body: JSON.stringify({
              planType,
              itemName: tier.name + ' Subscription',
              amount: recurringAmount,
            }),
          },
        )

        // If the POST returned 404 (route not found on this host), try a GET fallback
        if (res.status === 404) {
          console.debug('Activation POST returned 404 — trying GET fallback')
          try {
            const getRes = await fetch(
              `${apiBase}/api/payments/payfast/subscription-activate?planType=${encodeURIComponent(
                planType,
              )}`,
              { credentials: 'include' },
            )

            const getText = await getRes.text()
            const locationHeader =
              getRes.headers.get('location') || getRes.headers.get('Location')
            if (locationHeader) {
              window.location.href = locationHeader
              return
            }
            if (getRes.status === 204 || (getRes.ok && !getText.trim())) {
              router.push('/')
              return
            }
            try {
              const data = JSON.parse(getText)
              if (data.error) {
                alert('Payment activation failed: ' + data.error)
                return
              }
              if (data.success) {
                router.push('/dashboard')
                return
              }
              if (data.url || data.redirectUrl) {
                window.location.href = data.url || data.redirectUrl
                return
              }
            } catch (err) {
              alert('Payment activation failed: ' + (err as Error).message)
            }
            if (getText && /^(https?:)?\/\//i.test(getText)) {
              window.location.href = getText
              return
            }
            console.debug('GET fallback returned unexpected body:', {
              status: getRes.status,
              body: getText,
            })
            // fall through to original handling which will surface an error
          } catch (err) {
            console.debug('GET fallback failed:', err)
          }
        }

        const text = await res.text()
        if (isLocal && res.status === 403) {
          console.debug(
            'Activation endpoint returned 403. Response body:',
            text,
          )
        }

        // If server responded with a Location header, redirect there
        const locationHeader =
          res.headers.get('location') || res.headers.get('Location')
        if (locationHeader) {
          window.location.href = locationHeader
          return
        }

        // If the response is empty but successful (204 or empty 2xx), treat as activated
        if (res.status === 204 || (res.ok && !text.trim())) {
          router.push('/dashboard')
          return
        }

        // Try parse JSON first (some backends return JSON with { success, url, error })
        try {
          const data = JSON.parse(text)
          if (data.error) {
            alert('Payment activation failed: ' + data.error)
            return
          }
          if (data.success) {
            router.push('/dashboard')
            return
          }
          if (data.url || data.redirectUrl) {
            window.location.href = data.url || data.redirectUrl
            return
          }
          // Unknown JSON payload — show it to the user instead of redirecting
          alert('Unexpected response: ' + JSON.stringify(data))
          return
        } catch (err) {
          console.debug(
            'Response is not JSON, treating as URL or message:',
            err,
          )
        }

        // Only redirect if the text looks like a URL (avoid redirecting to JSON/error strings)
        if (text && /^(https?:)?\/\//i.test(text)) {
          window.location.href = text
          return
        }

        console.debug('Activation endpoint returned unexpected body:', {
          status: res.status,
          body: text,
        })
        throw new Error('Empty or non-URL response from activation endpoint')
      }

      // Production: request URL for redirect-based flow
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
        `${apiBase}/api/payments/payfast/subscription-url?${params.toString()}`,
        { credentials: 'include' },
      )

      const data = await res.json()
      // Handle error responses first
      if (data && data.error) {
        alert('Failed to create subscription URL: ' + data.error)
        return
      }
      // Prefer explicit redirect fields, then success flag
      if (data && (data.redirectUrl || data.url)) {
        window.location.href = data.redirectUrl || data.url
        return
      }
      if (data && data.success) {
        router.push('/dashboard')
        return
      }

      throw new Error(
        'Unexpected response from subscription-url endpoint: ' +
          JSON.stringify(data),
      )
    } catch (e) {
      alert(
        'Failed to initiate payment. Please try again. ' + (e as Error).message,
      )
    } finally {
      setLoadingTier(null)
    }
  }

  // Debug: log current plan type
  console.log('Current plan type:', userPlanType, businessPlanType)
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
          const tierPlanTypeMap: Record<string, string> = {
            'Free User': 'FREE_USER',
            'Seller +': 'SELLER_PLUS',
            Reseller: 'RESELLER',
            'Pro Store': 'PRO_STORE',
          }
          const tierPlanType = tierPlanTypeMap[tier.name] || ''
          const currentPlanType = userContext.businessId
            ? businessPlanType
            : userPlanType
          const planOrder = [
            'FREE_USER',
            'SELLER_PLUS',
            'RESELLER',
            'PRO_STORE',
          ]
          const currentPlanIndex = planOrder.indexOf(
            (currentPlanType || '').toUpperCase(),
          )
          const tierPlanIndex = planOrder.indexOf(
            (tierPlanType || '').toUpperCase(),
          )
          console.log('Is Logged In: ', isLoggedIn)

          // Button and tooltip logic
          let isDisabled = false
          let buttonText = ''
          let tooltipText = ''
          if (!isLoggedIn) {
            isDisabled = true
            buttonText = isPaid ? 'Subscribe' : 'Current Plan'
            tooltipText = 'Please create an account first'
          } else if (loadingTier === tier.name) {
            isDisabled = true
            buttonText = 'Redirecting...'
            tooltipText = ''
          } else if (tierPlanType === 'FREE_USER') {
            if (currentPlanIndex === tierPlanIndex) {
              isDisabled = true
              buttonText = 'Current Plan'
              tooltipText = 'You are already subscribed to this plan.'
            } else if (currentPlanIndex > tierPlanIndex) {
              isDisabled = true
              buttonText = 'N/A'
              tooltipText =
                'You are on a higher plan. Downgrades to Free are not supported.'
            } else {
              isDisabled = true
              buttonText = 'Upgrade'
              tooltipText = 'Upgrade to a paid plan for more features.'
            }
          } else if (currentPlanIndex === tierPlanIndex) {
            isDisabled = true
            buttonText = 'Current Plan'
            tooltipText = 'You are already subscribed to this plan.'
          } else if (currentPlanIndex > tierPlanIndex) {
            isDisabled = true
            buttonText = 'N/A'
            tooltipText =
              tierPlanType === 'FREE_USER'
                ? 'You are on a paid plan. Downgrades to Free are not supported.'
                : 'You are on a higher plan. Downgrades are not supported from here.'
          } else {
            isDisabled = false
            buttonText = 'Upgrade'
            tooltipText = 'Upgrade to this plan for more features.'
          }

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
                    {tier.features.map((feature: string) => (
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
                      {tier.limitations.map((limitation: string) => (
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
                        disabled={isDisabled}
                        variant={tier.highlight ? 'contained' : 'outlined'}
                        className={`w-full py-2 text-base ${
                          tier.highlight
                            ? 'bg-blue-600 dark:bg-blue-700 text-white'
                            : ''
                        } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => handleSubscribe(tier)}
                      >
                        {buttonText}
                      </Button>
                    </div>
                  </TooltipTrigger>
                  {tooltipText && (
                    <TooltipContent>
                      <p>{tooltipText}</p>
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
                onClick={() => router.push('/register')}
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
