'use client'

import { GET_LISTING_BY_ID } from '@/lib/graphql/queries'
import { useQuery } from '@apollo/client'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useState, useEffect } from 'react'
import ContactSellerModal from '@/components/modals/ContactSellerModal'
import MarkAsSoldModal from '@/components/modals/MarkAsSoldModal'
import { Button } from '@/components/ui/button'
import {
	User,
	Shield,
	Star,
	DollarSign,
	Edit,
	ChevronLeft,
	ChevronRight,
} from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { generateImageUrl } from '@/lib/utils'
import { GET_ME } from '@/lib/graphql/queries/getMe'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'

const Page = () => {
	const params = useParams()
	const router = useRouter()
	const id = params?.id as string
	const [modalOpen, setModalOpen] = useState(false)
	const [markAsSoldModalOpen, setMarkAsSoldModalOpen] = useState(false)
	const [selectedImageIndex, setSelectedImageIndex] = useState(0)
	const user = useSelector((state: RootState) => state.userContext)

	const { data: meData } = useQuery(GET_ME, {
		skip: !user,
	})

	const { data, loading, error } = useQuery(GET_LISTING_BY_ID, {
		variables: { id },
		skip: !id,
	})

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (
				data?.getListingById?.images &&
				data.getListingById.images.length > 1
			) {
				if (event.key === 'ArrowLeft') {
					setSelectedImageIndex((prev) =>
						prev === 0 ? data.getListingById.images.length - 1 : prev - 1
					)
				} else if (event.key === 'ArrowRight') {
					setSelectedImageIndex((prev) =>
						prev === data.getListingById.images.length - 1 ? 0 : prev + 1
					)
				}
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [data?.getListingById?.images])

	if (loading) {
		return (
			<div className="w-full flex justify-center">
				<div className="w-full max-w-4xl py-8 px-6">
					<Skeleton className="h-10 w-3/4 mb-4" />
					<Skeleton className="h-6 w-1/3 mb-6" />
					<Skeleton className="h-80 w-full rounded-lg" />
				</div>
			</div>
		)
	}

	if (error)
		return (
			<p className="text-red-500 text-center mt-6">Error: {error.message}</p>
		)
	if (!data?.getListingById)
		return <p className="text-center mt-6">Listing not found.</p>

	const listing = data.getListingById
	const currentUserId = meData?.me?.id || user?.userId
	let isOwner = false
	if (currentUserId) {
		if (listing.user && currentUserId === listing.user.id) {
			isOwner = true
		}

		if (listing.business) {
			const listingBusinessId = listing.business.id
			const userBusinessId = user?.businessId
			if (
				userBusinessId &&
				listingBusinessId &&
				userBusinessId === listingBusinessId
			) {
				isOwner = true
			}

			// Also check explicit business owner or businessUsers array
			if (
				listing.business.owner &&
				listing.business.owner.id === currentUserId
			) {
				isOwner = true
			}

			if (
				Array.isArray(listing.business.businessUsers) &&
				listing.business.businessUsers.some(
					(bu: { user: { id: string } }) => bu.user?.id === currentUserId
				)
			) {
				isOwner = true
			}
		}
	}

	return (
		<div className="w-full flex justify-center">
			<div className="w-full max-w-5xl py-16 px-6">
				<div className="flex flex-col md:flex-row gap-6">
					<div className="md:w-1/2 relative">
						<div className="relative w-full h-[460px] rounded-lg shadow-lg overflow-hidden">
							<Image
								src={
									listing.images && listing.images.length > 0
										? generateImageUrl(listing.images[selectedImageIndex])
										: '/logo.png'
								}
								alt={listing.title}
								fill
								quality={90}
								className="object-cover"
								sizes="(max-width: 768px) 100vw, 50vw"
							/>
							{listing.images && listing.images.length > 1 && (
								<>
									<button
										onClick={() =>
											setSelectedImageIndex((prev) =>
												prev === 0 ? listing.images.length - 1 : prev - 1
											)
										}
										className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-10"
									>
										<ChevronLeft className="w-5 h-5" />
									</button>
									<button
										onClick={() =>
											setSelectedImageIndex((prev) =>
												prev === listing.images.length - 1 ? 0 : prev + 1
											)
										}
										className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-10"
									>
										<ChevronRight className="w-5 h-5" />
									</button>
								</>
							)}
						</div>

						<div className="flex gap-2 mt-4 overflow-x-auto">
							{listing.images &&
								listing.images.map((imageUrl: string, index: number) => (
									<div
										key={index}
										className={`relative w-20 h-20 rounded-md cursor-pointer border-2 transition-all hover:border-black flex-shrink-0 ${
											index === selectedImageIndex
												? 'border-blue-500 shadow-md'
												: 'border-gray-300'
										}`}
										onClick={() => setSelectedImageIndex(index)}
									>
										<Image
											src={generateImageUrl(imageUrl)}
											alt={`Preview ${index}`}
											fill
											className="object-cover rounded-md"
											sizes="80px"
										/>
									</div>
								))}
						</div>
					</div>

					<div className="md:w-1/2 space-y-6 flex flex-col justify-between">
						<div>
							<div className="flex items-start justify-between">
								<h1
									className="text-3xl font-bold mb-2"
									data-testid="listing-title"
								>
									{listing.title}
								</h1>
								{isOwner && (
									<Button
										onClick={() => router.push(`/edit-listing/${listing.id}`)}
										aria-label="Edit listing"
										size={'icon'}
										variant={'text'}
										color={'gradient'}
										className="rounded-full"
									>
										<Edit className="w-5 h-5" />
									</Button>
								)}
							</div>
							<Badge className="w-fit">{listing.condition}</Badge>
							<p className="text-gray-600 my-4">{listing.description}</p>
							<p
								className="text-2xl font-semibold text-green-600 mb-2"
								data-testid="listing-price"
							>
								R{listing.price}
							</p>
							<p className="text-sm text-gray-500">
								Location:{' '}
								{listing.customCity ||
									(listing.city
										? `${listing.city.name}, ${listing.city.region.name}, ${listing.city.region.country.name}`
										: '')}
							</p>
						</div>

						<Card>
							<CardContent className="p-4">
								<div className="flex items-center gap-4 mb-3">
									{/* Show store logo if business exists, otherwise show user profile image */}
									{listing.business &&
									listing.business.storeBranding?.logoUrl ? (
										<Image
											src={generateImageUrl(
												listing.business.storeBranding.logoUrl
											)}
											height={50}
											width={50}
											alt="store logo"
											className="rounded-full w-12 h-12 object-cover"
										/>
									) : listing.user?.profileImageUrl ? (
										<Image
											src={generateImageUrl(listing.user.profileImageUrl)}
											height={50}
											width={50}
											alt="profile"
											className="rounded-full w-12 h-12 object-cover"
										/>
									) : (
										<User className="w-12 h-12 p-2 bg-gray-100 rounded-full" />
									)}

									<div className="flex-1">
										<p className="text-gray-500 text-sm">
											{listing.business ? 'Store' : 'Seller'}
										</p>
										{listing.business ? (
											<Link
												href={
													listing.business.businessType === 'PRO_STORE' &&
													listing.business.slug
														? `/${listing.business.slug}`
														: listing.business.businessType === 'RESELLER'
														? `/store/${listing.business.id}`
														: '/'
												}
												className="hover:underline"
											>
												<h2 className="text-lg font-semibold">
													{listing.business.storeBranding?.storeName ||
														listing.business.name}
												</h2>
											</Link>
										) : listing.user ? (
											<Link
												href={`/seller/${listing.user.id}`}
												className="hover:underline"
											>
												<h2 className="text-lg font-semibold">
													{listing.user.username}
												</h2>
											</Link>
										) : (
											<span className="text-lg font-semibold text-gray-400">
												Unknown Seller
											</span>
										)}
									</div>
									{isOwner ? (
										<div className="flex gap-2">
											<Button
												onClick={() =>
													router.push(`/edit-listing/${listing.id}`)
												}
												variant="outlined"
												className="flex items-center gap-2"
												disabled={listing.sold}
											>
												<Edit className="w-4 h-4" />
												Edit
											</Button>
											<Button
												variant="contained"
												onClick={() => setMarkAsSoldModalOpen(true)}
												className="flex items-center gap-2"
												disabled={listing.sold}
											>
												<DollarSign className="w-4 h-4" />
												{listing.sold ? 'Already Sold' : 'Mark as Sold'}
											</Button>
										</div>
									) : (
										<div className="flex flex-col gap-3 p-2">
											{(() => {
												if (listing.business) {
													if (
														listing.business.businessType === 'PRO_STORE' &&
														listing.business?.slug
													) {
														return (
															<Link href={`/${listing.business?.slug}`}>
																<Button
																	variant="outlined"
																	className="flex items-center gap-2"
																>
																	<User className="w-4 h-4" />
																	View Store
																</Button>
															</Link>
														)
													} else if (
														listing.business.businessType === 'RESELLER'
													) {
														return (
															<Link href={`/store/${listing.business.id}`}>
																<Button
																	variant="outlined"
																	className="flex items-center gap-2"
																>
																	<User className="w-4 h-4" />
																	View Store
																</Button>
															</Link>
														)
													} else if (listing.user) {
														return (
															<Link href={`/seller/${listing.user.id}`}>
																<Button
																	variant="outlined"
																	className="flex items-center gap-2"
																>
																	<User className="w-4 h-4" />
																	View Profile
																</Button>
															</Link>
														)
													}
												} else if (listing.user) {
													return (
														<Link href={`/seller/${listing.user.id}`}>
															<Button
																variant="outlined"
																className="flex items-center gap-2"
															>
																<User className="w-4 h-4" />
																View Profile
															</Button>
														</Link>
													)
												}
												return null
											})()}
											<Button
												onClick={() => setModalOpen(true)}
												variant="contained"
												color="secondary"
											>
												Contact Seller
											</Button>
										</div>
									)}
								</div>

								<div className="border-t pt-3">
									<div className="flex items-center gap-2 mb-2">
										<Shield className="w-4 h-4 text-blue-600" />
										<span className="text-sm font-medium">Trust Rating</span>
									</div>
									<div className="flex items-center gap-2">
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<div className="flex items-center gap-1 cursor-pointer">
														{(() => {
															const rating =
																listing.business?.trustRating?.averageRating ||
																0
															return [1, 2, 3, 4, 5].map((star) => {
																if (rating >= star) {
																	// Full star
																	return (
																		<Star
																			key={star}
																			className="w-4 h-4 text-yellow-400 fill-yellow-400 stroke-yellow-400"
																		/>
																	)
																} else if (rating >= star - 0.75) {
																	return (
																		<span
																			key={star}
																			style={{
																				position: 'relative',
																				display: 'inline-block',
																				width: '1em',
																				height: '1em',
																			}}
																		>
																			<Star
																				className="w-4 h-4 text-yellow-400"
																				style={{
																					position: 'absolute',
																					left: 0,
																					top: 0,
																				}}
																			/>
																			<Star
																				className="w-4 h-4 text-yellow-400 fill-yellow-400 stroke-yellow-400"
																				style={{
																					position: 'absolute',
																					left: 0,
																					top: 0,
																					clipPath:
																						'polygon(0 0, 50% 0, 50% 100%, 0 100%)',
																				}}
																			/>
																		</span>
																	)
																} else {
																	return (
																		<Star
																			key={star}
																			className="w-4 h-4 text-gray-300"
																		/>
																	)
																}
															})
														})()}
													</div>
												</TooltipTrigger>
												<TooltipContent side="top">
													<p>{listing.business?.trustRating?.averageRating}</p>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>

										{listing.business?.trustRating?.reviewCount !==
										undefined ? (
											<span className="text-sm text-gray-600">
												({listing.business.trustRating.reviewCount} reviews)
											</span>
										) : null}
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>

				<ContactSellerModal
					isOpen={modalOpen}
					onClose={() => setModalOpen(false)}
					sellerEmail={listing.user?.email}
				/>

				<MarkAsSoldModal
					isOpen={markAsSoldModalOpen}
					onClose={() => setMarkAsSoldModalOpen(false)}
					listing={listing}
					onSuccess={() => {
						window.location.reload()
					}}
				/>
			</div>
		</div>
	)
}

export default Page
