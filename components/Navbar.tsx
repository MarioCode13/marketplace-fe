'use client'

import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import { logout } from '@/store/authSlice'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useTheme } from '@/context/ThemeContext'
import { Moon, SunMedium, User } from 'lucide-react'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function Navbar() {
  const dispatch = useDispatch()
  const router = useRouter()
  const token = useSelector((state: RootState) => state.auth.token)
  const { theme, setTheme } = useTheme()

  const handleLogout = () => {
    dispatch(logout())
    router.push('/login')
  }

  return (
    <nav className='bg-componentBackground text-foreground p-4 shadow-md transition-colors duration-300 sticky top-0'>
      <div className='container mx-auto flex justify-between items-center'>
        {/* Logo */}
        <Link href='/'>
          <Image
            src={'/logo.png'}
            alt='marketplace'
            width={30}
            height={10}
            priority
          />
        </Link>

        {/* Navigation Links */}
        <ul className='flex gap-6 text-lg font-medium'>
          <li>
            <Link
              href='/buy'
              className='hover:text-secondary transition'
            >
              Buy
            </Link>
          </li>
          <li>
            <Link
              href='/sell'
              className='hover:text-secondary transition'
            >
              Sell
            </Link>
          </li>
        </ul>

        {/* Theme Toggle & Auth */}
        <div className='flex items-center gap-4'>
          {/* Theme Toggle */}
          <Button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            variant='secondary'
            className='p-2'
          >
            {theme === 'light' ? (
              <Moon className='w-5 h-5' />
            ) : (
              <SunMedium className='w-5 h-5' />
            )}
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='secondary'>
                <User />
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
    </nav>
  )
}
