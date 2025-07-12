import { gql } from '@apollo/client'

export const UPLOAD_VERIFICATION_DOCUMENT = gql`
  mutation UploadVerificationDocument(
    $userId: ID!
    $documentType: DocumentType!
    $documentData: String!
    $fileName: String!
  ) {
    uploadVerificationDocument(
      userId: $userId
      documentType: $documentType
      documentData: $documentData
      fileName: $fileName
    ) {
      id
      user {
        id
        username
      }
      documentType
      documentUrl
      status
      createdAt
      updatedAt
    }
  }
`

export const DELETE_VERIFICATION_DOCUMENT = gql`
  mutation DeleteVerificationDocument($documentId: ID!, $userId: ID!) {
    deleteVerificationDocument(documentId: $documentId, userId: $userId)
  }
` 