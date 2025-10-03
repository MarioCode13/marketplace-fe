'use client'

import { Provider } from 'react-redux'
import { store } from '../store/store'
import ApolloProviderWrapper from '@/lib/apollo/client'
import { ThemeProvider } from './ThemeContext'
import { Toaster } from 'sonner'
import AppInitializer from '@/context/AppInitializer'

export default function Providers({
  children,
  initialApolloState = {},
}: {
  children: React.ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialApolloState?: any
}) {
  return (
    <Provider store={store}>
      <ApolloProviderWrapper initialState={initialApolloState}>
        <ThemeProvider>
          <Toaster position='bottom-right' />
          <AppInitializer />
          {children}
        </ThemeProvider>
      </ApolloProviderWrapper>
    </Provider>
  )
}
