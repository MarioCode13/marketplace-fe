import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
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
