'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import { useQuery } from '@apollo/client'
import { GET_USERS } from '@/lib/graphql/queries/getUsers'
import { RootState } from '@/store/store'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, User, Building2, ShoppingCart } from 'lucide-react'

interface UserData {
  getAllUsers: {
    id: string
    username: string
    email: string
    firstName?: string | null
    lastName?: string | null
    role: string
    planType?: string | null
    city?: {
      id: string
      name: string
      region: {
        name: string
        country: {
          name: string
        }
      }
    } | null
    customCity?: string | null
    trustRating?: {
      overallScore: number
      starRating: number
      trustLevel: string
      totalReviews: number
    } | null
    createdAt: string
  }[]
}

type UserType = 'all' | 'sellers' | 'buyers' | 'businesses'

export default function AdminUsersPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { userId, role } = useSelector((state: RootState) => state.userContext)

  const userTypeParam = searchParams.get('type') as UserType | null
  const [userType, setUserType] = useState<UserType>(userTypeParam || 'all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (userId === null) {
      router.push('/login')
    } else if (role !== 'ADMIN') {
      router.push('/')
    }
  }, [userId, role, router])

  useEffect(() => {
    const type = searchParams.get('type')
    if (type && ['sellers', 'buyers', 'businesses'].includes(type)) {
      setUserType(type as UserType)
    }
  }, [searchParams])

  const { data, loading, error } = useQuery<UserData>(GET_USERS, {
    fetchPolicy: 'network-only',
  })

  const handleUserTypeChange = (newType: string) => {
    setUserType(newType as UserType)
    router.push(`/admin/users?type=${newType}`)
  }

  const filteredUsers = data?.getAllUsers.filter((user) => {
    // Filter by user type
    if (
      userType === 'sellers' &&
      user.planType !== 'SELLER' &&
      user.planType !== 'BUSINESS'
    ) {
      return false
    }
    if (
      userType === 'buyers' &&
      (user.planType === 'SELLER' || user.planType === 'BUSINESS')
    ) {
      return false
    }
    if (userType === 'businesses' && user.planType !== 'BUSINESS') {
      return false
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      return (
        user.username.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.firstName?.toLowerCase().includes(search) ||
        user.lastName?.toLowerCase().includes(search)
      )
    }

    return true
  })

  const getUserTypeIcon = (planType?: string | null) => {
    switch (planType) {
      case 'BUSINESS':
        return <Building2 className='w-4 h-4' />
      case 'SELLER':
        return <ShoppingCart className='w-4 h-4' />
      default:
        return <User className='w-4 h-4' />
    }
  }

  const getUserTypeBadge = (planType?: string | null) => {
    switch (planType) {
      case 'BUSINESS':
        return <Badge variant='default'>Business</Badge>
      case 'SELLER':
        return <Badge variant='secondary'>Seller</Badge>
      default:
        return <Badge variant='outline'>Buyer</Badge>
    }
  }

  if (!userId || role !== 'ADMIN') {
    return null
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <h2 className='text-xl font-semibold'>Users</h2>
      </div>

      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-center gap-2'>
          <Select
            value={userType}
            onValueChange={handleUserTypeChange}
          >
            <SelectTrigger className='w-40'>
              <SelectValue placeholder='Select type' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Users</SelectItem>
              <SelectItem value='sellers'>Sellers</SelectItem>
              <SelectItem value='buyers'>Buyers</SelectItem>
              <SelectItem value='businesses'>Businesses</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='relative w-full sm:w-72'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
          <Input
            placeholder='Search users...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-9'
          />
        </div>
      </div>

      <>
        {loading ? (
          <div className='p-8 text-center text-muted-foreground'>
            Loading users...
          </div>
        ) : error ? (
          <div className='p-8 text-center text-red-500'>
            Error loading users: {error.message}
          </div>
        ) : filteredUsers?.length === 0 ? (
          <div className='p-8 text-center text-muted-foreground'>
            No users found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Trust Rating</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 rounded-full bg-muted flex items-center justify-center'>
                        {getUserTypeIcon(user.planType)}
                      </div>
                      <div>
                        <div className='font-medium'>
                          {user.firstName} {user.lastName || user.username}
                        </div>
                        <div className='text-sm text-muted-foreground'>
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getUserTypeBadge(user.planType)}</TableCell>
                  <TableCell>
                    {user.city
                      ? `${user.city.name}, ${user.city.region.name}`
                      : user.customCity || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {user.trustRating ? (
                      <div className='flex items-center gap-1'>
                        <span className='text-yellow-500'>★</span>
                        <span>{user.trustRating.starRating.toFixed(1)}</span>
                        <span className='text-muted-foreground text-sm'>
                          ({user.trustRating.totalReviews} reviews)
                        </span>
                      </div>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </>
    </div>
  )
}
