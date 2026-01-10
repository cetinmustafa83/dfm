// This layout wraps all pages under the [locale] dynamic segment
// Since localePrefix is 'never', the root layout handles html/body tags
// This layout just passes through children
export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
