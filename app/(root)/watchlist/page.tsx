import { redirect } from 'next/navigation'

/** Old URL; wishlist lives at `/wishlist`. */
export default function WatchlistRedirectPage() {
  redirect('/wishlist')
}
