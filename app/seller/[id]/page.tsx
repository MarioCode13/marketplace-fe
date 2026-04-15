import { getServerApolloClient } from '@/lib/apollo/server'
import { GET_SELLER_PROFILE } from '@/lib/graphql/queries/getSellerProfile'
import { GET_USER_REVIEWS } from '@/lib/graphql/queries/getUserReviews'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import SellerProfileClient from './SellerProfileClient'

export const revalidate = 300 // 5 minutes

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
      query: GET_SELLER_PROFILE,
      variables: { id },
    })

    const user = data?.user
    if (!user) return { title: 'Seller Not Found' }

    const name =
      user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.username

    return {
      title: `${name} - Seller Profile`,
      description: user.bio?.slice(0, 160) || `View ${name}'s profile and listings on Dealio.`,
      openGraph: {
        title: `${name} | Dealio`,
        description: user.bio?.slice(0, 160) || `View ${name}'s profile and listings on Dealio.`,
        images: user.profileImageUrl ? [user.profileImageUrl] : undefined,
        url: `https://dealio.org.za/seller/${id}`,
      },
      alternates: {
        canonical: `/seller/${id}`,
      },
    }
  } catch {
    return { title: 'Seller Profile' }
  }
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  const client = getServerApolloClient()

  const { data } = await client.query({
    query: GET_SELLER_PROFILE,
    variables: { id },
  })

  const user = data?.user
  if (!user) notFound()

  // Fetch reviews separately
  let reviews = []
  try {
    const { data: reviewsData } = await client.query({
      query: GET_USER_REVIEWS,
      variables: { userId: user.id },
    })
    reviews = reviewsData?.getUserReviews || []
  } catch {
    // Reviews failing shouldn't block the page
  }

  return <SellerProfileClient user={user} reviews={reviews} />
}
