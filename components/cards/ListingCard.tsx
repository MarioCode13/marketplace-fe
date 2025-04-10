import Link from 'next/link'
import Image from 'next/image'
import dayjs from 'dayjs'
import { MoreVertical } from 'lucide-react'
import { useState } from 'react'

interface ListingCardProps {
  listing: {
    id: string
    title: string
    description: string
    price: string
    images: string[]
    createdAt: string
  }
  showMenu?: boolean // If true, show the ellipsis menu for actions
  onEdit?: () => void
  onDelete?: () => void
}

export default function ListingCard({
  listing,
  showMenu = false,
  onEdit,
  onDelete,
}: ListingCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className='relative'>
      <Link
        href={`/listings/${listing.id}`}
        passHref
      >
        <div className='border border-secondary p-4 rounded-lg shadow-lg min-h-[300px] cursor-pointer transition-all duration-200 ease-in-out bg-componentBackground hover:shadow-xl hover:opacity-80 hover:scale-[1.02]'>
          <Image
            src={listing.images[0] || '/placeholder.png'}
            alt={listing.title}
            width={100}
            height={100}
            className='w-full h-40 object-cover rounded-md'
          />
          <h2 className='text-xl font-semibold mt-2'>{listing.title}</h2>
          <p className='text-gray-600 line-clamp-2 min-h-[48px]'>
            {listing.description}
          </p>
          <p className='text-green-600 font-bold'>${listing.price}</p>
          <p className='text-sm text-gray-500'>
            {dayjs(listing.createdAt).format('DD-MM-YYYY')}
          </p>
        </div>
      </Link>

      {/* Actions Menu */}
      {showMenu && (
        <div className='absolute top-2 right-2'>
          <button
            className='p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition'
            onClick={(e) => {
              e.stopPropagation() // Prevents clicking the menu from triggering the card link
              setMenuOpen(!menuOpen)
            }}
          >
            <MoreVertical size={20} />
          </button>
          {menuOpen && (
            <div className='absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 shadow-lg rounded-md z-10'>
              <button
                className='block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700'
                onClick={() => {
                  setMenuOpen(false)
                  onEdit?.()
                }}
              >
                Edit
              </button>
              <button
                className='block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                onClick={() => {
                  setMenuOpen(false)
                  onDelete?.()
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
