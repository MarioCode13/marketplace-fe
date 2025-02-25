'use client'

import { Provider } from 'react-redux'
import { store } from '../store/store'
import ApolloProviderWrapper from '@/context/ApolloProviderWrapper'
import { ThemeProvider } from './ThemeContext'
import { Toaster } from 'sonner'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ApolloProviderWrapper>
        <ThemeProvider>
          <Toaster position='bottom-right' />
          {children}
        </ThemeProvider>
      </ApolloProviderWrapper>
    </Provider>
  )
}
