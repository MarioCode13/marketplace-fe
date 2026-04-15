import { getServerApolloClient } from '@/lib/apollo/server'
import { GET_BUSINESS_BY_SLUG } from '@/lib/graphql/queries/getBusinessBySlug'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import ProStoreClient from './ProStoreClient'

export const revalidate = 60

type PageProps = {
  params: Promise<{ storeSlug: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { storeSlug } = await params
  const client = getServerApolloClient()

  try {
    const { data } = await client.query({
      query: GET_BUSINESS_BY_SLUG,
      variables: { slug: storeSlug },
    })

    const business = data?.getBusinessBySlug
    if (!business) return { title: 'Store Not Found' }

    const storeName = business.storeBranding?.storeName || business.name

    return {
      title: `${storeName}`,
      description: business.storeBranding?.about?.slice(0, 160) || `Browse ${storeName}'s store on Dealio.`,
      openGraph: {
        title: `${storeName} | Dealio`,
        description: business.storeBranding?.about?.slice(0, 160) || `Browse ${storeName}'s store on Dealio.`,
        images: business.storeBranding?.logoUrl ? [business.storeBranding.logoUrl] : undefined,
        url: `https://dealio.org.za/${storeSlug}`,
      },
      alternates: {
        canonical: `/${storeSlug}`,
      },
    }
  } catch {
    return { title: 'Store' }
  }
}

export default async function Page({ params }: PageProps) {
  const { storeSlug } = await params
  const client = getServerApolloClient()

  const { data } = await client.query({
    query: GET_BUSINESS_BY_SLUG,
    variables: { slug: storeSlug },
  })

  const business = data?.getBusinessBySlug

  // Check it's a valid Pro Store
  const isProStore = business?.businessUsers?.[0]?.user?.planType === 'PRO_STORE'
  if (!business || !isProStore) notFound()

  return <ProStoreClient business={business} />
}
