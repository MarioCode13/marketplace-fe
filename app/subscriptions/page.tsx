import { Button } from '@/components/ui/button'
import { ShieldCheck, User, Store, Star } from 'lucide-react'

const tiers = [
  {
    name: 'Free',
    price: 'R0/mo',
    icon: User,
    features: [
      'Browse all listings',
      'Create listings',
      'Basic trust rating',
      'Limited contact with sellers',
    ],
    highlight: false,
  },
  {
    name: 'Verified User',
    price: 'R49/mo',
    icon: ShieldCheck,
    features: [
      'All Free features',
      'Verified badge',
      'Increased trust rating',
      'Ability to verify documents',
      'Priority in search results',
    ],
    highlight: false,
  },
  {
    name: 'Reseller',
    price: 'R99/mo',
    icon: Store,
    features: [
      'All Verified User features',
      'Reseller badge',
      'Custom store branding (primary color)',
      'Unlimited listings',
      'Priority support',
    ],
    highlight: false,
  },
  {
    name: 'Pro Store',
    price: 'R299/mo',
    icon: Star,
    features: [
      'All Reseller features',
      'Pro Store badge',
      'Full custom branding (colors, logo, banner)',
      'Storefront page',
      'Advanced analytics',
      'Featured placement',
    ],
    highlight: true,
    badge: 'Most Popular',
  },
]

export default function SubscriptionsPage() {
  return (
    <div className='min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 py-12 px-4'>
      <h1 className='text-4xl font-extrabold mb-2 text-center text-gray-900 dark:text-white drop-shadow-sm'>Marketplace Subscriptions</h1>
      <p className='text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto'>
        Unlock more features and grow your business with our subscription tiers. Choose the plan that fits your needs!
      </p>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto'>
        {tiers.map((tier) => {
          const Icon = tier.icon
          return (
            <div
              key={tier.name}
              className={`relative flex flex-col items-center rounded-2xl shadow-xl p-8 bg-white dark:bg-gray-900 border transition-transform duration-200 hover:scale-105 ${
                tier.highlight
                  ? 'border-blue-600 dark:border-blue-400 ring-2 ring-blue-200 dark:ring-blue-900 z-10 scale-105 md:scale-110 md:-mt-8'
                  : 'border-gray-200 dark:border-gray-800'
              }`}
              style={tier.highlight ? { minHeight: 440 } : {}}
            >
              {tier.badge && (
                <span className='absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 dark:bg-blue-500 text-white text-xs font-semibold px-4 py-1 rounded-full shadow-lg z-20'>
                  {tier.badge}
                </span>
              )}
              <div className={`mb-4 flex items-center justify-center w-16 h-16 rounded-full ${tier.highlight ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-800'}`}>
                <Icon className={`w-8 h-8 ${tier.highlight ? 'text-blue-600 dark:text-blue-300' : 'text-gray-500 dark:text-gray-300'}`} />
              </div>
              <h2 className={`text-2xl font-bold mb-2 ${tier.highlight ? 'text-blue-700 dark:text-blue-300' : 'text-gray-800 dark:text-white'}`}>{tier.name}</h2>
              <div className='text-3xl font-extrabold mb-4 text-gray-900 dark:text-white'>{tier.price}</div>
              <ul className='mb-8 text-gray-700 dark:text-gray-200 text-base space-y-2 w-full'>
                {tier.features.map((feature) => (
                  <li key={feature} className='flex items-center'>
                    <span className='mr-2 text-green-500 dark:text-green-400'>•</span> {feature}
                  </li>
                ))}
              </ul>
              <Button
                disabled
                variant={tier.highlight ? 'default' : 'outline'}
                className={`w-full py-2 text-base ${tier.highlight ? 'bg-blue-600 dark:bg-blue-700 text-white' : ''}`}
              >
                Coming Soon
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
