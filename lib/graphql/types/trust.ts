export enum DocumentType {
  ID_CARD = 'ID_CARD',
  PROOF_OF_ADDRESS = 'PROOF_OF_ADDRESS',
  PROFILE_PHOTO = 'PROFILE_PHOTO'
}

export enum VerificationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface VerificationDocument {
  id: string;
  userId: string;
  documentType: DocumentType;
  documentUrl: string;
  status: VerificationStatus;
  uploadedAt: string;
  verifiedAt?: string;
  notes?: string;
}

export interface TrustRating {
  id: string;
  userId: string;
  overallScore: number;
  documentScore: number;
  profileScore: number;
  reviewScore: number;
  transactionScore: number;
  totalReviews: number;
  positiveReviews: number;
  totalTransactions: number;
  successfulTransactions: number;
  lastCalculated: string;
  createdAt: string;
  updatedAt: string;
  starRating: number;
  trustLevel: string;
}

export type TrustLevel = 'EXCELLENT' | 'VERY_GOOD' | 'GOOD' | 'FAIR' | 'POOR' | 'VERY_POOR' | 'UNKNOWN';

export interface Review {
  id: string
  reviewer: User
  reviewedUser: User
  transaction: Transaction
  rating: number
  comment?: string
  isPositive: boolean
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: string
  listing: Listing
  seller: User
  buyer: User
  salePrice: number
  saleDate: string
  status: TransactionStatus
  paymentMethod?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Listing {
  id: string
  title: string
  description: string
  images: string[]
  category?: Category
  price: number
  sold: boolean
  city?: City;
  customCity?: string;
  condition: Condition
  createdAt: string
  expiresAt: string
  user: User
}

export interface User {
  id: string
  username: string
  email: string
  role: string
  profileImageUrl?: string
  createdAt: string
  firstName?: string
  lastName?: string
  bio?: string
  city?: City;
  customCity?: string;
  contactNumber?: string
}

export interface Category {
  id: string
  name: string
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DISPUTED = 'DISPUTED'
}

export enum Condition {
  NEW = 'NEW',
  LIKE_NEW = 'LIKE_NEW',
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  FAIR = 'FAIR',
  HEAVILY_USED = 'HEAVILY_USED',
  NEEDS_REPAIR = 'NEEDS_REPAIR',
  FOR_PARTS = 'FOR_PARTS'
}

export interface ProfileCompletion {
  id: string
  user: User
  hasProfilePhoto: boolean
  hasBio: boolean
  hasContactNumber: boolean
  hasLocation: boolean
  hasVerifiedEmail: boolean
  hasVerifiedPhone: boolean
  hasIdVerification: boolean
  hasAddressVerification: boolean
  completionPercentage: number
  createdAt: string
  updatedAt: string
}

export interface City {
  id: string;
  name: string;
  region: {
    name: string;
    country: {
      name: string;
    };
  };
} 