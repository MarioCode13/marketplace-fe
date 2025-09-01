'use client'

import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import { logout } from '@/store/authSlice'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useTheme } from '@/context/ThemeContext'
import { Menu as MenuIcon, Moon, SunMedium, User } from 'lucide-react'
import Drawer from './drawers/Drawer'
import { useState } from 'react'
import { Button } from './ui/button'
import { generateImageUrl } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useApolloClient, useQuery } from '@apollo/client'
import { GET_ME } from '@/lib/graphql/queries/getMe'

export default function Navbar() {
  const dispatch = useDispatch()
  const router = useRouter()
  const client = useApolloClient()
  const token = useSelector((state: RootState) => state.auth.token)
  const { theme, setTheme } = useTheme()
  const { data, loading } = useQuery(GET_ME, {
    skip: !token,
    fetchPolicy: 'no-cache',
  })
  const profileImageUrl = data?.me?.profileImageUrl
  const user = data?.me
  const isStoreUser =
    user?.planType === 'RESELLER' || user?.planType === 'PRO_STORE'
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    client.clearStore()
    router.push('/')
  }

  return (
    <nav className='bg-componentBackground text-foreground p-4 shadow-md transition-colors duration-300 sticky top-0 z-30'>
      <div className='container mx-auto flex justify-between items-center'>
        {/* Logo */}
        <Link href='/'>
          <div className='flex items-center gap-2'>
            <Image
              src={'/logo.png'}
              alt='Dealio'
              width={30}
              height={30}
              priority
            />
            <span className='text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
              Dealio
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className='gap-6 text-lg font-medium hidden md:flex'>
          <li>
            <Link
              href='/listings'
              className='hover:text-primary transition'
            >
              Browse
            </Link>
          </li>
          {isStoreUser && user?.storeBranding?.slug && (
            <li>
              <Link
                href={`/store/${user.storeBranding.slug}`}
                className='hover:text-primary transition'
              >
                My Store
              </Link>
            </li>
          )}

          {token && (
            <>
              <li>
                <Link
                  href='/my-listings'
                  className='hover:text-primary transition'
                >
                  My Listings
                </Link>
              </li>
              <li>
                <Link
                  href='/transactions'
                  className='hover:text-primary transition'
                >
                  Transactions
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Mobile Burger Icon */}
        <button
          className='md:hidden p-2 rounded-full hover:bg-secondary transition'
          onClick={() => setDrawerOpen(true)}
          aria-label='Open menu'
        >
          <MenuIcon className='w-7 h-7' />
        </button>

        {/* Desktop Theme Toggle & Auth */}
        <div className='items-center gap-4 hidden md:flex'>
          <Button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            variant='secondary'
            size='lg'
            className='p-2 w-10 h-10 rounded-full'
          >
            {theme === 'light' ? (
              <Moon className='w-5 h-5' />
            ) : (
              <SunMedium className='w-5 h-5' />
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='secondary'
                size='icon'
                className='rounded-full w-12 h-12'
              >
                {!token ? (
                  <User className='w-6 h-6' />
                ) : loading ? (
                  <div className='w-6 h-6 bg-gray-300 rounded-full animate-pulse' />
                ) : profileImageUrl ? (
                  <Image
                    src={generateImageUrl(profileImageUrl)}
                    alt='profile'
                    width={60}
                    height={39}
                    className='rounded-full w-12 h-12 object-cover'
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/logo.png'
                    }}
                  />
                ) : (
                  <User className='w-6 h-6' />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              {token ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link href='/profile'>Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className='text-red-500'
                  >
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href='/login'>Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href='/register'>Register</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <div className='flex flex-col gap-6 mt-2'>
          {/* Profile Image Link (only if logged in) */}
          {token && (
            <Link
              href='/profile'
              onClick={() => setDrawerOpen(false)}
              className='self-center mb-2'
            >
              {profileImageUrl ? (
                <Image
                  src={generateImageUrl(profileImageUrl)}
                  alt='profile'
                  width={80}
                  height={80}
                  className='rounded-full w-24 h-24 object-cover'
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/logo.png'
                  }}
                />
              ) : (
                <User className='w-24 h-24' />
              )}
            </Link>
          )}
          <ul className='flex flex-col gap-4 text-lg font-medium mt-2 items-center'>
            <li>
              <Link
                href='/listings'
                onClick={() => setDrawerOpen(false)}
              >
                Browse
              </Link>
            </li>
            {isStoreUser && user?.storeBranding?.slug && (
              <li>
                <Link
                  href={`/store/${user.storeBranding.slug}`}
                  onClick={() => setDrawerOpen(false)}
                  className='hover:text-primary transition'
                >
                  My Store
                </Link>
              </li>
            )}
            {token && (
              <>
                <li>
                  <Link
                    href='/my-listings'
                    onClick={() => setDrawerOpen(false)}
                  >
                    My Listings
                  </Link>
                </li>
                <li>
                  <Link
                    href='/transactions'
                    onClick={() => setDrawerOpen(false)}
                  >
                    Transactions
                  </Link>
                </li>
              </>
            )}
          </ul>
          <div className='flex flex-col gap-4 mt-8'>
            <Button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              variant='secondary'
              className='w-12 h-12 rounded-full self-center mb-8'
            >
              {theme === 'light' ? (
                <Moon className='w-5 h-5' />
              ) : (
                <SunMedium className='w-5 h-5' />
              )}
            </Button>
            {token ? (
              <Button
                onClick={() => {
                  setDrawerOpen(false)
                  handleLogout()
                }}
                variant='secondary'
                className='w-full'
              >
                Logout
              </Button>
            ) : (
              <>
                <Button
                  asChild
                  variant='secondary'
                  className='w-full'
                  onClick={() => setDrawerOpen(false)}
                >
                  <Link href='/login'>Login</Link>
                </Button>
                <Button
                  asChild
                  variant='secondary'
                  className='w-full'
                  onClick={() => setDrawerOpen(false)}
                >
                  <Link href='/register'>Register</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </Drawer>
    </nav>
  )
}
