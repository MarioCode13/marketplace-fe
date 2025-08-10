'use client'

import { Provider } from 'react-redux'
import { store } from '../store/store'
import ApolloProviderWrapper from '@/context/ApolloProviderWrapper'
import { ThemeProvider } from './ThemeContext'
import { Toaster } from 'sonner'

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
          {children}
        </ThemeProvider>
      </ApolloProviderWrapper>
    </Provider>
  )
}
