import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import "../globals.css";
import { Toaster } from "@/components/ui/toaster";
import AISupportAgentWrapper from "@/components/ai/AISupportAgentWrapper";
import CookieConsentWrapper from "@/components/CookieConsentWrapper";
import { ThemeProvider } from "@/components/theme-provider";
import { generateDynamicMetadata } from "@/lib/metadata";
import { locales, type Locale } from "@/i18n/request";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dynamicMetadata = await generateDynamicMetadata();
  
  // Generate hreflang alternates for SEO
  const languages: Record<string, string> = {};
  locales.forEach((loc) => {
    languages[loc] = `https://modernagency.com/${loc}`;
  });
  
  return {
    ...dynamicMetadata,
    keywords: ["web agency", "web development", "UI/UX design", "digital marketing", "e-commerce", "mobile apps", "professional services", "digital transformation"],
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(dynamicMetadata.openGraph?.url || 'https://modernagency.com'),
    alternates: {
      canonical: `/${locale}`,
      languages,
    },
    openGraph: {
      ...dynamicMetadata.openGraph,
      type: 'website',
      locale: locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: dynamicMetadata.title as string,
      description: dynamicMetadata.description as string,
      creator: '@modernagency',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  
  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Get messages for the locale
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
            <AISupportAgentWrapper />
            <CookieConsentWrapper />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}