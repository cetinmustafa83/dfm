import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/request';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Don't show locale in URL
  localePrefix: 'never',
});

export default function middleware(request: NextRequest) {
  // Handle all requests with intl middleware
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  // Skip API routes, static files, and Next.js internals
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};