# Marketplace Business Rules

## Account Types
- **Personal Account:**
  - Created via `registerPersonalAccount` mutation.
  - Can only create personal listings.
  - Cannot be assigned to a business unless invited and accepted.
  - Must use a unique email not associated with a business account.
- **Business Account:**
  - Created via `registerBusinessAccount` mutation.
  - Owner is a user assigned as OWNER to the business.
  - Can invite other users to join the business (only users already registered in the system; invitation by email checks user existence).
  - All users assigned to a business act on behalf of the business (no personal listings from this account).
  - Free business account type exists: cannot create listings or access store URL until subscribed. Customisation is allowed, but no listings or public access.

## User Types & Listing Restrictions
- **Free_User:** Can create up to 3 listings. If limit exceeded, an error message is returned.
- **Verified User:** Can create up to 8 listings. If limit exceeded, an error message is returned.
- **Reseller:** Can create up to 20 listings. If limit exceeded, an error message is returned.
- **Pro Store:** Unlimited listings (business account, only if subscribed).

## Business Account Types & Team Management
- **Reseller Business:**
  - Only a single user (the owner) is associated with the business.
  - Team management features (inviting, linking, changing roles) are disabled and inaccessible.
  - Attempting to add team members or assign roles will result in an error.
- **Pro Store Business:**
  - Can invite and manage team members (OWNER, MANAGER, CONTRIBUTOR roles).
  - Team management features are available as per business rules.

## Business User Management
- Users must be invited to join a business (only existing users can be invited).
- Invitation is sent as an in-app notification (`BUSINESS_INVITE`).
- User must explicitly accept the invitation to be linked to the business.
- Accepting links the user as a CONTRIBUTOR by default (role can be changed by OWNER/MANAGER; role changes do not require user consent, but trigger a notification).
- Declining does not link the user to the business.
- No user is auto-linked to a business without their consent.

## Listing Ownership
- **Personal Account:** Listings are always owned by the user.
- **Business Account:** Listings are always owned by the business, regardless of which user created them. Listings have an optional `created_by` field for tracking.
- No context switching: business users cannot create personal listings, and personal users cannot create business listings.

## Listing Creation Permissions
- Only OWNER or MANAGER roles in a business can create business listings (if business is subscribed).
- Contributors can manage (create, view, mark as sold, delete) listings for the business, but cannot edit business details, store branding, or slug.
- Personal users can always create personal listings, subject to their user type's listing limit.

## Business User Roles & Permissions
- **Contributor:**
  - Can manage (create, view, mark as sold, delete) listings for the business (regardless of who created them).
  - Cannot edit business details, store branding, or slug.
  - Cannot invite users or change roles.
- **Manager:**
  - All Contributor permissions.
  - Can edit store branding (except slug).
  - Can invite users and set their role to manager or contributor.
  - Cannot delete the business account.
- **Owner:**
  - Full permissions: manage listings, edit all business details, edit store branding and slug, invite/remove users, change roles, and delete the business account.

## Store Branding Permissions
- Only Owner can edit slug (slug changes are not tracked).
- Manager and Owner can edit other branding details.
- Contributor cannot edit branding.

## Account Deletion
- Only Owner can delete the business account.
- When a business is deleted, all listings and user associations are deleted. Users revert to personal accounts with no business link.

## Business Subscription
- If a business subscription expires:
  - All business listings and the business itself are set to archived state (not deleted or transferred).
  - Listings remain linked to the business.
  - Store URL is inaccessible; no editing allowed until resubscribed.
  - Customisation is allowed, but no public access or listing management.
- If a business is reactivated (subscription renewed):
  - Listings and business are automatically unarchived.
  - Roles are restored.

## Archived State & Deletion
- Listings and businesses in archived state are deleted after 14 days if not reactivated.
- Automatic unarchiving occurs if subscription is renewed within 14 days.

## Notifications
- In-app notifications are used for:
  - Business invitations (accept/decline required).
  - Role changes, listing status changes, and other business actions.
- Notifications are stored in the database and can be marked as read/unread.
- No email notifications are sent.

## Security & Consent
- No user is linked to a business or given privileges without explicit acceptance.
- Role changes do not require consent, but trigger notifications.
- All actions (invitations, acceptances, declines, role changes) are tracked via notifications.

## Edge Cases
- If a user is removed from a business, they lose access to business listings and management.
- If a business is deleted, listings and user associations are deleted; users revert to personal accounts.
- If a business is reactivated, listings and roles are restored.
- Listings created by users on a business account are always associated with the business, not the user.

## Onboarding
- Users must choose account type at signup (personal or business).
- No context switching after signup; separate accounts required for personal and business actions.
- Different emails required for different account types.

---

**This document summarizes the current business rules and logic implemented in the marketplace backend and GraphQL schema as of September 2025.**
