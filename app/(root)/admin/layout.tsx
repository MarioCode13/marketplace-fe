'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { Container } from '@/components/ui/Container'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, Ticket } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { userId, role } = useSelector((state: RootState) => state.userContext)

  useEffect(() => {
    if (userId === null) {
      router.push('/login')
    } else if (role !== 'ADMIN') {
      router.push('/')
    }
  }, [userId, role, router])

  if (!userId || role !== 'ADMIN') {
    return null
  }

  const approvalsActive =
    pathname === '/admin' ||
    pathname === '/admin/approvals' ||
    pathname?.startsWith('/admin/approvals/')
  const couponsActive =
    pathname === '/admin/coupons' || pathname?.startsWith('/admin/coupons/')

  const defaultTab = approvalsActive
    ? 'approvals'
    : couponsActive
      ? 'coupons'
      : 'approvals'

  return (
    <Container className='py-8'>
      <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <h1 className='text-2xl font-bold'>Admin</h1>
      </div>

      <Tabs
        defaultValue={defaultTab}
        className='w-full'
      >
        <TabsList className='grid w-full grid-cols-2 gap-4'>
          <TabsTrigger
            value='approvals'
            className='flex items-center gap-2'
            asChild
          >
            <Link href='/admin/approvals'>
              <CheckCircle className='w-4 h-4' />
              Approvals
            </Link>
          </TabsTrigger>
          <TabsTrigger
            value='coupons'
            className='flex items-center gap-2'
            asChild
          >
            <Link href='/admin/coupons'>
              <Ticket className='w-4 h-4' />
              Coupons
            </Link>
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value='approvals'
          className='mt-6'
        >
          {children}
        </TabsContent>

        <TabsContent
          value='coupons'
          className='mt-6'
        >
          {children}
        </TabsContent>
      </Tabs>
    </Container>
  )
}
