import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import AISupportAgentWrapper from "@/components/ai/AISupportAgentWrapper";
import CookieConsentWrapper from "@/components/CookieConsentWrapper";
import { ThemeProvider } from "@/components/theme-provider";
import { generateDynamicMetadata } from "@/lib/metadata";

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

export async function generateMetadata(): Promise<Metadata> {
  const dynamicMetadata = await generateDynamicMetadata();

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
      canonical: `/`,
    },
    openGraph: {
      ...dynamicMetadata.openGraph,
      type: 'website',
      locale: 'en',
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

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  // Get messages for the current locale
  const messages = await getMessages();

  return (
    <html suppressHydrationWarning>
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
