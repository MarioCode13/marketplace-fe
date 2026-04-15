import { getServerApolloClient } from '@/lib/apollo/server'
import { GET_BUSINESS_BY_ID } from '@/lib/graphql/queries/getBusinessById'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import StoreClient from './StoreClient'

export const revalidate = 60

type PageProps = {
  params: Promise<{ businessId: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { businessId } = await params
  const client = getServerApolloClient()

  try {
    const { data } = await client.query({
      query: GET_BUSINESS_BY_ID,
      variables: { id: businessId },
    })

    const business = data?.business
    if (!business) return { title: 'Store Not Found' }

    const storeName = business.storeBranding?.storeName || business.name

    return {
      title: `${storeName} - Store`,
      description: business.storeBranding?.about?.slice(0, 160) || `Browse ${storeName}'s store on Dealio.`,
      openGraph: {
        title: `${storeName} | Dealio`,
        description: business.storeBranding?.about?.slice(0, 160) || `Browse ${storeName}'s store on Dealio.`,
        images: business.storeBranding?.logoUrl ? [business.storeBranding.logoUrl] : undefined,
        url: `https://dealio.org.za/store/${businessId}`,
      },
      alternates: {
        canonical: `/store/${businessId}`,
      },
    }
  } catch {
    return { title: 'Store' }
  }
}

export default async function Page({ params }: PageProps) {
  const { businessId } = await params
  const client = getServerApolloClient()

  const { data } = await client.query({
    query: GET_BUSINESS_BY_ID,
    variables: { id: businessId },
  })

  const business = data?.business
  if (!business) notFound()

  return <StoreClient business={business} businessId={businessId} />
}
