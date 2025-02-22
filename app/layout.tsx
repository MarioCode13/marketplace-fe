import Navbar from '@/components/Navbar'
import './globals.css'
import Providers from '@/context/Providers'

export const metadata = {
  title: 'Marketplace',
  description: 'A marketplace app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body>
        <Providers>
          <Navbar />
          <main className='px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 max-w-7xl mx-auto'>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
