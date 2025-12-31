import { redirect } from 'next/navigation'

// This file is required to prevent Next.js from generating a /404 page
// which causes Html import errors with next-intl middleware.
// Instead, we redirect all not-found cases to the default locale.
export default function RootNotFound() {
  // Redirect to default locale's not-found page
  redirect('/en')
}
