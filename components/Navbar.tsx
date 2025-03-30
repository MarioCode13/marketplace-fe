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
import { gql, useApolloClient, useQuery } from '@apollo/client'

const GET_PROFILE = gql`
  query Me {
    me {
      id
      username
      email
      profileImage
    }
  }
`

export default function Navbar() {
  const dispatch = useDispatch()
  const router = useRouter()
  const client = useApolloClient()
  const token = useSelector((state: RootState) => state.auth.token)
  const { theme, setTheme } = useTheme()
  const { data, loading } = useQuery(GET_PROFILE, {
    skip: !token,
    fetchPolicy: 'no-cache',
  })
  const profileImage = data?.me?.profileImage

  const handleLogout = () => {
    dispatch(logout())
    client.clearStore()
    router.push('/')
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
              href='/listings'
              className='hover:text-primary transition'
            >
              Browse
            </Link>
          </li>
          <li>
            <Link
              href='/my-listings'
              className='hover:text-primary transition'
            >
              My Listings
            </Link>
          </li>
        </ul>

        {/* Theme Toggle & Auth */}
        <div className='flex items-center gap-4'>
          {/* Theme Toggle */}
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

          {/* Profile Dropdown */}
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
                ) : profileImage ? (
                  <Image
                    src={`data:image/png;base64,${profileImage}`}
                    alt='profile'
                    width={60}
                    height={39}
                    className='rounded-full w-12 h-12 object-cover'
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
    </nav>
  )
}
