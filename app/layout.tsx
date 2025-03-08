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
          <main className=' mx-auto'>{children}</main>
        </Providers>
      </body>
    </html>
  )
}
