import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  email: Scalars['String']['output'];
  role?: Maybe<Scalars['String']['output']>;
  token: Scalars['String']['output'];
  userId: Scalars['ID']['output'];
};

export enum BillingCycle {
  Monthly = 'MONTHLY',
  Yearly = 'YEARLY'
}

export type Category = {
  __typename?: 'Category';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  parentId?: Maybe<Scalars['String']['output']>;
};

export type City = {
  __typename?: 'City';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  region: Region;
};

export enum Condition {
  Excellent = 'EXCELLENT',
  Fair = 'FAIR',
  ForParts = 'FOR_PARTS',
  Good = 'GOOD',
  HeavilyUsed = 'HEAVILY_USED',
  LikeNew = 'LIKE_NEW',
  NeedsRepair = 'NEEDS_REPAIR',
  New = 'NEW'
}

export type Country = {
  __typename?: 'Country';
  code: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export enum DocumentType {
  DriversLicense = 'DRIVERS_LICENSE',
  IdCard = 'ID_CARD',
  ProfilePhoto = 'PROFILE_PHOTO',
  ProofOfAddress = 'PROOF_OF_ADDRESS'
}

export type Listing = {
  __typename?: 'Listing';
  category?: Maybe<Category>;
  city?: Maybe<City>;
  condition: Condition;
  createdAt: Scalars['String']['output'];
  customCity?: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  expiresAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  images: Array<Scalars['String']['output']>;
  price: Scalars['Float']['output'];
  sold: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
  user: User;
};

export type ListingPageResponse = {
  __typename?: 'ListingPageResponse';
  listings: Array<Listing>;
  totalCount: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  cancelSubscription: Subscription;
  cancelTransaction: Transaction;
  completeTransaction: Transaction;
  createCheckoutSession: Scalars['String']['output'];
  createListing: Listing;
  createReview: Review;
  createTransaction: Transaction;
  deleteListing: Scalars['Boolean']['output'];
  deleteReview: Scalars['Boolean']['output'];
  login: AuthResponse;
  markListingAsSold: Listing;
  reactivateSubscription: Subscription;
  register: AuthResponse;
  updateListingDescription: Listing;
  updateListingPrice: Listing;
  updateListingTitle: Listing;
  updateReview: Review;
  updateStoreBranding?: Maybe<User>;
  updateUser?: Maybe<User>;
  updateUserPlanType?: Maybe<User>;
  uploadListingImage: Scalars['String']['output'];
};


export type MutationCancelTransactionArgs = {
  reason: Scalars['String']['input'];
  transactionId: Scalars['ID']['input'];
};


export type MutationCompleteTransactionArgs = {
  transactionId: Scalars['ID']['input'];
};


export type MutationCreateCheckoutSessionArgs = {
  billingCycle: Scalars['String']['input'];
  planType: Scalars['String']['input'];
};


export type MutationCreateListingArgs = {
  categoryId: Scalars['ID']['input'];
  cityId?: InputMaybe<Scalars['ID']['input']>;
  condition: Condition;
  customCity?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  images: Array<Scalars['String']['input']>;
  price: Scalars['Float']['input'];
  title: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationCreateReviewArgs = {
  comment?: InputMaybe<Scalars['String']['input']>;
  rating: Scalars['Float']['input'];
  reviewedUserId: Scalars['ID']['input'];
  transactionId: Scalars['ID']['input'];
};


export type MutationCreateTransactionArgs = {
  buyerId: Scalars['ID']['input'];
  listingId: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  paymentMethod?: InputMaybe<Scalars['String']['input']>;
  salePrice: Scalars['Float']['input'];
};


export type MutationDeleteListingArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteReviewArgs = {
  reviewId: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  emailOrUsername: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationMarkListingAsSoldArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRegisterArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationUpdateListingDescriptionArgs = {
  listingId: Scalars['ID']['input'];
  newDescription: Scalars['String']['input'];
};


export type MutationUpdateListingPriceArgs = {
  listingId: Scalars['ID']['input'];
  newPrice: Scalars['Float']['input'];
};


export type MutationUpdateListingTitleArgs = {
  listingId: Scalars['ID']['input'];
  newTitle: Scalars['String']['input'];
};


export type MutationUpdateReviewArgs = {
  comment?: InputMaybe<Scalars['String']['input']>;
  rating: Scalars['Float']['input'];
  reviewId: Scalars['ID']['input'];
};


export type MutationUpdateStoreBrandingArgs = {
  about?: InputMaybe<Scalars['String']['input']>;
  bannerUrl?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  lightOrDark?: InputMaybe<Scalars['String']['input']>;
  logoUrl?: InputMaybe<Scalars['String']['input']>;
  primaryColor?: InputMaybe<Scalars['String']['input']>;
  secondaryColor?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  storeName?: InputMaybe<Scalars['String']['input']>;
  themeColor?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateUserArgs = {
  bio?: InputMaybe<Scalars['String']['input']>;
  cityId?: InputMaybe<Scalars['ID']['input']>;
  contactNumber?: InputMaybe<Scalars['String']['input']>;
  customCity?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  lastName?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateUserPlanTypeArgs = {
  id: Scalars['ID']['input'];
  planType: Scalars['String']['input'];
};


export type MutationUploadListingImageArgs = {
  image: Scalars['String']['input'];
};

export enum PlanType {
  BasicMonthly = 'BASIC_MONTHLY',
  BasicYearly = 'BASIC_YEARLY',
  PremiumMonthly = 'PREMIUM_MONTHLY',
  PremiumYearly = 'PREMIUM_YEARLY'
}

export type ProfileCompletion = {
  __typename?: 'ProfileCompletion';
  completionPercentage: Scalars['Float']['output'];
  createdAt: Scalars['String']['output'];
  hasBio: Scalars['Boolean']['output'];
  hasContactNumber: Scalars['Boolean']['output'];
  hasDriversLicense: Scalars['Boolean']['output'];
  hasIdDocument: Scalars['Boolean']['output'];
  hasLocation: Scalars['Boolean']['output'];
  hasProfilePhoto: Scalars['Boolean']['output'];
  hasProofOfAddress: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  lastCalculated: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  userId: Scalars['ID']['output'];
};

export type Query = {
  __typename?: 'Query';
  canContactSellers: Scalars['Boolean']['output'];
  getAllUsers: Array<User>;
  getAvailablePlans: Array<Scalars['String']['output']>;
  getBuyerForListing?: Maybe<Scalars['String']['output']>;
  /**  No longer non-nullable list */
  getCategories?: Maybe<Array<Maybe<Category>>>;
  getCategoryById?: Maybe<Category>;
  getConditions?: Maybe<Array<Maybe<Condition>>>;
  getExpiringSubscriptions: Array<Subscription>;
  getListingById?: Maybe<Listing>;
  getListingTransactions: Array<Transaction>;
  getListings: ListingPageResponse;
  getMyReviewForTransaction?: Maybe<Review>;
  getProfileImage?: Maybe<Scalars['String']['output']>;
  getRecentUserReviews: Array<Review>;
  getReview: Review;
  getReviewsByMinimumRating: Array<Review>;
  getSubscriptionStats: SubscriptionStats;
  getTransaction: Transaction;
  getTransactionReviews: Array<Review>;
  getTrustRating?: Maybe<TrustRating>;
  getUserAverageRating: Scalars['Float']['output'];
  getUserById?: Maybe<User>;
  getUserDocumentByType?: Maybe<VerificationDocument>;
  getUserNegativeReviews: Array<Review>;
  getUserPositiveReviewCount: Scalars['Int']['output'];
  getUserPositiveReviews: Array<Review>;
  getUserProfileImage?: Maybe<Scalars['String']['output']>;
  getUserReviewCount: Scalars['Int']['output'];
  getUserReviews: Array<Review>;
  getUserVerificationDocuments: Array<VerificationDocument>;
  hasActiveSubscription: Scalars['Boolean']['output'];
  hasBoughtListing: Scalars['Boolean']['output'];
  listingsByUser: Array<Listing>;
  me?: Maybe<User>;
  myCompletedPurchases: Array<Transaction>;
  myCompletedSales: Array<Transaction>;
  /**  Nullable return type */
  myListings: ListingPageResponse;
  myPurchases: Array<Transaction>;
  mySales: Array<Transaction>;
  mySubscription?: Maybe<Subscription>;
  mySubscriptionHistory: Array<Subscription>;
  reviewsByUser: Array<Review>;
  searchCities: Array<City>;
  searchUsers: Array<User>;
  storeBySlug?: Maybe<User>;
  user?: Maybe<User>;
};


export type QueryGetBuyerForListingArgs = {
  listingId: Scalars['ID']['input'];
};


export type QueryGetCategoryByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetExpiringSubscriptionsArgs = {
  daysAhead?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetListingByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetListingTransactionsArgs = {
  listingId: Scalars['ID']['input'];
};


export type QueryGetListingsArgs = {
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  cityId?: InputMaybe<Scalars['ID']['input']>;
  condition?: InputMaybe<Condition>;
  limit: Scalars['Int']['input'];
  maxDate?: InputMaybe<Scalars['String']['input']>;
  maxPrice?: InputMaybe<Scalars['Float']['input']>;
  minDate?: InputMaybe<Scalars['String']['input']>;
  minPrice?: InputMaybe<Scalars['Float']['input']>;
  offset: Scalars['Int']['input'];
  searchTerm?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGetMyReviewForTransactionArgs = {
  transactionId: Scalars['ID']['input'];
};


export type QueryGetProfileImageArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetRecentUserReviewsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  userId: Scalars['ID']['input'];
};


export type QueryGetReviewArgs = {
  reviewId: Scalars['ID']['input'];
};


export type QueryGetReviewsByMinimumRatingArgs = {
  minRating: Scalars['Float']['input'];
};


export type QueryGetTransactionArgs = {
  transactionId: Scalars['ID']['input'];
};


export type QueryGetTransactionReviewsArgs = {
  transactionId: Scalars['ID']['input'];
};


export type QueryGetTrustRatingArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetUserAverageRatingArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetUserByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetUserDocumentByTypeArgs = {
  documentType: DocumentType;
  userId: Scalars['ID']['input'];
};


export type QueryGetUserNegativeReviewsArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetUserPositiveReviewCountArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetUserPositiveReviewsArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetUserProfileImageArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetUserReviewCountArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetUserReviewsArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetUserVerificationDocumentsArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryHasBoughtListingArgs = {
  listingId: Scalars['ID']['input'];
};


export type QueryListingsByUserArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryMyListingsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryReviewsByUserArgs = {
  userId: Scalars['ID']['input'];
};


export type QuerySearchCitiesArgs = {
  query: Scalars['String']['input'];
};


export type QuerySearchUsersArgs = {
  searchTerm: Scalars['String']['input'];
};


export type QueryStoreBySlugArgs = {
  slug: Scalars['String']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type Region = {
  __typename?: 'Region';
  country: Country;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Review = {
  __typename?: 'Review';
  comment?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isPositive: Scalars['Boolean']['output'];
  rating: Scalars['Float']['output'];
  reviewedUser: User;
  reviewer: User;
  transaction: Transaction;
  updatedAt: Scalars['String']['output'];
};

export type StoreBranding = {
  __typename?: 'StoreBranding';
  about?: Maybe<Scalars['String']['output']>;
  bannerUrl?: Maybe<Scalars['String']['output']>;
  lightOrDark?: Maybe<Scalars['String']['output']>;
  logoUrl?: Maybe<Scalars['String']['output']>;
  primaryColor?: Maybe<Scalars['String']['output']>;
  secondaryColor?: Maybe<Scalars['String']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  storeName?: Maybe<Scalars['String']['output']>;
  themeColor?: Maybe<Scalars['String']['output']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  amount: Scalars['Float']['output'];
  billingCycle: BillingCycle;
  cancelAtPeriodEnd: Scalars['Boolean']['output'];
  cancelledAt?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  currentPeriodEnd?: Maybe<Scalars['String']['output']>;
  currentPeriodStart?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  planType: PlanType;
  status: SubscriptionStatus;
  stripeCustomerId?: Maybe<Scalars['String']['output']>;
  stripeSubscriptionId?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
  user: User;
};

export type SubscriptionStats = {
  __typename?: 'SubscriptionStats';
  activeSubscriptions: Scalars['Int']['output'];
  totalSubscriptions: Scalars['Int']['output'];
};

export enum SubscriptionStatus {
  Active = 'ACTIVE',
  Cancelled = 'CANCELLED',
  PastDue = 'PAST_DUE',
  Trial = 'TRIAL',
  Unpaid = 'UNPAID'
}

export type Transaction = {
  __typename?: 'Transaction';
  buyer: User;
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  listing: Listing;
  notes?: Maybe<Scalars['String']['output']>;
  paymentMethod?: Maybe<Scalars['String']['output']>;
  saleDate: Scalars['String']['output'];
  salePrice: Scalars['Float']['output'];
  seller: User;
  status: TransactionStatus;
  updatedAt: Scalars['String']['output'];
};

export enum TransactionStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Disputed = 'DISPUTED',
  Pending = 'PENDING'
}

export type TrustRating = {
  __typename?: 'TrustRating';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastCalculated: Scalars['String']['output'];
  overallScore: Scalars['Float']['output'];
  positiveReviews: Scalars['Int']['output'];
  profileScore: Scalars['Float']['output'];
  reviewScore: Scalars['Float']['output'];
  starRating: Scalars['Float']['output'];
  successfulTransactions: Scalars['Int']['output'];
  totalReviews: Scalars['Int']['output'];
  totalTransactions: Scalars['Int']['output'];
  transactionScore: Scalars['Float']['output'];
  trustLevel: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  userId: Scalars['ID']['output'];
  verificationScore: Scalars['Float']['output'];
};

export type User = {
  __typename?: 'User';
  bio?: Maybe<Scalars['String']['output']>;
  city?: Maybe<City>;
  contactNumber?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  customCity?: Maybe<Scalars['String']['output']>;
  driversLicenseUrl?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  idPhotoUrl?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  listings: Array<Listing>;
  planType?: Maybe<Scalars['String']['output']>;
  profileCompletion?: Maybe<ProfileCompletion>;
  profileImageUrl?: Maybe<Scalars['String']['output']>;
  proofOfAddressUrl?: Maybe<Scalars['String']['output']>;
  role: Scalars['String']['output'];
  storeBranding?: Maybe<StoreBranding>;
  subscription?: Maybe<Subscription>;
  trustRating?: Maybe<TrustRating>;
  username: Scalars['String']['output'];
  verificationDocuments?: Maybe<Array<VerificationDocument>>;
};

export type VerificationDocument = {
  __typename?: 'VerificationDocument';
  documentType: DocumentType;
  documentUrl: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  status: VerificationStatus;
  uploadedAt: Scalars['String']['output'];
  userId: Scalars['ID']['output'];
  verifiedAt?: Maybe<Scalars['String']['output']>;
};

export enum VerificationStatus {
  Approved = 'APPROVED',
  Pending = 'PENDING',
  Rejected = 'REJECTED'
}

export type UpdateListingTitleMutationVariables = Exact<{
  listingId: Scalars['ID']['input'];
  newTitle: Scalars['String']['input'];
}>;


export type UpdateListingTitleMutation = { __typename?: 'Mutation', updateListingTitle: { __typename?: 'Listing', id: string, title: string } };

export type UpdateListingDescriptionMutationVariables = Exact<{
  listingId: Scalars['ID']['input'];
  newDescription: Scalars['String']['input'];
}>;


export type UpdateListingDescriptionMutation = { __typename?: 'Mutation', updateListingDescription: { __typename?: 'Listing', id: string, description: string } };

export type UpdateListingPriceMutationVariables = Exact<{
  listingId: Scalars['ID']['input'];
  newPrice: Scalars['Float']['input'];
}>;


export type UpdateListingPriceMutation = { __typename?: 'Mutation', updateListingPrice: { __typename?: 'Listing', id: string, price: number } };

export type CompleteProfileMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  bio?: InputMaybe<Scalars['String']['input']>;
  cityId?: InputMaybe<Scalars['ID']['input']>;
  customCity?: InputMaybe<Scalars['String']['input']>;
  contactNumber?: InputMaybe<Scalars['String']['input']>;
}>;


export type CompleteProfileMutation = { __typename?: 'Mutation', updateUser?: { __typename?: 'User', id: string } | null };

export type UpdateProfileMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  username: Scalars['String']['input'];
  email: Scalars['String']['input'];
}>;


export type UpdateProfileMutation = { __typename?: 'Mutation', updateUser?: { __typename?: 'User', id: string, username: string, email: string } | null };

export type RegisterMutationVariables = Exact<{
  username: Scalars['String']['input'];
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'AuthResponse', token: string, email: string, role?: string | null } };

export type CreateListingMutationVariables = Exact<{
  title: Scalars['String']['input'];
  description: Scalars['String']['input'];
  images: Array<Scalars['String']['input']> | Scalars['String']['input'];
  categoryId: Scalars['ID']['input'];
  price: Scalars['Float']['input'];
  customCity: Scalars['String']['input'];
  cityId: Scalars['ID']['input'];
  condition: Condition;
  userId: Scalars['ID']['input'];
}>;


export type CreateListingMutation = { __typename?: 'Mutation', createListing: { __typename?: 'Listing', id: string, title: string, description: string, price: number, createdAt: string } };

export type GetConditionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetConditionsQuery = { __typename?: 'Query', getConditions?: Array<Condition | null> | null };

export type GetAllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllUsersQuery = { __typename?: 'Query', getAllUsers: Array<{ __typename?: 'User', id: string, username: string, email: string }> };

export type DeleteListingMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteListingMutation = { __typename?: 'Mutation', deleteListing: boolean };

export type CreateReviewMutationVariables = Exact<{
  transactionId: Scalars['ID']['input'];
  reviewedUserId: Scalars['ID']['input'];
  rating: Scalars['Float']['input'];
  comment?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateReviewMutation = { __typename?: 'Mutation', createReview: { __typename?: 'Review', id: string, rating: number, comment?: string | null, isPositive: boolean, createdAt: string, updatedAt: string, reviewer: { __typename?: 'User', id: string, username: string, profileImageUrl?: string | null }, reviewedUser: { __typename?: 'User', id: string, username: string, profileImageUrl?: string | null }, transaction: { __typename?: 'Transaction', id: string, salePrice: number, saleDate: string, listing: { __typename?: 'Listing', id: string, title: string } } } };

export type UpdateReviewMutationVariables = Exact<{
  reviewId: Scalars['ID']['input'];
  rating: Scalars['Float']['input'];
  comment?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateReviewMutation = { __typename?: 'Mutation', updateReview: { __typename?: 'Review', id: string, rating: number, comment?: string | null, isPositive: boolean, createdAt: string, updatedAt: string, reviewer: { __typename?: 'User', id: string, username: string, profileImageUrl?: string | null }, reviewedUser: { __typename?: 'User', id: string, username: string, profileImageUrl?: string | null }, transaction: { __typename?: 'Transaction', id: string, salePrice: number, saleDate: string, listing: { __typename?: 'Listing', id: string, title: string } } } };

export type DeleteReviewMutationVariables = Exact<{
  reviewId: Scalars['ID']['input'];
}>;


export type DeleteReviewMutation = { __typename?: 'Mutation', deleteReview: boolean };

export type CreateTransactionMutationVariables = Exact<{
  listingId: Scalars['ID']['input'];
  buyerId: Scalars['ID']['input'];
  salePrice: Scalars['Float']['input'];
  paymentMethod?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateTransactionMutation = { __typename?: 'Mutation', createTransaction: { __typename?: 'Transaction', id: string, salePrice: number, saleDate: string, status: TransactionStatus, paymentMethod?: string | null, notes?: string | null, createdAt: string, updatedAt: string, listing: { __typename?: 'Listing', id: string, title: string, description: string, images: Array<string>, price: number, condition: Condition, city?: { __typename?: 'City', id: string, name: string, region: { __typename?: 'Region', name: string, country: { __typename?: 'Country', name: string } } } | null, user: { __typename?: 'User', id: string, username: string, profileImageUrl?: string | null } }, seller: { __typename?: 'User', id: string, username: string, profileImageUrl?: string | null }, buyer: { __typename?: 'User', id: string, username: string, profileImageUrl?: string | null } } };

export type CompleteTransactionMutationVariables = Exact<{
  transactionId: Scalars['ID']['input'];
}>;


export type CompleteTransactionMutation = { __typename?: 'Mutation', completeTransaction: { __typename?: 'Transaction', id: string, status: TransactionStatus, updatedAt: string } };

export type CancelTransactionMutationVariables = Exact<{
  transactionId: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
}>;


export type CancelTransactionMutation = { __typename?: 'Mutation', cancelTransaction: { __typename?: 'Transaction', id: string, status: TransactionStatus, notes?: string | null, updatedAt: string } };

export type GetCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCategoriesQuery = { __typename?: 'Query', getCategories?: Array<{ __typename?: 'Category', id: string, name: string, parentId?: string | null } | null> | null };

export type GetListingByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetListingByIdQuery = { __typename?: 'Query', getListingById?: { __typename?: 'Listing', id: string, title: string, description: string, images: Array<string>, price: number, sold: boolean, customCity?: string | null, condition: Condition, createdAt: string, city?: { __typename?: 'City', id: string, name: string, region: { __typename?: 'Region', name: string, country: { __typename?: 'Country', name: string } } } | null, user: { __typename?: 'User', id: string, username: string, profileImageUrl?: string | null, email: string, storeBranding?: { __typename?: 'StoreBranding', slug?: string | null } | null } } | null };

export type GetListingsQueryVariables = Exact<{
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  minPrice?: InputMaybe<Scalars['Float']['input']>;
  maxPrice?: InputMaybe<Scalars['Float']['input']>;
  condition?: InputMaybe<Condition>;
  cityId?: InputMaybe<Scalars['ID']['input']>;
  searchTerm?: InputMaybe<Scalars['String']['input']>;
  minDate?: InputMaybe<Scalars['String']['input']>;
  maxDate?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type GetListingsQuery = { __typename?: 'Query', getListings: { __typename?: 'ListingPageResponse', totalCount: number, listings: Array<{ __typename?: 'Listing', id: string, title: string, description: string, images: Array<string>, price: number, sold: boolean, customCity?: string | null, condition: Condition, createdAt: string, expiresAt: string, city?: { __typename?: 'City', id: string, name: string, region: { __typename?: 'Region', name: string, country: { __typename?: 'Country', name: string } } } | null, user: { __typename?: 'User', id: string, username: string, profileImageUrl?: string | null } }> } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, username: string, email: string, firstName?: string | null, lastName?: string | null, bio?: string | null, profileImageUrl?: string | null, planType?: string | null, role: string, customCity?: string | null, contactNumber?: string | null, idPhotoUrl?: string | null, driversLicenseUrl?: string | null, proofOfAddressUrl?: string | null, city?: { __typename?: 'City', id: string, name: string, region: { __typename?: 'Region', name: string, country: { __typename?: 'Country', name: string } } } | null, storeBranding?: { __typename?: 'StoreBranding', slug?: string | null } | null, subscription?: { __typename?: 'Subscription', status: SubscriptionStatus, planType: PlanType } | null } | null };

export type GetSellerProfileQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetSellerProfileQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: string, username: string, email: string, createdAt: string, profileImageUrl?: string | null, firstName?: string | null, lastName?: string | null, bio?: string | null, customCity?: string | null, contactNumber?: string | null, city?: { __typename?: 'City', id: string, name: string, region: { __typename?: 'Region', name: string, country: { __typename?: 'Country', name: string } } } | null, trustRating?: { __typename?: 'TrustRating', overallScore: number, verificationScore: number, profileScore: number, reviewScore: number, transactionScore: number, totalReviews: number, positiveReviews: number, starRating: number, trustLevel: string } | null, profileCompletion?: { __typename?: 'ProfileCompletion', id: string, hasProfilePhoto: boolean, hasBio: boolean, hasContactNumber: boolean, hasLocation: boolean, hasIdDocument: boolean, hasDriversLicense: boolean, hasProofOfAddress: boolean, completionPercentage: number, createdAt: string, updatedAt: string } | null, subscription?: { __typename?: 'Subscription', planType: PlanType } | null, storeBranding?: { __typename?: 'StoreBranding', slug?: string | null, logoUrl?: string | null, bannerUrl?: string | null, themeColor?: string | null, about?: string | null } | null, listings: Array<{ __typename?: 'Listing', id: string, title: string, price: number, images: Array<string>, sold: boolean, createdAt: string }> } | null };

export type GetMyStoreBrandingQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type GetMyStoreBrandingQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: string, planType?: string | null, storeBranding?: { __typename?: 'StoreBranding', slug?: string | null, logoUrl?: string | null, bannerUrl?: string | null, themeColor?: string | null, primaryColor?: string | null, secondaryColor?: string | null, lightOrDark?: string | null, about?: string | null, storeName?: string | null } | null } | null };

export type UpdateStoreBrandingMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  slug?: InputMaybe<Scalars['String']['input']>;
  logoUrl?: InputMaybe<Scalars['String']['input']>;
  bannerUrl?: InputMaybe<Scalars['String']['input']>;
  themeColor?: InputMaybe<Scalars['String']['input']>;
  primaryColor?: InputMaybe<Scalars['String']['input']>;
  secondaryColor?: InputMaybe<Scalars['String']['input']>;
  lightOrDark?: InputMaybe<Scalars['String']['input']>;
  about?: InputMaybe<Scalars['String']['input']>;
  storeName?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateStoreBrandingMutation = { __typename?: 'Mutation', updateStoreBranding?: { __typename?: 'User', storeBranding?: { __typename?: 'StoreBranding', slug?: string | null, logoUrl?: string | null, bannerUrl?: string | null, themeColor?: string | null, primaryColor?: string | null, secondaryColor?: string | null, lightOrDark?: string | null, about?: string | null, storeName?: string | null } | null } | null };

export type GetStoreBySlugFullQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type GetStoreBySlugFullQuery = { __typename?: 'Query', storeBySlug?: { __typename?: 'User', id: string, username: string, planType?: string | null, storeBranding?: { __typename?: 'StoreBranding', slug?: string | null, logoUrl?: string | null, bannerUrl?: string | null, themeColor?: string | null, lightOrDark?: string | null, primaryColor?: string | null, secondaryColor?: string | null, about?: string | null, storeName?: string | null } | null, trustRating?: { __typename?: 'TrustRating', starRating: number, trustLevel: string, overallScore: number, totalReviews: number, positiveReviews: number } | null, listings: Array<{ __typename?: 'Listing', id: string, title: string, description: string, price: number, images: Array<string>, condition: Condition, customCity?: string | null, createdAt: string, expiresAt: string, sold: boolean, city?: { __typename?: 'City', id: string, name: string, region: { __typename?: 'Region', name: string, country: { __typename?: 'Country', name: string } } } | null }> } | null };

export type GetStoreBySlugMinimalQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type GetStoreBySlugMinimalQuery = { __typename?: 'Query', storeBySlug?: { __typename?: 'User', id: string, username: string, planType?: string | null, storeBranding?: { __typename?: 'StoreBranding', slug?: string | null, storeName?: string | null, logoUrl?: string | null } | null } | null };

export type GetMyPurchasesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyPurchasesQuery = { __typename?: 'Query', myPurchases: Array<{ __typename?: 'Transaction', id: string, salePrice: number, saleDate: string, status: TransactionStatus, paymentMethod?: string | null, notes?: string | null, createdAt: string, updatedAt: string, listing: { __typename?: 'Listing', id: string, title: string, description: string, images: Array<string>, price: number, customCity?: string | null, condition: Condition, city?: { __typename?: 'City', name: string, region: { __typename?: 'Region', name: string, country: { __typename?: 'Country', name: string } } } | null, user: { __typename?: 'User', id: string, username: string, profileImageUrl?: string | null } }, seller: { __typename?: 'User', id: string, username: string, profileImageUrl?: string | null }, buyer: { __typename?: 'User', id: string, username: string, profileImageUrl?: string | null } }> };

export type GetMySalesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMySalesQuery = { __typename?: 'Query', mySales: Array<{ __typename?: 'Transaction', id: string, salePrice: number, saleDate: string, status: TransactionStatus, paymentMethod?: string | null, notes?: string | null, createdAt: string, updatedAt: string, listing: { __typename?: 'Listing', id: string, title: string, description: string, images: Array<string>, price: number, customCity?: string | null, condition: Condition, city?: { __typename?: 'City', name: string, region: { __typename?: 'Region', name: string, country: { __typename?: 'Country', name: string } } } | null, user: { __typename?: 'User', id: string, username: string, profileImageUrl?: string | null } }, seller: { __typename?: 'User', id: string, username: string, profileImageUrl?: string | null }, buyer: { __typename?: 'User', id: string, username: string, profileImageUrl?: string | null } }> };

export type GetMyCompletedPurchasesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyCompletedPurchasesQuery = { __typename?: 'Query', myCompletedPurchases: Array<{ __typename?: 'Transaction', id: string, salePrice: number, saleDate: string, status: TransactionStatus, paymentMethod?: string | null, notes?: string | null, createdAt: string, updatedAt: string, listing: { __typename?: 'Listing', id: string, title: string, description: string, images: Array<string>, price: number, customCity?: string | null, condition: Condition, city?: { __typename?: 'City', name: string, region: { __typename?: 'Region', name: string, country: { __typename?: 'Country', name: string } } } | null, user: { __typename?: 'User', id: string, username: string, profileImageUrl?: string | null } }, seller: { __typename?: 'User', id: string, username: string, profileImageUrl?: string | null }, buyer: { __typename?: 'User', id: string, username: string, profileImageUrl?: string | null } }> };

export type GetMyCompletedSalesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyCompletedSalesQuery = { __typename?: 'Query', myCompletedSales: Array<{ __typename?: 'Transaction', id: string, salePrice: number, saleDate: string, status: TransactionStatus, paymentMethod?: string | null, notes?: string | null, createdAt: string, updatedAt: string, listing: { __typename?: 'Listing', id: string, title: string, description: string, images: Array<string>, price: number, customCity?: string | null, condition: Condition, city?: { __typename?: 'City', name: string, region: { __typename?: 'Region', name: string, country: { __typename?: 'Country', name: string } } } | null, user: { __typename?: 'User', id: string, username: string, profileImageUrl?: string | null } }, seller: { __typename?: 'User', id: string, username: string, profileImageUrl?: string | null }, buyer: { __typename?: 'User', id: string, username: string, profileImageUrl?: string | null } }> };

export type GetTransactionQueryVariables = Exact<{
  transactionId: Scalars['ID']['input'];
}>;


export type GetTransactionQuery = { __typename?: 'Query', getTransaction: { __typename?: 'Transaction', id: string, salePrice: number, saleDate: string, status: TransactionStatus, paymentMethod?: string | null, notes?: string | null, createdAt: string, updatedAt: string, listing: { __typename?: 'Listing', id: string, title: string, description: string, images: Array<string>, price: number, customCity?: string | null, condition: Condition, city?: { __typename?: 'City', name: string, region: { __typename?: 'Region', name: string, country: { __typename?: 'Country', name: string } } } | null, user: { __typename?: 'User', id: string, username: string, profileImageUrl?: string | null } }, seller: { __typename?: 'User', id: string, username: string, profileImageUrl?: string | null }, buyer: { __typename?: 'User', id: string, username: string, profileImageUrl?: string | null } } };

export type GetMyReviewForTransactionQueryVariables = Exact<{
  transactionId: Scalars['ID']['input'];
}>;


export type GetMyReviewForTransactionQuery = { __typename?: 'Query', getMyReviewForTransaction?: { __typename?: 'Review', id: string, rating: number, comment?: string | null, isPositive: boolean, createdAt: string, updatedAt: string, reviewer: { __typename?: 'User', id: string, username: string, profileImageUrl?: string | null }, reviewedUser: { __typename?: 'User', id: string, username: string, profileImageUrl?: string | null }, transaction: { __typename?: 'Transaction', id: string, salePrice: number, saleDate: string, listing: { __typename?: 'Listing', id: string, title: string } } } | null };

export type GetTrustRatingQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type GetTrustRatingQuery = { __typename?: 'Query', getTrustRating?: { __typename?: 'TrustRating', id: string, userId: string, overallScore: number, verificationScore: number, profileScore: number, reviewScore: number, transactionScore: number, totalReviews: number, positiveReviews: number, totalTransactions: number, successfulTransactions: number, lastCalculated: string, createdAt: string, updatedAt: string, starRating: number, trustLevel: string } | null };

export type GetUserReviewsQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type GetUserReviewsQuery = { __typename?: 'Query', getUserReviews: Array<{ __typename?: 'Review', id: string, rating: number, comment?: string | null, isPositive: boolean, createdAt: string, updatedAt: string, reviewer: { __typename?: 'User', id: string, username: string, profileImageUrl?: string | null }, reviewedUser: { __typename?: 'User', id: string, username: string, profileImageUrl?: string | null }, transaction: { __typename?: 'Transaction', id: string, salePrice: number, saleDate: string, listing: { __typename?: 'Listing', id: string, title: string } } }> };

export type GetUserPositiveReviewsQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type GetUserPositiveReviewsQuery = { __typename?: 'Query', getUserPositiveReviews: Array<{ __typename?: 'Review', id: string, rating: number, comment?: string | null, isPositive: boolean, createdAt: string, updatedAt: string, reviewer: { __typename?: 'User', id: string, username: string, profileImageUrl?: string | null }, reviewedUser: { __typename?: 'User', id: string, username: string, profileImageUrl?: string | null }, transaction: { __typename?: 'Transaction', id: string, salePrice: number, saleDate: string, listing: { __typename?: 'Listing', id: string, title: string } } }> };

export type GetUserNegativeReviewsQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type GetUserNegativeReviewsQuery = { __typename?: 'Query', getUserNegativeReviews: Array<{ __typename?: 'Review', id: string, rating: number, comment?: string | null, isPositive: boolean, createdAt: string, updatedAt: string, reviewer: { __typename?: 'User', id: string, username: string, profileImageUrl?: string | null }, reviewedUser: { __typename?: 'User', id: string, username: string, profileImageUrl?: string | null }, transaction: { __typename?: 'Transaction', id: string, salePrice: number, saleDate: string, listing: { __typename?: 'Listing', id: string, title: string } } }> };

export type GetUserAverageRatingQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type GetUserAverageRatingQuery = { __typename?: 'Query', getUserAverageRating: number };

export type GetUserReviewCountQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type GetUserReviewCountQuery = { __typename?: 'Query', getUserReviewCount: number };

export type GetUserPositiveReviewCountQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type GetUserPositiveReviewCountQuery = { __typename?: 'Query', getUserPositiveReviewCount: number };

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { __typename?: 'Query', getAllUsers: Array<{ __typename?: 'User', id: string, username: string, email: string, customCity?: string | null, city?: { __typename?: 'City', id: string, name: string, region: { __typename?: 'Region', name: string, country: { __typename?: 'Country', name: string } } } | null }> };

export type SearchUsersQueryVariables = Exact<{
  searchTerm: Scalars['String']['input'];
}>;


export type SearchUsersQuery = { __typename?: 'Query', searchUsers: Array<{ __typename?: 'User', id: string, username: string, email: string, profileImageUrl?: string | null, firstName?: string | null, lastName?: string | null, city?: { __typename?: 'City', id: string, name: string, region: { __typename?: 'Region', name: string, country: { __typename?: 'Country', name: string } } } | null, trustRating?: { __typename?: 'TrustRating', overallScore: number, starRating: number, trustLevel: string, totalReviews: number, totalTransactions: number, successfulTransactions: number } | null }> };

export type GetUserVerificationDocumentsQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type GetUserVerificationDocumentsQuery = { __typename?: 'Query', getUserVerificationDocuments: Array<{ __typename?: 'VerificationDocument', id: string, userId: string, documentType: DocumentType, documentUrl: string, status: VerificationStatus, uploadedAt: string, verifiedAt?: string | null, notes?: string | null }> };

export type MyListingsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type MyListingsQuery = { __typename?: 'Query', myListings: { __typename?: 'ListingPageResponse', totalCount: number, listings: Array<{ __typename?: 'Listing', id: string, title: string, description: string, images: Array<string>, price: number, sold: boolean, customCity?: string | null, condition: Condition, createdAt: string, expiresAt: string, city?: { __typename?: 'City', id: string, name: string, region: { __typename?: 'Region', name: string, country: { __typename?: 'Country', name: string } } } | null, user: { __typename?: 'User', id: string, username: string, profileImageUrl?: string | null } }> } };

export type SearchCitiesQueryVariables = Exact<{
  query: Scalars['String']['input'];
}>;


export type SearchCitiesQuery = { __typename?: 'Query', searchCities: Array<{ __typename?: 'City', id: string, name: string, region: { __typename?: 'Region', id: string, name: string, country: { __typename?: 'Country', id: string, name: string, code: string } } }> };

export type LoginMutationVariables = Exact<{
  emailOrUsername: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthResponse', token: string, email: string, role?: string | null, userId: string } };


export const UpdateListingTitleDocument = gql`
    mutation UpdateListingTitle($listingId: ID!, $newTitle: String!) {
  updateListingTitle(listingId: $listingId, newTitle: $newTitle) {
    id
    title
  }
}
    `;
export type UpdateListingTitleMutationFn = Apollo.MutationFunction<UpdateListingTitleMutation, UpdateListingTitleMutationVariables>;

/**
 * __useUpdateListingTitleMutation__
 *
 * To run a mutation, you first call `useUpdateListingTitleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateListingTitleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateListingTitleMutation, { data, loading, error }] = useUpdateListingTitleMutation({
 *   variables: {
 *      listingId: // value for 'listingId'
 *      newTitle: // value for 'newTitle'
 *   },
 * });
 */
export function useUpdateListingTitleMutation(baseOptions?: Apollo.MutationHookOptions<UpdateListingTitleMutation, UpdateListingTitleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateListingTitleMutation, UpdateListingTitleMutationVariables>(UpdateListingTitleDocument, options);
      }
export type UpdateListingTitleMutationHookResult = ReturnType<typeof useUpdateListingTitleMutation>;
export type UpdateListingTitleMutationResult = Apollo.MutationResult<UpdateListingTitleMutation>;
export type UpdateListingTitleMutationOptions = Apollo.BaseMutationOptions<UpdateListingTitleMutation, UpdateListingTitleMutationVariables>;
export const UpdateListingDescriptionDocument = gql`
    mutation UpdateListingDescription($listingId: ID!, $newDescription: String!) {
  updateListingDescription(listingId: $listingId, newDescription: $newDescription) {
    id
    description
  }
}
    `;
export type UpdateListingDescriptionMutationFn = Apollo.MutationFunction<UpdateListingDescriptionMutation, UpdateListingDescriptionMutationVariables>;

/**
 * __useUpdateListingDescriptionMutation__
 *
 * To run a mutation, you first call `useUpdateListingDescriptionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateListingDescriptionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateListingDescriptionMutation, { data, loading, error }] = useUpdateListingDescriptionMutation({
 *   variables: {
 *      listingId: // value for 'listingId'
 *      newDescription: // value for 'newDescription'
 *   },
 * });
 */
export function useUpdateListingDescriptionMutation(baseOptions?: Apollo.MutationHookOptions<UpdateListingDescriptionMutation, UpdateListingDescriptionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateListingDescriptionMutation, UpdateListingDescriptionMutationVariables>(UpdateListingDescriptionDocument, options);
      }
export type UpdateListingDescriptionMutationHookResult = ReturnType<typeof useUpdateListingDescriptionMutation>;
export type UpdateListingDescriptionMutationResult = Apollo.MutationResult<UpdateListingDescriptionMutation>;
export type UpdateListingDescriptionMutationOptions = Apollo.BaseMutationOptions<UpdateListingDescriptionMutation, UpdateListingDescriptionMutationVariables>;
export const UpdateListingPriceDocument = gql`
    mutation UpdateListingPrice($listingId: ID!, $newPrice: Float!) {
  updateListingPrice(listingId: $listingId, newPrice: $newPrice) {
    id
    price
  }
}
    `;
export type UpdateListingPriceMutationFn = Apollo.MutationFunction<UpdateListingPriceMutation, UpdateListingPriceMutationVariables>;

/**
 * __useUpdateListingPriceMutation__
 *
 * To run a mutation, you first call `useUpdateListingPriceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateListingPriceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateListingPriceMutation, { data, loading, error }] = useUpdateListingPriceMutation({
 *   variables: {
 *      listingId: // value for 'listingId'
 *      newPrice: // value for 'newPrice'
 *   },
 * });
 */
export function useUpdateListingPriceMutation(baseOptions?: Apollo.MutationHookOptions<UpdateListingPriceMutation, UpdateListingPriceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateListingPriceMutation, UpdateListingPriceMutationVariables>(UpdateListingPriceDocument, options);
      }
export type UpdateListingPriceMutationHookResult = ReturnType<typeof useUpdateListingPriceMutation>;
export type UpdateListingPriceMutationResult = Apollo.MutationResult<UpdateListingPriceMutation>;
export type UpdateListingPriceMutationOptions = Apollo.BaseMutationOptions<UpdateListingPriceMutation, UpdateListingPriceMutationVariables>;
export const CompleteProfileDocument = gql`
    mutation CompleteProfile($id: ID!, $firstName: String!, $lastName: String!, $bio: String, $cityId: ID, $customCity: String, $contactNumber: String) {
  updateUser(
    id: $id
    firstName: $firstName
    lastName: $lastName
    bio: $bio
    cityId: $cityId
    customCity: $customCity
    contactNumber: $contactNumber
  ) {
    id
  }
}
    `;
export type CompleteProfileMutationFn = Apollo.MutationFunction<CompleteProfileMutation, CompleteProfileMutationVariables>;

/**
 * __useCompleteProfileMutation__
 *
 * To run a mutation, you first call `useCompleteProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCompleteProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [completeProfileMutation, { data, loading, error }] = useCompleteProfileMutation({
 *   variables: {
 *      id: // value for 'id'
 *      firstName: // value for 'firstName'
 *      lastName: // value for 'lastName'
 *      bio: // value for 'bio'
 *      cityId: // value for 'cityId'
 *      customCity: // value for 'customCity'
 *      contactNumber: // value for 'contactNumber'
 *   },
 * });
 */
export function useCompleteProfileMutation(baseOptions?: Apollo.MutationHookOptions<CompleteProfileMutation, CompleteProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CompleteProfileMutation, CompleteProfileMutationVariables>(CompleteProfileDocument, options);
      }
export type CompleteProfileMutationHookResult = ReturnType<typeof useCompleteProfileMutation>;
export type CompleteProfileMutationResult = Apollo.MutationResult<CompleteProfileMutation>;
export type CompleteProfileMutationOptions = Apollo.BaseMutationOptions<CompleteProfileMutation, CompleteProfileMutationVariables>;
export const UpdateProfileDocument = gql`
    mutation UpdateProfile($id: ID!, $username: String!, $email: String!) {
  updateUser(id: $id, username: $username, email: $email) {
    id
    username
    email
  }
}
    `;
export type UpdateProfileMutationFn = Apollo.MutationFunction<UpdateProfileMutation, UpdateProfileMutationVariables>;

/**
 * __useUpdateProfileMutation__
 *
 * To run a mutation, you first call `useUpdateProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProfileMutation, { data, loading, error }] = useUpdateProfileMutation({
 *   variables: {
 *      id: // value for 'id'
 *      username: // value for 'username'
 *      email: // value for 'email'
 *   },
 * });
 */
export function useUpdateProfileMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProfileMutation, UpdateProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProfileMutation, UpdateProfileMutationVariables>(UpdateProfileDocument, options);
      }
export type UpdateProfileMutationHookResult = ReturnType<typeof useUpdateProfileMutation>;
export type UpdateProfileMutationResult = Apollo.MutationResult<UpdateProfileMutation>;
export type UpdateProfileMutationOptions = Apollo.BaseMutationOptions<UpdateProfileMutation, UpdateProfileMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($username: String!, $email: String!, $password: String!) {
  register(username: $username, email: $email, password: $password) {
    token
    email
    role
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      username: // value for 'username'
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const CreateListingDocument = gql`
    mutation CreateListing($title: String!, $description: String!, $images: [String!]!, $categoryId: ID!, $price: Float!, $customCity: String!, $cityId: ID!, $condition: Condition!, $userId: ID!) {
  createListing(
    title: $title
    description: $description
    images: $images
    categoryId: $categoryId
    price: $price
    customCity: $customCity
    cityId: $cityId
    condition: $condition
    userId: $userId
  ) {
    id
    title
    description
    price
    createdAt
  }
}
    `;
export type CreateListingMutationFn = Apollo.MutationFunction<CreateListingMutation, CreateListingMutationVariables>;

/**
 * __useCreateListingMutation__
 *
 * To run a mutation, you first call `useCreateListingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateListingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createListingMutation, { data, loading, error }] = useCreateListingMutation({
 *   variables: {
 *      title: // value for 'title'
 *      description: // value for 'description'
 *      images: // value for 'images'
 *      categoryId: // value for 'categoryId'
 *      price: // value for 'price'
 *      customCity: // value for 'customCity'
 *      cityId: // value for 'cityId'
 *      condition: // value for 'condition'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useCreateListingMutation(baseOptions?: Apollo.MutationHookOptions<CreateListingMutation, CreateListingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateListingMutation, CreateListingMutationVariables>(CreateListingDocument, options);
      }
export type CreateListingMutationHookResult = ReturnType<typeof useCreateListingMutation>;
export type CreateListingMutationResult = Apollo.MutationResult<CreateListingMutation>;
export type CreateListingMutationOptions = Apollo.BaseMutationOptions<CreateListingMutation, CreateListingMutationVariables>;
export const GetConditionsDocument = gql`
    query GetConditions {
  getConditions
}
    `;

/**
 * __useGetConditionsQuery__
 *
 * To run a query within a React component, call `useGetConditionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetConditionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetConditionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetConditionsQuery(baseOptions?: Apollo.QueryHookOptions<GetConditionsQuery, GetConditionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetConditionsQuery, GetConditionsQueryVariables>(GetConditionsDocument, options);
      }
export function useGetConditionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetConditionsQuery, GetConditionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetConditionsQuery, GetConditionsQueryVariables>(GetConditionsDocument, options);
        }
export function useGetConditionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetConditionsQuery, GetConditionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetConditionsQuery, GetConditionsQueryVariables>(GetConditionsDocument, options);
        }
export type GetConditionsQueryHookResult = ReturnType<typeof useGetConditionsQuery>;
export type GetConditionsLazyQueryHookResult = ReturnType<typeof useGetConditionsLazyQuery>;
export type GetConditionsSuspenseQueryHookResult = ReturnType<typeof useGetConditionsSuspenseQuery>;
export type GetConditionsQueryResult = Apollo.QueryResult<GetConditionsQuery, GetConditionsQueryVariables>;
export const GetAllUsersDocument = gql`
    query GetAllUsers {
  getAllUsers {
    id
    username
    email
  }
}
    `;

/**
 * __useGetAllUsersQuery__
 *
 * To run a query within a React component, call `useGetAllUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllUsersQuery(baseOptions?: Apollo.QueryHookOptions<GetAllUsersQuery, GetAllUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument, options);
      }
export function useGetAllUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllUsersQuery, GetAllUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument, options);
        }
export function useGetAllUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllUsersQuery, GetAllUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument, options);
        }
export type GetAllUsersQueryHookResult = ReturnType<typeof useGetAllUsersQuery>;
export type GetAllUsersLazyQueryHookResult = ReturnType<typeof useGetAllUsersLazyQuery>;
export type GetAllUsersSuspenseQueryHookResult = ReturnType<typeof useGetAllUsersSuspenseQuery>;
export type GetAllUsersQueryResult = Apollo.QueryResult<GetAllUsersQuery, GetAllUsersQueryVariables>;
export const DeleteListingDocument = gql`
    mutation DeleteListing($id: ID!) {
  deleteListing(id: $id)
}
    `;
export type DeleteListingMutationFn = Apollo.MutationFunction<DeleteListingMutation, DeleteListingMutationVariables>;

/**
 * __useDeleteListingMutation__
 *
 * To run a mutation, you first call `useDeleteListingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteListingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteListingMutation, { data, loading, error }] = useDeleteListingMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteListingMutation(baseOptions?: Apollo.MutationHookOptions<DeleteListingMutation, DeleteListingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteListingMutation, DeleteListingMutationVariables>(DeleteListingDocument, options);
      }
export type DeleteListingMutationHookResult = ReturnType<typeof useDeleteListingMutation>;
export type DeleteListingMutationResult = Apollo.MutationResult<DeleteListingMutation>;
export type DeleteListingMutationOptions = Apollo.BaseMutationOptions<DeleteListingMutation, DeleteListingMutationVariables>;
export const CreateReviewDocument = gql`
    mutation CreateReview($transactionId: ID!, $reviewedUserId: ID!, $rating: Float!, $comment: String) {
  createReview(
    transactionId: $transactionId
    reviewedUserId: $reviewedUserId
    rating: $rating
    comment: $comment
  ) {
    id
    reviewer {
      id
      username
      profileImageUrl
    }
    reviewedUser {
      id
      username
      profileImageUrl
    }
    transaction {
      id
      listing {
        id
        title
      }
      salePrice
      saleDate
    }
    rating
    comment
    isPositive
    createdAt
    updatedAt
  }
}
    `;
export type CreateReviewMutationFn = Apollo.MutationFunction<CreateReviewMutation, CreateReviewMutationVariables>;

/**
 * __useCreateReviewMutation__
 *
 * To run a mutation, you first call `useCreateReviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateReviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createReviewMutation, { data, loading, error }] = useCreateReviewMutation({
 *   variables: {
 *      transactionId: // value for 'transactionId'
 *      reviewedUserId: // value for 'reviewedUserId'
 *      rating: // value for 'rating'
 *      comment: // value for 'comment'
 *   },
 * });
 */
export function useCreateReviewMutation(baseOptions?: Apollo.MutationHookOptions<CreateReviewMutation, CreateReviewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateReviewMutation, CreateReviewMutationVariables>(CreateReviewDocument, options);
      }
export type CreateReviewMutationHookResult = ReturnType<typeof useCreateReviewMutation>;
export type CreateReviewMutationResult = Apollo.MutationResult<CreateReviewMutation>;
export type CreateReviewMutationOptions = Apollo.BaseMutationOptions<CreateReviewMutation, CreateReviewMutationVariables>;
export const UpdateReviewDocument = gql`
    mutation UpdateReview($reviewId: ID!, $rating: Float!, $comment: String) {
  updateReview(reviewId: $reviewId, rating: $rating, comment: $comment) {
    id
    reviewer {
      id
      username
      profileImageUrl
    }
    reviewedUser {
      id
      username
      profileImageUrl
    }
    transaction {
      id
      listing {
        id
        title
      }
      salePrice
      saleDate
    }
    rating
    comment
    isPositive
    createdAt
    updatedAt
  }
}
    `;
export type UpdateReviewMutationFn = Apollo.MutationFunction<UpdateReviewMutation, UpdateReviewMutationVariables>;

/**
 * __useUpdateReviewMutation__
 *
 * To run a mutation, you first call `useUpdateReviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateReviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateReviewMutation, { data, loading, error }] = useUpdateReviewMutation({
 *   variables: {
 *      reviewId: // value for 'reviewId'
 *      rating: // value for 'rating'
 *      comment: // value for 'comment'
 *   },
 * });
 */
export function useUpdateReviewMutation(baseOptions?: Apollo.MutationHookOptions<UpdateReviewMutation, UpdateReviewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateReviewMutation, UpdateReviewMutationVariables>(UpdateReviewDocument, options);
      }
export type UpdateReviewMutationHookResult = ReturnType<typeof useUpdateReviewMutation>;
export type UpdateReviewMutationResult = Apollo.MutationResult<UpdateReviewMutation>;
export type UpdateReviewMutationOptions = Apollo.BaseMutationOptions<UpdateReviewMutation, UpdateReviewMutationVariables>;
export const DeleteReviewDocument = gql`
    mutation DeleteReview($reviewId: ID!) {
  deleteReview(reviewId: $reviewId)
}
    `;
export type DeleteReviewMutationFn = Apollo.MutationFunction<DeleteReviewMutation, DeleteReviewMutationVariables>;

/**
 * __useDeleteReviewMutation__
 *
 * To run a mutation, you first call `useDeleteReviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteReviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteReviewMutation, { data, loading, error }] = useDeleteReviewMutation({
 *   variables: {
 *      reviewId: // value for 'reviewId'
 *   },
 * });
 */
export function useDeleteReviewMutation(baseOptions?: Apollo.MutationHookOptions<DeleteReviewMutation, DeleteReviewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteReviewMutation, DeleteReviewMutationVariables>(DeleteReviewDocument, options);
      }
export type DeleteReviewMutationHookResult = ReturnType<typeof useDeleteReviewMutation>;
export type DeleteReviewMutationResult = Apollo.MutationResult<DeleteReviewMutation>;
export type DeleteReviewMutationOptions = Apollo.BaseMutationOptions<DeleteReviewMutation, DeleteReviewMutationVariables>;
export const CreateTransactionDocument = gql`
    mutation CreateTransaction($listingId: ID!, $buyerId: ID!, $salePrice: Float!, $paymentMethod: String, $notes: String) {
  createTransaction(
    listingId: $listingId
    buyerId: $buyerId
    salePrice: $salePrice
    paymentMethod: $paymentMethod
    notes: $notes
  ) {
    id
    listing {
      id
      title
      description
      images
      price
      city {
        id
        name
        region {
          name
          country {
            name
          }
        }
      }
      condition
      user {
        id
        username
        profileImageUrl
      }
    }
    seller {
      id
      username
      profileImageUrl
    }
    buyer {
      id
      username
      profileImageUrl
    }
    salePrice
    saleDate
    status
    paymentMethod
    notes
    createdAt
    updatedAt
  }
}
    `;
export type CreateTransactionMutationFn = Apollo.MutationFunction<CreateTransactionMutation, CreateTransactionMutationVariables>;

/**
 * __useCreateTransactionMutation__
 *
 * To run a mutation, you first call `useCreateTransactionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTransactionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTransactionMutation, { data, loading, error }] = useCreateTransactionMutation({
 *   variables: {
 *      listingId: // value for 'listingId'
 *      buyerId: // value for 'buyerId'
 *      salePrice: // value for 'salePrice'
 *      paymentMethod: // value for 'paymentMethod'
 *      notes: // value for 'notes'
 *   },
 * });
 */
export function useCreateTransactionMutation(baseOptions?: Apollo.MutationHookOptions<CreateTransactionMutation, CreateTransactionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTransactionMutation, CreateTransactionMutationVariables>(CreateTransactionDocument, options);
      }
export type CreateTransactionMutationHookResult = ReturnType<typeof useCreateTransactionMutation>;
export type CreateTransactionMutationResult = Apollo.MutationResult<CreateTransactionMutation>;
export type CreateTransactionMutationOptions = Apollo.BaseMutationOptions<CreateTransactionMutation, CreateTransactionMutationVariables>;
export const CompleteTransactionDocument = gql`
    mutation CompleteTransaction($transactionId: ID!) {
  completeTransaction(transactionId: $transactionId) {
    id
    status
    updatedAt
  }
}
    `;
export type CompleteTransactionMutationFn = Apollo.MutationFunction<CompleteTransactionMutation, CompleteTransactionMutationVariables>;

/**
 * __useCompleteTransactionMutation__
 *
 * To run a mutation, you first call `useCompleteTransactionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCompleteTransactionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [completeTransactionMutation, { data, loading, error }] = useCompleteTransactionMutation({
 *   variables: {
 *      transactionId: // value for 'transactionId'
 *   },
 * });
 */
export function useCompleteTransactionMutation(baseOptions?: Apollo.MutationHookOptions<CompleteTransactionMutation, CompleteTransactionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CompleteTransactionMutation, CompleteTransactionMutationVariables>(CompleteTransactionDocument, options);
      }
export type CompleteTransactionMutationHookResult = ReturnType<typeof useCompleteTransactionMutation>;
export type CompleteTransactionMutationResult = Apollo.MutationResult<CompleteTransactionMutation>;
export type CompleteTransactionMutationOptions = Apollo.BaseMutationOptions<CompleteTransactionMutation, CompleteTransactionMutationVariables>;
export const CancelTransactionDocument = gql`
    mutation CancelTransaction($transactionId: ID!, $reason: String!) {
  cancelTransaction(transactionId: $transactionId, reason: $reason) {
    id
    status
    notes
    updatedAt
  }
}
    `;
export type CancelTransactionMutationFn = Apollo.MutationFunction<CancelTransactionMutation, CancelTransactionMutationVariables>;

/**
 * __useCancelTransactionMutation__
 *
 * To run a mutation, you first call `useCancelTransactionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelTransactionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelTransactionMutation, { data, loading, error }] = useCancelTransactionMutation({
 *   variables: {
 *      transactionId: // value for 'transactionId'
 *      reason: // value for 'reason'
 *   },
 * });
 */
export function useCancelTransactionMutation(baseOptions?: Apollo.MutationHookOptions<CancelTransactionMutation, CancelTransactionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CancelTransactionMutation, CancelTransactionMutationVariables>(CancelTransactionDocument, options);
      }
export type CancelTransactionMutationHookResult = ReturnType<typeof useCancelTransactionMutation>;
export type CancelTransactionMutationResult = Apollo.MutationResult<CancelTransactionMutation>;
export type CancelTransactionMutationOptions = Apollo.BaseMutationOptions<CancelTransactionMutation, CancelTransactionMutationVariables>;
export const GetCategoriesDocument = gql`
    query GetCategories {
  getCategories {
    id
    name
    parentId
  }
}
    `;

/**
 * __useGetCategoriesQuery__
 *
 * To run a query within a React component, call `useGetCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCategoriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCategoriesQuery(baseOptions?: Apollo.QueryHookOptions<GetCategoriesQuery, GetCategoriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCategoriesQuery, GetCategoriesQueryVariables>(GetCategoriesDocument, options);
      }
export function useGetCategoriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCategoriesQuery, GetCategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCategoriesQuery, GetCategoriesQueryVariables>(GetCategoriesDocument, options);
        }
export function useGetCategoriesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCategoriesQuery, GetCategoriesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCategoriesQuery, GetCategoriesQueryVariables>(GetCategoriesDocument, options);
        }
export type GetCategoriesQueryHookResult = ReturnType<typeof useGetCategoriesQuery>;
export type GetCategoriesLazyQueryHookResult = ReturnType<typeof useGetCategoriesLazyQuery>;
export type GetCategoriesSuspenseQueryHookResult = ReturnType<typeof useGetCategoriesSuspenseQuery>;
export type GetCategoriesQueryResult = Apollo.QueryResult<GetCategoriesQuery, GetCategoriesQueryVariables>;
export const GetListingByIdDocument = gql`
    query GetListingById($id: ID!) {
  getListingById(id: $id) {
    id
    title
    description
    images
    price
    sold
    city {
      id
      name
      region {
        name
        country {
          name
        }
      }
    }
    customCity
    condition
    createdAt
    user {
      id
      username
      profileImageUrl
      email
      storeBranding {
        slug
      }
    }
  }
}
    `;

/**
 * __useGetListingByIdQuery__
 *
 * To run a query within a React component, call `useGetListingByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetListingByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetListingByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetListingByIdQuery(baseOptions: Apollo.QueryHookOptions<GetListingByIdQuery, GetListingByIdQueryVariables> & ({ variables: GetListingByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetListingByIdQuery, GetListingByIdQueryVariables>(GetListingByIdDocument, options);
      }
export function useGetListingByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetListingByIdQuery, GetListingByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetListingByIdQuery, GetListingByIdQueryVariables>(GetListingByIdDocument, options);
        }
export function useGetListingByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetListingByIdQuery, GetListingByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetListingByIdQuery, GetListingByIdQueryVariables>(GetListingByIdDocument, options);
        }
export type GetListingByIdQueryHookResult = ReturnType<typeof useGetListingByIdQuery>;
export type GetListingByIdLazyQueryHookResult = ReturnType<typeof useGetListingByIdLazyQuery>;
export type GetListingByIdSuspenseQueryHookResult = ReturnType<typeof useGetListingByIdSuspenseQuery>;
export type GetListingByIdQueryResult = Apollo.QueryResult<GetListingByIdQuery, GetListingByIdQueryVariables>;
export const GetListingsDocument = gql`
    query GetListings($limit: Int!, $offset: Int!, $categoryId: ID, $minPrice: Float, $maxPrice: Float, $condition: Condition, $cityId: ID, $searchTerm: String, $minDate: String, $maxDate: String, $sortBy: String, $sortOrder: String, $userId: ID) {
  getListings(
    limit: $limit
    offset: $offset
    categoryId: $categoryId
    minPrice: $minPrice
    maxPrice: $maxPrice
    condition: $condition
    cityId: $cityId
    searchTerm: $searchTerm
    minDate: $minDate
    maxDate: $maxDate
    sortBy: $sortBy
    sortOrder: $sortOrder
    userId: $userId
  ) {
    listings {
      id
      title
      description
      images
      price
      sold
      city {
        id
        name
        region {
          name
          country {
            name
          }
        }
      }
      customCity
      condition
      createdAt
      expiresAt
      user {
        id
        username
        profileImageUrl
      }
    }
    totalCount
  }
}
    `;

/**
 * __useGetListingsQuery__
 *
 * To run a query within a React component, call `useGetListingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetListingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetListingsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      categoryId: // value for 'categoryId'
 *      minPrice: // value for 'minPrice'
 *      maxPrice: // value for 'maxPrice'
 *      condition: // value for 'condition'
 *      cityId: // value for 'cityId'
 *      searchTerm: // value for 'searchTerm'
 *      minDate: // value for 'minDate'
 *      maxDate: // value for 'maxDate'
 *      sortBy: // value for 'sortBy'
 *      sortOrder: // value for 'sortOrder'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetListingsQuery(baseOptions: Apollo.QueryHookOptions<GetListingsQuery, GetListingsQueryVariables> & ({ variables: GetListingsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetListingsQuery, GetListingsQueryVariables>(GetListingsDocument, options);
      }
export function useGetListingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetListingsQuery, GetListingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetListingsQuery, GetListingsQueryVariables>(GetListingsDocument, options);
        }
export function useGetListingsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetListingsQuery, GetListingsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetListingsQuery, GetListingsQueryVariables>(GetListingsDocument, options);
        }
export type GetListingsQueryHookResult = ReturnType<typeof useGetListingsQuery>;
export type GetListingsLazyQueryHookResult = ReturnType<typeof useGetListingsLazyQuery>;
export type GetListingsSuspenseQueryHookResult = ReturnType<typeof useGetListingsSuspenseQuery>;
export type GetListingsQueryResult = Apollo.QueryResult<GetListingsQuery, GetListingsQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    id
    username
    email
    firstName
    lastName
    bio
    profileImageUrl
    planType
    role
    city {
      id
      name
      region {
        name
        country {
          name
        }
      }
    }
    customCity
    contactNumber
    idPhotoUrl
    driversLicenseUrl
    proofOfAddressUrl
    storeBranding {
      slug
    }
    subscription {
      status
      planType
    }
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export function useMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeSuspenseQueryHookResult = ReturnType<typeof useMeSuspenseQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const GetSellerProfileDocument = gql`
    query GetSellerProfile($id: ID!) {
  user(id: $id) {
    id
    username
    email
    createdAt
    profileImageUrl
    firstName
    lastName
    bio
    city {
      id
      name
      region {
        name
        country {
          name
        }
      }
    }
    customCity
    contactNumber
    trustRating {
      overallScore
      verificationScore
      profileScore
      reviewScore
      transactionScore
      totalReviews
      positiveReviews
      starRating
      trustLevel
    }
    profileCompletion {
      id
      hasProfilePhoto
      hasBio
      hasContactNumber
      hasLocation
      hasIdDocument
      hasDriversLicense
      hasProofOfAddress
      completionPercentage
      createdAt
      updatedAt
    }
    subscription {
      planType
    }
    storeBranding {
      slug
      logoUrl
      bannerUrl
      themeColor
      about
    }
    listings {
      id
      title
      price
      images
      sold
      createdAt
    }
  }
}
    `;

/**
 * __useGetSellerProfileQuery__
 *
 * To run a query within a React component, call `useGetSellerProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSellerProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSellerProfileQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetSellerProfileQuery(baseOptions: Apollo.QueryHookOptions<GetSellerProfileQuery, GetSellerProfileQueryVariables> & ({ variables: GetSellerProfileQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSellerProfileQuery, GetSellerProfileQueryVariables>(GetSellerProfileDocument, options);
      }
export function useGetSellerProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSellerProfileQuery, GetSellerProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSellerProfileQuery, GetSellerProfileQueryVariables>(GetSellerProfileDocument, options);
        }
export function useGetSellerProfileSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSellerProfileQuery, GetSellerProfileQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSellerProfileQuery, GetSellerProfileQueryVariables>(GetSellerProfileDocument, options);
        }
export type GetSellerProfileQueryHookResult = ReturnType<typeof useGetSellerProfileQuery>;
export type GetSellerProfileLazyQueryHookResult = ReturnType<typeof useGetSellerProfileLazyQuery>;
export type GetSellerProfileSuspenseQueryHookResult = ReturnType<typeof useGetSellerProfileSuspenseQuery>;
export type GetSellerProfileQueryResult = Apollo.QueryResult<GetSellerProfileQuery, GetSellerProfileQueryVariables>;
export const GetMyStoreBrandingDocument = gql`
    query GetMyStoreBranding($userId: ID!) {
  user(id: $userId) {
    id
    planType
    storeBranding {
      slug
      logoUrl
      bannerUrl
      themeColor
      primaryColor
      secondaryColor
      lightOrDark
      about
      storeName
    }
  }
}
    `;

/**
 * __useGetMyStoreBrandingQuery__
 *
 * To run a query within a React component, call `useGetMyStoreBrandingQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyStoreBrandingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyStoreBrandingQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetMyStoreBrandingQuery(baseOptions: Apollo.QueryHookOptions<GetMyStoreBrandingQuery, GetMyStoreBrandingQueryVariables> & ({ variables: GetMyStoreBrandingQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyStoreBrandingQuery, GetMyStoreBrandingQueryVariables>(GetMyStoreBrandingDocument, options);
      }
export function useGetMyStoreBrandingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyStoreBrandingQuery, GetMyStoreBrandingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyStoreBrandingQuery, GetMyStoreBrandingQueryVariables>(GetMyStoreBrandingDocument, options);
        }
export function useGetMyStoreBrandingSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMyStoreBrandingQuery, GetMyStoreBrandingQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMyStoreBrandingQuery, GetMyStoreBrandingQueryVariables>(GetMyStoreBrandingDocument, options);
        }
export type GetMyStoreBrandingQueryHookResult = ReturnType<typeof useGetMyStoreBrandingQuery>;
export type GetMyStoreBrandingLazyQueryHookResult = ReturnType<typeof useGetMyStoreBrandingLazyQuery>;
export type GetMyStoreBrandingSuspenseQueryHookResult = ReturnType<typeof useGetMyStoreBrandingSuspenseQuery>;
export type GetMyStoreBrandingQueryResult = Apollo.QueryResult<GetMyStoreBrandingQuery, GetMyStoreBrandingQueryVariables>;
export const UpdateStoreBrandingDocument = gql`
    mutation UpdateStoreBranding($id: ID!, $slug: String, $logoUrl: String, $bannerUrl: String, $themeColor: String, $primaryColor: String, $secondaryColor: String, $lightOrDark: String, $about: String, $storeName: String) {
  updateStoreBranding(
    id: $id
    slug: $slug
    logoUrl: $logoUrl
    bannerUrl: $bannerUrl
    themeColor: $themeColor
    primaryColor: $primaryColor
    secondaryColor: $secondaryColor
    lightOrDark: $lightOrDark
    about: $about
    storeName: $storeName
  ) {
    storeBranding {
      slug
      logoUrl
      bannerUrl
      themeColor
      primaryColor
      secondaryColor
      lightOrDark
      about
      storeName
    }
  }
}
    `;
export type UpdateStoreBrandingMutationFn = Apollo.MutationFunction<UpdateStoreBrandingMutation, UpdateStoreBrandingMutationVariables>;

/**
 * __useUpdateStoreBrandingMutation__
 *
 * To run a mutation, you first call `useUpdateStoreBrandingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateStoreBrandingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateStoreBrandingMutation, { data, loading, error }] = useUpdateStoreBrandingMutation({
 *   variables: {
 *      id: // value for 'id'
 *      slug: // value for 'slug'
 *      logoUrl: // value for 'logoUrl'
 *      bannerUrl: // value for 'bannerUrl'
 *      themeColor: // value for 'themeColor'
 *      primaryColor: // value for 'primaryColor'
 *      secondaryColor: // value for 'secondaryColor'
 *      lightOrDark: // value for 'lightOrDark'
 *      about: // value for 'about'
 *      storeName: // value for 'storeName'
 *   },
 * });
 */
export function useUpdateStoreBrandingMutation(baseOptions?: Apollo.MutationHookOptions<UpdateStoreBrandingMutation, UpdateStoreBrandingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateStoreBrandingMutation, UpdateStoreBrandingMutationVariables>(UpdateStoreBrandingDocument, options);
      }
export type UpdateStoreBrandingMutationHookResult = ReturnType<typeof useUpdateStoreBrandingMutation>;
export type UpdateStoreBrandingMutationResult = Apollo.MutationResult<UpdateStoreBrandingMutation>;
export type UpdateStoreBrandingMutationOptions = Apollo.BaseMutationOptions<UpdateStoreBrandingMutation, UpdateStoreBrandingMutationVariables>;
export const GetStoreBySlugFullDocument = gql`
    query GetStoreBySlugFull($slug: String!) {
  storeBySlug(slug: $slug) {
    id
    username
    planType
    storeBranding {
      slug
      logoUrl
      bannerUrl
      themeColor
      lightOrDark
      primaryColor
      secondaryColor
      about
      storeName
    }
    trustRating {
      starRating
      trustLevel
      overallScore
      totalReviews
      positiveReviews
    }
    listings {
      id
      title
      description
      price
      images
      condition
      city {
        id
        name
        region {
          name
          country {
            name
          }
        }
      }
      customCity
      createdAt
      expiresAt
      sold
    }
  }
}
    `;

/**
 * __useGetStoreBySlugFullQuery__
 *
 * To run a query within a React component, call `useGetStoreBySlugFullQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStoreBySlugFullQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStoreBySlugFullQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useGetStoreBySlugFullQuery(baseOptions: Apollo.QueryHookOptions<GetStoreBySlugFullQuery, GetStoreBySlugFullQueryVariables> & ({ variables: GetStoreBySlugFullQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStoreBySlugFullQuery, GetStoreBySlugFullQueryVariables>(GetStoreBySlugFullDocument, options);
      }
export function useGetStoreBySlugFullLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStoreBySlugFullQuery, GetStoreBySlugFullQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStoreBySlugFullQuery, GetStoreBySlugFullQueryVariables>(GetStoreBySlugFullDocument, options);
        }
export function useGetStoreBySlugFullSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetStoreBySlugFullQuery, GetStoreBySlugFullQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetStoreBySlugFullQuery, GetStoreBySlugFullQueryVariables>(GetStoreBySlugFullDocument, options);
        }
export type GetStoreBySlugFullQueryHookResult = ReturnType<typeof useGetStoreBySlugFullQuery>;
export type GetStoreBySlugFullLazyQueryHookResult = ReturnType<typeof useGetStoreBySlugFullLazyQuery>;
export type GetStoreBySlugFullSuspenseQueryHookResult = ReturnType<typeof useGetStoreBySlugFullSuspenseQuery>;
export type GetStoreBySlugFullQueryResult = Apollo.QueryResult<GetStoreBySlugFullQuery, GetStoreBySlugFullQueryVariables>;
export const GetStoreBySlugMinimalDocument = gql`
    query GetStoreBySlugMinimal($slug: String!) {
  storeBySlug(slug: $slug) {
    id
    username
    planType
    storeBranding {
      slug
      storeName
      logoUrl
    }
  }
}
    `;

/**
 * __useGetStoreBySlugMinimalQuery__
 *
 * To run a query within a React component, call `useGetStoreBySlugMinimalQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStoreBySlugMinimalQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStoreBySlugMinimalQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useGetStoreBySlugMinimalQuery(baseOptions: Apollo.QueryHookOptions<GetStoreBySlugMinimalQuery, GetStoreBySlugMinimalQueryVariables> & ({ variables: GetStoreBySlugMinimalQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStoreBySlugMinimalQuery, GetStoreBySlugMinimalQueryVariables>(GetStoreBySlugMinimalDocument, options);
      }
export function useGetStoreBySlugMinimalLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStoreBySlugMinimalQuery, GetStoreBySlugMinimalQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStoreBySlugMinimalQuery, GetStoreBySlugMinimalQueryVariables>(GetStoreBySlugMinimalDocument, options);
        }
export function useGetStoreBySlugMinimalSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetStoreBySlugMinimalQuery, GetStoreBySlugMinimalQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetStoreBySlugMinimalQuery, GetStoreBySlugMinimalQueryVariables>(GetStoreBySlugMinimalDocument, options);
        }
export type GetStoreBySlugMinimalQueryHookResult = ReturnType<typeof useGetStoreBySlugMinimalQuery>;
export type GetStoreBySlugMinimalLazyQueryHookResult = ReturnType<typeof useGetStoreBySlugMinimalLazyQuery>;
export type GetStoreBySlugMinimalSuspenseQueryHookResult = ReturnType<typeof useGetStoreBySlugMinimalSuspenseQuery>;
export type GetStoreBySlugMinimalQueryResult = Apollo.QueryResult<GetStoreBySlugMinimalQuery, GetStoreBySlugMinimalQueryVariables>;
export const GetMyPurchasesDocument = gql`
    query GetMyPurchases {
  myPurchases {
    id
    listing {
      id
      title
      description
      images
      price
      city {
        name
        region {
          name
          country {
            name
          }
        }
      }
      customCity
      condition
      user {
        id
        username
        profileImageUrl
      }
    }
    seller {
      id
      username
      profileImageUrl
    }
    buyer {
      id
      username
      profileImageUrl
    }
    salePrice
    saleDate
    status
    paymentMethod
    notes
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetMyPurchasesQuery__
 *
 * To run a query within a React component, call `useGetMyPurchasesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyPurchasesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyPurchasesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMyPurchasesQuery(baseOptions?: Apollo.QueryHookOptions<GetMyPurchasesQuery, GetMyPurchasesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyPurchasesQuery, GetMyPurchasesQueryVariables>(GetMyPurchasesDocument, options);
      }
export function useGetMyPurchasesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyPurchasesQuery, GetMyPurchasesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyPurchasesQuery, GetMyPurchasesQueryVariables>(GetMyPurchasesDocument, options);
        }
export function useGetMyPurchasesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMyPurchasesQuery, GetMyPurchasesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMyPurchasesQuery, GetMyPurchasesQueryVariables>(GetMyPurchasesDocument, options);
        }
export type GetMyPurchasesQueryHookResult = ReturnType<typeof useGetMyPurchasesQuery>;
export type GetMyPurchasesLazyQueryHookResult = ReturnType<typeof useGetMyPurchasesLazyQuery>;
export type GetMyPurchasesSuspenseQueryHookResult = ReturnType<typeof useGetMyPurchasesSuspenseQuery>;
export type GetMyPurchasesQueryResult = Apollo.QueryResult<GetMyPurchasesQuery, GetMyPurchasesQueryVariables>;
export const GetMySalesDocument = gql`
    query GetMySales {
  mySales {
    id
    listing {
      id
      title
      description
      images
      price
      city {
        name
        region {
          name
          country {
            name
          }
        }
      }
      customCity
      condition
      user {
        id
        username
        profileImageUrl
      }
    }
    seller {
      id
      username
      profileImageUrl
    }
    buyer {
      id
      username
      profileImageUrl
    }
    salePrice
    saleDate
    status
    paymentMethod
    notes
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetMySalesQuery__
 *
 * To run a query within a React component, call `useGetMySalesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMySalesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMySalesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMySalesQuery(baseOptions?: Apollo.QueryHookOptions<GetMySalesQuery, GetMySalesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMySalesQuery, GetMySalesQueryVariables>(GetMySalesDocument, options);
      }
export function useGetMySalesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMySalesQuery, GetMySalesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMySalesQuery, GetMySalesQueryVariables>(GetMySalesDocument, options);
        }
export function useGetMySalesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMySalesQuery, GetMySalesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMySalesQuery, GetMySalesQueryVariables>(GetMySalesDocument, options);
        }
export type GetMySalesQueryHookResult = ReturnType<typeof useGetMySalesQuery>;
export type GetMySalesLazyQueryHookResult = ReturnType<typeof useGetMySalesLazyQuery>;
export type GetMySalesSuspenseQueryHookResult = ReturnType<typeof useGetMySalesSuspenseQuery>;
export type GetMySalesQueryResult = Apollo.QueryResult<GetMySalesQuery, GetMySalesQueryVariables>;
export const GetMyCompletedPurchasesDocument = gql`
    query GetMyCompletedPurchases {
  myCompletedPurchases {
    id
    listing {
      id
      title
      description
      images
      price
      city {
        name
        region {
          name
          country {
            name
          }
        }
      }
      customCity
      condition
      user {
        id
        username
        profileImageUrl
      }
    }
    seller {
      id
      username
      profileImageUrl
    }
    buyer {
      id
      username
      profileImageUrl
    }
    salePrice
    saleDate
    status
    paymentMethod
    notes
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetMyCompletedPurchasesQuery__
 *
 * To run a query within a React component, call `useGetMyCompletedPurchasesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyCompletedPurchasesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyCompletedPurchasesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMyCompletedPurchasesQuery(baseOptions?: Apollo.QueryHookOptions<GetMyCompletedPurchasesQuery, GetMyCompletedPurchasesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyCompletedPurchasesQuery, GetMyCompletedPurchasesQueryVariables>(GetMyCompletedPurchasesDocument, options);
      }
export function useGetMyCompletedPurchasesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyCompletedPurchasesQuery, GetMyCompletedPurchasesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyCompletedPurchasesQuery, GetMyCompletedPurchasesQueryVariables>(GetMyCompletedPurchasesDocument, options);
        }
export function useGetMyCompletedPurchasesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMyCompletedPurchasesQuery, GetMyCompletedPurchasesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMyCompletedPurchasesQuery, GetMyCompletedPurchasesQueryVariables>(GetMyCompletedPurchasesDocument, options);
        }
export type GetMyCompletedPurchasesQueryHookResult = ReturnType<typeof useGetMyCompletedPurchasesQuery>;
export type GetMyCompletedPurchasesLazyQueryHookResult = ReturnType<typeof useGetMyCompletedPurchasesLazyQuery>;
export type GetMyCompletedPurchasesSuspenseQueryHookResult = ReturnType<typeof useGetMyCompletedPurchasesSuspenseQuery>;
export type GetMyCompletedPurchasesQueryResult = Apollo.QueryResult<GetMyCompletedPurchasesQuery, GetMyCompletedPurchasesQueryVariables>;
export const GetMyCompletedSalesDocument = gql`
    query GetMyCompletedSales {
  myCompletedSales {
    id
    listing {
      id
      title
      description
      images
      price
      city {
        name
        region {
          name
          country {
            name
          }
        }
      }
      customCity
      condition
      user {
        id
        username
        profileImageUrl
      }
    }
    seller {
      id
      username
      profileImageUrl
    }
    buyer {
      id
      username
      profileImageUrl
    }
    salePrice
    saleDate
    status
    paymentMethod
    notes
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetMyCompletedSalesQuery__
 *
 * To run a query within a React component, call `useGetMyCompletedSalesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyCompletedSalesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyCompletedSalesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMyCompletedSalesQuery(baseOptions?: Apollo.QueryHookOptions<GetMyCompletedSalesQuery, GetMyCompletedSalesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyCompletedSalesQuery, GetMyCompletedSalesQueryVariables>(GetMyCompletedSalesDocument, options);
      }
export function useGetMyCompletedSalesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyCompletedSalesQuery, GetMyCompletedSalesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyCompletedSalesQuery, GetMyCompletedSalesQueryVariables>(GetMyCompletedSalesDocument, options);
        }
export function useGetMyCompletedSalesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMyCompletedSalesQuery, GetMyCompletedSalesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMyCompletedSalesQuery, GetMyCompletedSalesQueryVariables>(GetMyCompletedSalesDocument, options);
        }
export type GetMyCompletedSalesQueryHookResult = ReturnType<typeof useGetMyCompletedSalesQuery>;
export type GetMyCompletedSalesLazyQueryHookResult = ReturnType<typeof useGetMyCompletedSalesLazyQuery>;
export type GetMyCompletedSalesSuspenseQueryHookResult = ReturnType<typeof useGetMyCompletedSalesSuspenseQuery>;
export type GetMyCompletedSalesQueryResult = Apollo.QueryResult<GetMyCompletedSalesQuery, GetMyCompletedSalesQueryVariables>;
export const GetTransactionDocument = gql`
    query GetTransaction($transactionId: ID!) {
  getTransaction(transactionId: $transactionId) {
    id
    listing {
      id
      title
      description
      images
      price
      city {
        name
        region {
          name
          country {
            name
          }
        }
      }
      customCity
      condition
      user {
        id
        username
        profileImageUrl
      }
    }
    seller {
      id
      username
      profileImageUrl
    }
    buyer {
      id
      username
      profileImageUrl
    }
    salePrice
    saleDate
    status
    paymentMethod
    notes
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetTransactionQuery__
 *
 * To run a query within a React component, call `useGetTransactionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTransactionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTransactionQuery({
 *   variables: {
 *      transactionId: // value for 'transactionId'
 *   },
 * });
 */
export function useGetTransactionQuery(baseOptions: Apollo.QueryHookOptions<GetTransactionQuery, GetTransactionQueryVariables> & ({ variables: GetTransactionQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTransactionQuery, GetTransactionQueryVariables>(GetTransactionDocument, options);
      }
export function useGetTransactionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTransactionQuery, GetTransactionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTransactionQuery, GetTransactionQueryVariables>(GetTransactionDocument, options);
        }
export function useGetTransactionSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTransactionQuery, GetTransactionQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTransactionQuery, GetTransactionQueryVariables>(GetTransactionDocument, options);
        }
export type GetTransactionQueryHookResult = ReturnType<typeof useGetTransactionQuery>;
export type GetTransactionLazyQueryHookResult = ReturnType<typeof useGetTransactionLazyQuery>;
export type GetTransactionSuspenseQueryHookResult = ReturnType<typeof useGetTransactionSuspenseQuery>;
export type GetTransactionQueryResult = Apollo.QueryResult<GetTransactionQuery, GetTransactionQueryVariables>;
export const GetMyReviewForTransactionDocument = gql`
    query GetMyReviewForTransaction($transactionId: ID!) {
  getMyReviewForTransaction(transactionId: $transactionId) {
    id
    reviewer {
      id
      username
      profileImageUrl
    }
    reviewedUser {
      id
      username
      profileImageUrl
    }
    transaction {
      id
      listing {
        id
        title
      }
      salePrice
      saleDate
    }
    rating
    comment
    isPositive
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetMyReviewForTransactionQuery__
 *
 * To run a query within a React component, call `useGetMyReviewForTransactionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyReviewForTransactionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyReviewForTransactionQuery({
 *   variables: {
 *      transactionId: // value for 'transactionId'
 *   },
 * });
 */
export function useGetMyReviewForTransactionQuery(baseOptions: Apollo.QueryHookOptions<GetMyReviewForTransactionQuery, GetMyReviewForTransactionQueryVariables> & ({ variables: GetMyReviewForTransactionQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyReviewForTransactionQuery, GetMyReviewForTransactionQueryVariables>(GetMyReviewForTransactionDocument, options);
      }
export function useGetMyReviewForTransactionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyReviewForTransactionQuery, GetMyReviewForTransactionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyReviewForTransactionQuery, GetMyReviewForTransactionQueryVariables>(GetMyReviewForTransactionDocument, options);
        }
export function useGetMyReviewForTransactionSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMyReviewForTransactionQuery, GetMyReviewForTransactionQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMyReviewForTransactionQuery, GetMyReviewForTransactionQueryVariables>(GetMyReviewForTransactionDocument, options);
        }
export type GetMyReviewForTransactionQueryHookResult = ReturnType<typeof useGetMyReviewForTransactionQuery>;
export type GetMyReviewForTransactionLazyQueryHookResult = ReturnType<typeof useGetMyReviewForTransactionLazyQuery>;
export type GetMyReviewForTransactionSuspenseQueryHookResult = ReturnType<typeof useGetMyReviewForTransactionSuspenseQuery>;
export type GetMyReviewForTransactionQueryResult = Apollo.QueryResult<GetMyReviewForTransactionQuery, GetMyReviewForTransactionQueryVariables>;
export const GetTrustRatingDocument = gql`
    query GetTrustRating($userId: ID!) {
  getTrustRating(userId: $userId) {
    id
    userId
    overallScore
    verificationScore
    profileScore
    reviewScore
    transactionScore
    totalReviews
    positiveReviews
    totalTransactions
    successfulTransactions
    lastCalculated
    createdAt
    updatedAt
    starRating
    trustLevel
  }
}
    `;

/**
 * __useGetTrustRatingQuery__
 *
 * To run a query within a React component, call `useGetTrustRatingQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTrustRatingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTrustRatingQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetTrustRatingQuery(baseOptions: Apollo.QueryHookOptions<GetTrustRatingQuery, GetTrustRatingQueryVariables> & ({ variables: GetTrustRatingQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTrustRatingQuery, GetTrustRatingQueryVariables>(GetTrustRatingDocument, options);
      }
export function useGetTrustRatingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTrustRatingQuery, GetTrustRatingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTrustRatingQuery, GetTrustRatingQueryVariables>(GetTrustRatingDocument, options);
        }
export function useGetTrustRatingSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTrustRatingQuery, GetTrustRatingQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTrustRatingQuery, GetTrustRatingQueryVariables>(GetTrustRatingDocument, options);
        }
export type GetTrustRatingQueryHookResult = ReturnType<typeof useGetTrustRatingQuery>;
export type GetTrustRatingLazyQueryHookResult = ReturnType<typeof useGetTrustRatingLazyQuery>;
export type GetTrustRatingSuspenseQueryHookResult = ReturnType<typeof useGetTrustRatingSuspenseQuery>;
export type GetTrustRatingQueryResult = Apollo.QueryResult<GetTrustRatingQuery, GetTrustRatingQueryVariables>;
export const GetUserReviewsDocument = gql`
    query GetUserReviews($userId: ID!) {
  getUserReviews(userId: $userId) {
    id
    reviewer {
      id
      username
      profileImageUrl
    }
    reviewedUser {
      id
      username
      profileImageUrl
    }
    transaction {
      id
      listing {
        id
        title
      }
      salePrice
      saleDate
    }
    rating
    comment
    isPositive
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetUserReviewsQuery__
 *
 * To run a query within a React component, call `useGetUserReviewsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserReviewsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserReviewsQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetUserReviewsQuery(baseOptions: Apollo.QueryHookOptions<GetUserReviewsQuery, GetUserReviewsQueryVariables> & ({ variables: GetUserReviewsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserReviewsQuery, GetUserReviewsQueryVariables>(GetUserReviewsDocument, options);
      }
export function useGetUserReviewsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserReviewsQuery, GetUserReviewsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserReviewsQuery, GetUserReviewsQueryVariables>(GetUserReviewsDocument, options);
        }
export function useGetUserReviewsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserReviewsQuery, GetUserReviewsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserReviewsQuery, GetUserReviewsQueryVariables>(GetUserReviewsDocument, options);
        }
export type GetUserReviewsQueryHookResult = ReturnType<typeof useGetUserReviewsQuery>;
export type GetUserReviewsLazyQueryHookResult = ReturnType<typeof useGetUserReviewsLazyQuery>;
export type GetUserReviewsSuspenseQueryHookResult = ReturnType<typeof useGetUserReviewsSuspenseQuery>;
export type GetUserReviewsQueryResult = Apollo.QueryResult<GetUserReviewsQuery, GetUserReviewsQueryVariables>;
export const GetUserPositiveReviewsDocument = gql`
    query GetUserPositiveReviews($userId: ID!) {
  getUserPositiveReviews(userId: $userId) {
    id
    reviewer {
      id
      username
      profileImageUrl
    }
    reviewedUser {
      id
      username
      profileImageUrl
    }
    transaction {
      id
      listing {
        id
        title
      }
      salePrice
      saleDate
    }
    rating
    comment
    isPositive
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetUserPositiveReviewsQuery__
 *
 * To run a query within a React component, call `useGetUserPositiveReviewsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserPositiveReviewsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserPositiveReviewsQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetUserPositiveReviewsQuery(baseOptions: Apollo.QueryHookOptions<GetUserPositiveReviewsQuery, GetUserPositiveReviewsQueryVariables> & ({ variables: GetUserPositiveReviewsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserPositiveReviewsQuery, GetUserPositiveReviewsQueryVariables>(GetUserPositiveReviewsDocument, options);
      }
export function useGetUserPositiveReviewsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserPositiveReviewsQuery, GetUserPositiveReviewsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserPositiveReviewsQuery, GetUserPositiveReviewsQueryVariables>(GetUserPositiveReviewsDocument, options);
        }
export function useGetUserPositiveReviewsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserPositiveReviewsQuery, GetUserPositiveReviewsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserPositiveReviewsQuery, GetUserPositiveReviewsQueryVariables>(GetUserPositiveReviewsDocument, options);
        }
export type GetUserPositiveReviewsQueryHookResult = ReturnType<typeof useGetUserPositiveReviewsQuery>;
export type GetUserPositiveReviewsLazyQueryHookResult = ReturnType<typeof useGetUserPositiveReviewsLazyQuery>;
export type GetUserPositiveReviewsSuspenseQueryHookResult = ReturnType<typeof useGetUserPositiveReviewsSuspenseQuery>;
export type GetUserPositiveReviewsQueryResult = Apollo.QueryResult<GetUserPositiveReviewsQuery, GetUserPositiveReviewsQueryVariables>;
export const GetUserNegativeReviewsDocument = gql`
    query GetUserNegativeReviews($userId: ID!) {
  getUserNegativeReviews(userId: $userId) {
    id
    reviewer {
      id
      username
      profileImageUrl
    }
    reviewedUser {
      id
      username
      profileImageUrl
    }
    transaction {
      id
      listing {
        id
        title
      }
      salePrice
      saleDate
    }
    rating
    comment
    isPositive
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetUserNegativeReviewsQuery__
 *
 * To run a query within a React component, call `useGetUserNegativeReviewsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserNegativeReviewsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserNegativeReviewsQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetUserNegativeReviewsQuery(baseOptions: Apollo.QueryHookOptions<GetUserNegativeReviewsQuery, GetUserNegativeReviewsQueryVariables> & ({ variables: GetUserNegativeReviewsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserNegativeReviewsQuery, GetUserNegativeReviewsQueryVariables>(GetUserNegativeReviewsDocument, options);
      }
export function useGetUserNegativeReviewsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserNegativeReviewsQuery, GetUserNegativeReviewsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserNegativeReviewsQuery, GetUserNegativeReviewsQueryVariables>(GetUserNegativeReviewsDocument, options);
        }
export function useGetUserNegativeReviewsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserNegativeReviewsQuery, GetUserNegativeReviewsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserNegativeReviewsQuery, GetUserNegativeReviewsQueryVariables>(GetUserNegativeReviewsDocument, options);
        }
export type GetUserNegativeReviewsQueryHookResult = ReturnType<typeof useGetUserNegativeReviewsQuery>;
export type GetUserNegativeReviewsLazyQueryHookResult = ReturnType<typeof useGetUserNegativeReviewsLazyQuery>;
export type GetUserNegativeReviewsSuspenseQueryHookResult = ReturnType<typeof useGetUserNegativeReviewsSuspenseQuery>;
export type GetUserNegativeReviewsQueryResult = Apollo.QueryResult<GetUserNegativeReviewsQuery, GetUserNegativeReviewsQueryVariables>;
export const GetUserAverageRatingDocument = gql`
    query GetUserAverageRating($userId: ID!) {
  getUserAverageRating(userId: $userId)
}
    `;

/**
 * __useGetUserAverageRatingQuery__
 *
 * To run a query within a React component, call `useGetUserAverageRatingQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserAverageRatingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserAverageRatingQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetUserAverageRatingQuery(baseOptions: Apollo.QueryHookOptions<GetUserAverageRatingQuery, GetUserAverageRatingQueryVariables> & ({ variables: GetUserAverageRatingQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserAverageRatingQuery, GetUserAverageRatingQueryVariables>(GetUserAverageRatingDocument, options);
      }
export function useGetUserAverageRatingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserAverageRatingQuery, GetUserAverageRatingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserAverageRatingQuery, GetUserAverageRatingQueryVariables>(GetUserAverageRatingDocument, options);
        }
export function useGetUserAverageRatingSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserAverageRatingQuery, GetUserAverageRatingQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserAverageRatingQuery, GetUserAverageRatingQueryVariables>(GetUserAverageRatingDocument, options);
        }
export type GetUserAverageRatingQueryHookResult = ReturnType<typeof useGetUserAverageRatingQuery>;
export type GetUserAverageRatingLazyQueryHookResult = ReturnType<typeof useGetUserAverageRatingLazyQuery>;
export type GetUserAverageRatingSuspenseQueryHookResult = ReturnType<typeof useGetUserAverageRatingSuspenseQuery>;
export type GetUserAverageRatingQueryResult = Apollo.QueryResult<GetUserAverageRatingQuery, GetUserAverageRatingQueryVariables>;
export const GetUserReviewCountDocument = gql`
    query GetUserReviewCount($userId: ID!) {
  getUserReviewCount(userId: $userId)
}
    `;

/**
 * __useGetUserReviewCountQuery__
 *
 * To run a query within a React component, call `useGetUserReviewCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserReviewCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserReviewCountQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetUserReviewCountQuery(baseOptions: Apollo.QueryHookOptions<GetUserReviewCountQuery, GetUserReviewCountQueryVariables> & ({ variables: GetUserReviewCountQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserReviewCountQuery, GetUserReviewCountQueryVariables>(GetUserReviewCountDocument, options);
      }
export function useGetUserReviewCountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserReviewCountQuery, GetUserReviewCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserReviewCountQuery, GetUserReviewCountQueryVariables>(GetUserReviewCountDocument, options);
        }
export function useGetUserReviewCountSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserReviewCountQuery, GetUserReviewCountQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserReviewCountQuery, GetUserReviewCountQueryVariables>(GetUserReviewCountDocument, options);
        }
export type GetUserReviewCountQueryHookResult = ReturnType<typeof useGetUserReviewCountQuery>;
export type GetUserReviewCountLazyQueryHookResult = ReturnType<typeof useGetUserReviewCountLazyQuery>;
export type GetUserReviewCountSuspenseQueryHookResult = ReturnType<typeof useGetUserReviewCountSuspenseQuery>;
export type GetUserReviewCountQueryResult = Apollo.QueryResult<GetUserReviewCountQuery, GetUserReviewCountQueryVariables>;
export const GetUserPositiveReviewCountDocument = gql`
    query GetUserPositiveReviewCount($userId: ID!) {
  getUserPositiveReviewCount(userId: $userId)
}
    `;

/**
 * __useGetUserPositiveReviewCountQuery__
 *
 * To run a query within a React component, call `useGetUserPositiveReviewCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserPositiveReviewCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserPositiveReviewCountQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetUserPositiveReviewCountQuery(baseOptions: Apollo.QueryHookOptions<GetUserPositiveReviewCountQuery, GetUserPositiveReviewCountQueryVariables> & ({ variables: GetUserPositiveReviewCountQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserPositiveReviewCountQuery, GetUserPositiveReviewCountQueryVariables>(GetUserPositiveReviewCountDocument, options);
      }
export function useGetUserPositiveReviewCountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserPositiveReviewCountQuery, GetUserPositiveReviewCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserPositiveReviewCountQuery, GetUserPositiveReviewCountQueryVariables>(GetUserPositiveReviewCountDocument, options);
        }
export function useGetUserPositiveReviewCountSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserPositiveReviewCountQuery, GetUserPositiveReviewCountQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserPositiveReviewCountQuery, GetUserPositiveReviewCountQueryVariables>(GetUserPositiveReviewCountDocument, options);
        }
export type GetUserPositiveReviewCountQueryHookResult = ReturnType<typeof useGetUserPositiveReviewCountQuery>;
export type GetUserPositiveReviewCountLazyQueryHookResult = ReturnType<typeof useGetUserPositiveReviewCountLazyQuery>;
export type GetUserPositiveReviewCountSuspenseQueryHookResult = ReturnType<typeof useGetUserPositiveReviewCountSuspenseQuery>;
export type GetUserPositiveReviewCountQueryResult = Apollo.QueryResult<GetUserPositiveReviewCountQuery, GetUserPositiveReviewCountQueryVariables>;
export const GetUsersDocument = gql`
    query GetUsers {
  getAllUsers {
    id
    username
    email
    city {
      id
      name
      region {
        name
        country {
          name
        }
      }
    }
    customCity
  }
}
    `;

/**
 * __useGetUsersQuery__
 *
 * To run a query within a React component, call `useGetUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUsersQuery(baseOptions?: Apollo.QueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
      }
export function useGetUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
        }
export function useGetUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
        }
export type GetUsersQueryHookResult = ReturnType<typeof useGetUsersQuery>;
export type GetUsersLazyQueryHookResult = ReturnType<typeof useGetUsersLazyQuery>;
export type GetUsersSuspenseQueryHookResult = ReturnType<typeof useGetUsersSuspenseQuery>;
export type GetUsersQueryResult = Apollo.QueryResult<GetUsersQuery, GetUsersQueryVariables>;
export const SearchUsersDocument = gql`
    query SearchUsers($searchTerm: String!) {
  searchUsers(searchTerm: $searchTerm) {
    id
    username
    email
    profileImageUrl
    firstName
    lastName
    city {
      id
      name
      region {
        name
        country {
          name
        }
      }
    }
    trustRating {
      overallScore
      starRating
      trustLevel
      totalReviews
      totalTransactions
      successfulTransactions
    }
  }
}
    `;

/**
 * __useSearchUsersQuery__
 *
 * To run a query within a React component, call `useSearchUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchUsersQuery({
 *   variables: {
 *      searchTerm: // value for 'searchTerm'
 *   },
 * });
 */
export function useSearchUsersQuery(baseOptions: Apollo.QueryHookOptions<SearchUsersQuery, SearchUsersQueryVariables> & ({ variables: SearchUsersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchUsersQuery, SearchUsersQueryVariables>(SearchUsersDocument, options);
      }
export function useSearchUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchUsersQuery, SearchUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchUsersQuery, SearchUsersQueryVariables>(SearchUsersDocument, options);
        }
export function useSearchUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchUsersQuery, SearchUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SearchUsersQuery, SearchUsersQueryVariables>(SearchUsersDocument, options);
        }
export type SearchUsersQueryHookResult = ReturnType<typeof useSearchUsersQuery>;
export type SearchUsersLazyQueryHookResult = ReturnType<typeof useSearchUsersLazyQuery>;
export type SearchUsersSuspenseQueryHookResult = ReturnType<typeof useSearchUsersSuspenseQuery>;
export type SearchUsersQueryResult = Apollo.QueryResult<SearchUsersQuery, SearchUsersQueryVariables>;
export const GetUserVerificationDocumentsDocument = gql`
    query GetUserVerificationDocuments($userId: ID!) {
  getUserVerificationDocuments(userId: $userId) {
    id
    userId
    documentType
    documentUrl
    status
    uploadedAt
    verifiedAt
    notes
  }
}
    `;

/**
 * __useGetUserVerificationDocumentsQuery__
 *
 * To run a query within a React component, call `useGetUserVerificationDocumentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserVerificationDocumentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserVerificationDocumentsQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetUserVerificationDocumentsQuery(baseOptions: Apollo.QueryHookOptions<GetUserVerificationDocumentsQuery, GetUserVerificationDocumentsQueryVariables> & ({ variables: GetUserVerificationDocumentsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserVerificationDocumentsQuery, GetUserVerificationDocumentsQueryVariables>(GetUserVerificationDocumentsDocument, options);
      }
export function useGetUserVerificationDocumentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserVerificationDocumentsQuery, GetUserVerificationDocumentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserVerificationDocumentsQuery, GetUserVerificationDocumentsQueryVariables>(GetUserVerificationDocumentsDocument, options);
        }
export function useGetUserVerificationDocumentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserVerificationDocumentsQuery, GetUserVerificationDocumentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserVerificationDocumentsQuery, GetUserVerificationDocumentsQueryVariables>(GetUserVerificationDocumentsDocument, options);
        }
export type GetUserVerificationDocumentsQueryHookResult = ReturnType<typeof useGetUserVerificationDocumentsQuery>;
export type GetUserVerificationDocumentsLazyQueryHookResult = ReturnType<typeof useGetUserVerificationDocumentsLazyQuery>;
export type GetUserVerificationDocumentsSuspenseQueryHookResult = ReturnType<typeof useGetUserVerificationDocumentsSuspenseQuery>;
export type GetUserVerificationDocumentsQueryResult = Apollo.QueryResult<GetUserVerificationDocumentsQuery, GetUserVerificationDocumentsQueryVariables>;
export const MyListingsDocument = gql`
    query MyListings($limit: Int, $offset: Int) {
  myListings(limit: $limit, offset: $offset) {
    listings {
      id
      title
      description
      images
      price
      sold
      city {
        id
        name
        region {
          name
          country {
            name
          }
        }
      }
      customCity
      condition
      createdAt
      expiresAt
      user {
        id
        username
        profileImageUrl
      }
    }
    totalCount
  }
}
    `;

/**
 * __useMyListingsQuery__
 *
 * To run a query within a React component, call `useMyListingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyListingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyListingsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useMyListingsQuery(baseOptions?: Apollo.QueryHookOptions<MyListingsQuery, MyListingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyListingsQuery, MyListingsQueryVariables>(MyListingsDocument, options);
      }
export function useMyListingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyListingsQuery, MyListingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyListingsQuery, MyListingsQueryVariables>(MyListingsDocument, options);
        }
export function useMyListingsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MyListingsQuery, MyListingsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MyListingsQuery, MyListingsQueryVariables>(MyListingsDocument, options);
        }
export type MyListingsQueryHookResult = ReturnType<typeof useMyListingsQuery>;
export type MyListingsLazyQueryHookResult = ReturnType<typeof useMyListingsLazyQuery>;
export type MyListingsSuspenseQueryHookResult = ReturnType<typeof useMyListingsSuspenseQuery>;
export type MyListingsQueryResult = Apollo.QueryResult<MyListingsQuery, MyListingsQueryVariables>;
export const SearchCitiesDocument = gql`
    query SearchCities($query: String!) {
  searchCities(query: $query) {
    id
    name
    region {
      id
      name
      country {
        id
        name
        code
      }
    }
  }
}
    `;

/**
 * __useSearchCitiesQuery__
 *
 * To run a query within a React component, call `useSearchCitiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchCitiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchCitiesQuery({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useSearchCitiesQuery(baseOptions: Apollo.QueryHookOptions<SearchCitiesQuery, SearchCitiesQueryVariables> & ({ variables: SearchCitiesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchCitiesQuery, SearchCitiesQueryVariables>(SearchCitiesDocument, options);
      }
export function useSearchCitiesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchCitiesQuery, SearchCitiesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchCitiesQuery, SearchCitiesQueryVariables>(SearchCitiesDocument, options);
        }
export function useSearchCitiesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchCitiesQuery, SearchCitiesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SearchCitiesQuery, SearchCitiesQueryVariables>(SearchCitiesDocument, options);
        }
export type SearchCitiesQueryHookResult = ReturnType<typeof useSearchCitiesQuery>;
export type SearchCitiesLazyQueryHookResult = ReturnType<typeof useSearchCitiesLazyQuery>;
export type SearchCitiesSuspenseQueryHookResult = ReturnType<typeof useSearchCitiesSuspenseQuery>;
export type SearchCitiesQueryResult = Apollo.QueryResult<SearchCitiesQuery, SearchCitiesQueryVariables>;
export const LoginDocument = gql`
    mutation Login($emailOrUsername: String!, $password: String!) {
  login(emailOrUsername: $emailOrUsername, password: $password) {
    token
    email
    role
    userId
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      emailOrUsername: // value for 'emailOrUsername'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;