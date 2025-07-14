'use client'

import Link from 'next/link'
import { Heart, Shield, FileText, AlertTriangle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className='bg-componentBackground border-t mt-auto pt-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Company Info */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-foreground'>Marketplace</h3>
            <p className='text-sm text-muted-foreground'>
              Connecting buyers and sellers in a safe, trusted environment.
            </p>
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <Heart className='w-4 h-4' />
              <span>Made with care for our community</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-foreground'>Quick Links</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link href='/listings' className='text-muted-foreground hover:text-foreground transition-colors'>
                  Browse Listings
                </Link>
              </li>
              <li>
                <Link href='/sell' className='text-muted-foreground hover:text-foreground transition-colors'>
                  Sell an Item
                </Link>
              </li>
              <li>
                <Link href='/profile' className='text-muted-foreground hover:text-foreground transition-colors'>
                  My Profile
                </Link>
              </li>
              <li>
                <Link href='/transactions' className='text-muted-foreground hover:text-foreground transition-colors'>
                  My Transactions
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-foreground flex items-center gap-2'>
              <FileText className='w-4 h-4' />
              Legal
            </h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link href='/terms' className='text-muted-foreground hover:text-foreground transition-colors'>
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href='/privacy' className='text-muted-foreground hover:text-foreground transition-colors'>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href='/verification' className='text-muted-foreground hover:text-foreground transition-colors'>
                  Verification Disclosure
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-foreground flex items-center gap-2'>
              <Shield className='w-4 h-4' />
              Support & Safety
            </h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <a href='mailto:support@marketplace.com' className='text-muted-foreground hover:text-foreground transition-colors'>
                  Contact Support
                </a>
              </li>
              <li>
                <a href='mailto:fraud@marketplace.com' className='text-muted-foreground hover:text-foreground transition-colors'>
                  Report Fraud
                </a>
              </li>
              <li>
                <a href='mailto:verification@marketplace.com' className='text-muted-foreground hover:text-foreground transition-colors'>
                  Verification Help
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='border-t mt-8 pt-6'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <AlertTriangle className='w-4 h-4' />
              <span>Users transact at their own risk. Always verify items and users independently.</span>
            </div>
            <div className='text-sm text-muted-foreground'>
              © {new Date().getFullYear()} Marketplace. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 