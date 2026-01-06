import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Read Dealio\'s Privacy Policy. Learn how we protect your personal information and comply with POPIA and GDPR regulations.',
  openGraph: {
    title: 'Privacy Policy | Dealio',
    description:
      'Learn how Dealio protects your personal information and complies with data protection regulations.',
    url: 'https://dealio.org.za/privacy',
  },
  alternates: {
    canonical: '/privacy',
  },
}

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
