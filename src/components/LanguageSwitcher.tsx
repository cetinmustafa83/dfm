'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { Globe } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'da', name: 'Dansk', flag: '🇩🇰' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
  { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'bg', name: 'Български', flag: '🇧🇬' },
  { code: 'ro', name: 'Română', flag: '🇷🇴' },
]

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const handleLanguageChange = (newLocale: string) => {
    // Set cookie for the new locale
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`
    // Reload the page to apply the new locale
    router.refresh()
  }

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
          style={{
            backgroundColor: '#050afd',
            color: '#fff'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#0308cc'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#050afd'
          }}
          title="Change language"
        >
          <Globe className="w-5 h-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`cursor-pointer ${locale === language.code ? 'bg-accent' : ''}`}
          >
            <span className="mr-2 text-lg">{language.flag}</span>
            <span className="flex-1">{language.name}</span>
            {locale === language.code && (
              <span className="ml-2 text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}