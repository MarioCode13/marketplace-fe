import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description:
    'Read Dealio\'s Terms of Use. Understand your rights and responsibilities when buying and selling on South Africa\'s trusted secondhand marketplace.',
  openGraph: {
    title: 'Terms of Use | Dealio',
    description:
      'Read Dealio\'s Terms of Use. Understand your rights and responsibilities when using our marketplace.',
    url: 'https://dealio.org.za/terms',
  },
  alternates: {
    canonical: '/terms',
  },
}

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
