// Force all pages to be dynamically rendered to bypass build-time prerendering issues
export const dynamic = 'force-dynamic'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
