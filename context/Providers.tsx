'use client'

import { Provider } from 'react-redux'
import { store } from '../store/store'
import ApolloProviderWrapper from '@/context/ApolloProviderWrapper'
import { ThemeProvider } from './ThemeContext'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ApolloProviderWrapper>
        <ThemeProvider>{children}</ThemeProvider>
      </ApolloProviderWrapper>
    </Provider>
  )
}
