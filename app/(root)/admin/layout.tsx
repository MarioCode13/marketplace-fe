'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { Container } from '@/components/ui/Container'

import {
  CheckCircle,
  Ticket,
  Users,
  FolderTree,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { userId, role } = useSelector((state: RootState) => state.userContext)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

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

  const isActive = (href: string) => {
    if (href === '/admin/approvals') {
      return (
        pathname === '/admin' ||
        pathname === '/admin/approvals' ||
        pathname?.startsWith('/admin/approvals/')
      )
    }
    return pathname === href || pathname?.startsWith(href + '/')
  }

  const navItems = [
    {
      title: 'Approvals',
      href: '/admin/approvals',
      icon: CheckCircle,
    },
    {
      title: 'Coupons',
      href: '/admin/coupons',
      icon: Ticket,
    },
    {
      title: 'Users',
      href: '/admin/users',
      icon: Users,
    },
    {
      title: 'Categories',
      href: '/admin/categories',
      icon: FolderTree,
    },
  ]

  return (
    <Container className='py-8'>
      <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <h1 className='text-2xl font-bold'>Admin</h1>
      </div>

      <div className='flex gap-6'>
        {/* Collapsible Sidebar */}
        <aside
          className={`flex-shrink-0 transition-all duration-300 rounded-md bg-componentBackground h-full p-1 ${
            sidebarCollapsed ? 'w-12' : 'w-52'
          }`}
        >
          <div
            className={`flex items-center mb-2 ${
              sidebarCollapsed ? 'justify-center' : 'justify-end'
            }`}
          >
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className='p-1 hover:bg-muted rounded-md transition-colors'
              aria-label={
                sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
              }
            >
              {sidebarCollapsed ? (
                <ChevronRight className='w-5 h-5' />
              ) : (
                <ChevronLeft className='w-5 h-5' />
              )}
            </button>
          </div>

          <nav className='space-y-1'>
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <Icon className='w-4 h-5 flex-shrink-0' />
                  {!sidebarCollapsed && (
                    <span className='font-medium'>{item.title}</span>
                  )}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className='flex-1 min-w-0'>{children}</main>
      </div>
    </Container>
  )
}
