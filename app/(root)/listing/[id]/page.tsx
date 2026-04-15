import { getServerApolloClient } from '@/lib/apollo/server'
import { GET_LISTING_BY_ID } from '@/lib/graphql/queries'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import ListingDetailClient from './ListingDetailClient'

// ISR: revalidate cached page every 60 seconds
export const revalidate = 60

type PageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params
  const client = getServerApolloClient()

  try {
    const { data } = await client.query({
      query: GET_LISTING_BY_ID,
      variables: { id },
    })

    const listing = data?.getListingById
    if (!listing) return { title: 'Listing Not Found' }

    const location =
      listing.customCity ||
      (listing.city
        ? `${listing.city.name}, ${listing.city.region.name}`
        : '')

    return {
      title: `${listing.title} - R${listing.price}`,
      description: listing.description?.slice(0, 160),
      openGraph: {
        title: `${listing.title} - R${listing.price} | Dealio`,
        description: listing.description?.slice(0, 160),
        images:
          listing.images && listing.images.length > 0
            ? [listing.images[0]]
            : undefined,
        url: `https://dealio.org.za/listing/${id}`,
      },
      alternates: {
        canonical: `/listing/${id}`,
      },
      other: location ? { 'geo.placename': location } : undefined,
    }
  } catch {
    return { title: 'Listing' }
  }
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  const client = getServerApolloClient()

  const { data } = await client.query({
    query: GET_LISTING_BY_ID,
    variables: { id },
  })

  const listing = data?.getListingById
  if (!listing) notFound()

  return <ListingDetailClient listing={listing} />
}
