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
  skipInitializer = false,
}: {
  children: React.ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialApolloState?: any
  skipInitializer?: boolean
}) {
  return (
    <Provider store={store}>
      <ApolloProviderWrapper initialState={initialApolloState}>
        <ThemeProvider>
          <Toaster position='bottom-right' />
          {!skipInitializer && <AppInitializer />}
          {children}
        </ThemeProvider>
      </ApolloProviderWrapper>
    </Provider>
  )
}
