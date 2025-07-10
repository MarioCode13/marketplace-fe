# 🛒 Marketplace App – Frontend

This is the frontend for a full-stack marketplace application built with [Next.js](https://nextjs.org). Users can browse listings, post second-hand items for sale, and manage their profile – all in one modern, mobile-responsive UI.

The app is connected to a Spring Boot backend via GraphQL, and handles secure image uploads, listing management, and real-time updates via push notifications.

---

## ⚙️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org) (App Router)
- **UI**: Tailwind CSS
- **State/Data**: Apollo Client (GraphQL)
- **Image Handling**: REST image upload to Backblaze B2
- **Auth**: JWT-based (via backend)
- **Forms**: React Hook Form + Zod
- **Deployment**: [Vercel](https://vercel.com) (recommended)

---

## 🚀 Getting Started

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/marketplace-frontend.git
cd marketplace-frontend
npm install
```

Start the local dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

---

## 🔑 Environment Variables

Create a `.env.local` file at the root with your API endpoint and image upload URL:

```env
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:8080/graphql
NEXT_PUBLIC_IMAGE_UPLOAD_URL=http://localhost:8080/api/upload
```

Make sure CORS is configured on your backend to allow frontend requests.

---

## 📦 Features

- ✅ View all active listings
- ✅ Create and edit your own listings
- ✅ Upload images to B2 storage
- ✅ Mark listings as sold (no deletions)
- ✅ Filter by category, condition, and search query
- ✅ View listing history
- ✅ Push notifications for listing changes (coming soon)

---

## 📁 Project Structure

```
/graphql/queries/      → All GraphQL queries
/graphql/mutations/    → All GraphQL mutations
/components/           → UI components
/app/                  → Route-based pages
/context/              → Apollo & Auth context
/styles/               → Global Tailwind styles
```

---

## 🛠️ To Do

- [x] Dark mode
- [ ] Notification system
- [ ] Favorites / saved listings
- [x] Infinite scroll or pagination
- [ ] Seller ratings and profiles
