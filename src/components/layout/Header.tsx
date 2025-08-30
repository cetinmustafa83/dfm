"use client";

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const Header = () => {
  const t = useTranslations('Header');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const locales = ['de', 'en', 'tr'];

  const handleLocaleChange = (newLocale: string) => {
    // The pathname will be like /en/about, we need to remove the current locale
    const newPath = pathname.startsWith(`/${locale}`) ? pathname.substring(`/${locale}`.length) || '/' : pathname;
    router.push(`/${newLocale}${newPath}`);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            DFM Solutions
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-gray-600 hover:text-blue-600">{t('home')}</Link>
          <Link href="/about" className="text-gray-600 hover:text-blue-600">{t('about')}</Link>
          <Link href="/services" className="text-gray-600 hover:text-blue-600">{t('services')}</Link>
          <Link href="/contact" className="text-gray-600 hover:text-blue-600">{t('contact')}</Link>
          <Link href="/day-care" className="text-gray-600 hover:text-blue-600">{t('dayCare')}</Link>
          <Link href="/career" className="text-gray-600 hover:text-blue-600">{t('career')}</Link>
        </nav>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Globe className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {locales.map((loc) => (
                <DropdownMenuItem key={loc} onClick={() => handleLocaleChange(loc)}>
                  {loc.toUpperCase()}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
