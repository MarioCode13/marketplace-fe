import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import './globals.css'
import Providers from '@/context/Providers'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: "Dealio - South Africa's Trusted Secondhand Marketplace",
    template: '%s | Dealio',
  },
  description:
    "Buy and sell secondhand items safely on Dealio, South Africa's trusted marketplace. Secure transactions, verified sellers, and a transparent trust rating system.",
  keywords: [
    'secondhand marketplace',
    'buy and sell',
    'South Africa',
    'trusted marketplace',
    'secure transactions',
    'verified sellers',
    'secondhand items',
    'online marketplace',
    'dealio',
    'dealio.org.za',
  ],
  authors: [{ name: 'Dealio Team' }],
  creator: 'Dealio',
  publisher: 'Dealio',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://dealio.org.za'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: 'https://dealio.org.za',
    siteName: 'Dealio',
    title: "Dealio - South Africa's Trusted Secondhand Marketplace",
    description:
      "Buy and sell secondhand items safely on Dealio, South Africa's trusted marketplace. Secure transactions, verified sellers, and a transparent trust rating system.",
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: "Dealio - South Africa's Trusted Secondhand Marketplace",
      },
      {
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: 'Dealio Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Dealio - South Africa's Trusted Secondhand Marketplace",
    description:
      "Buy and sell secondhand items safely on Dealio, South Africa's trusted marketplace.",
    images: ['/og-image.jpg'],
    creator: '@dealio_za',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en-ZA'>
      <head>
        <link
          rel='icon'
          href='/favicon.ico'
        />
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/apple-touch-icon.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/favicon-16x16.png'
        />
        <link
          rel='manifest'
          href='/site.webmanifest'
        />
        <meta
          name='theme-color'
          content='#ffffff'
        />
        <meta
          name='geo.region'
          content='ZA'
        />
        <meta
          name='geo.placename'
          content='South Africa'
        />
        <meta
          name='geo.position'
          content='-30.5595;22.9375'
        />
        <meta
          name='ICBM'
          content='-30.5595, 22.9375'
        />
        {/* Organization Schema - Required for Google Search Logo */}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Dealio',
              url: 'https://dealio.org.za',
              logo: 'https://dealio.org.za/logo.png',
              description: "South Africa's trusted secondhand marketplace",
              sameAs: [
                // Add your social media profiles here when available
                // 'https://twitter.com/dealio_za',
                // 'https://facebook.com/dealio',
              ],
            }),
          }}
        />
        {/* WebSite Schema */}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Dealio',
              url: 'https://dealio.org.za',
              description: "South Africa's trusted secondhand marketplace",
              publisher: {
                '@type': 'Organization',
                name: 'Dealio',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://dealio.org.za/logo.png',
                },
              },
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate:
                    'https://dealio.org.za/listings?searchTerm={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        {/* INLINE THEME SCRIPT */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const storedTheme = localStorage.getItem('theme');
                  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  const theme = storedTheme || systemTheme;
                  document.documentElement.classList.toggle('dark', theme === 'dark');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className='flex flex-col min-h-screen'>
        <Providers>
          <Navbar />
          <main className='flex-1'>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
