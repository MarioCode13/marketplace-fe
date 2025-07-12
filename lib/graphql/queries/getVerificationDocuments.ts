import { gql } from '@apollo/client';
import { VerificationDocument } from '../types/trust';

export const GET_USER_VERIFICATION_DOCUMENTS = gql`
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

export interface GetUserVerificationDocumentsData {
  getUserVerificationDocuments: VerificationDocument[];
}

export interface GetUserVerificationDocumentsVars {
  userId: string;
} 