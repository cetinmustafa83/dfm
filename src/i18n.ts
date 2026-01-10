import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Import all message files
import en from './messages/en.json';
import de from './messages/de.json';
import nl from './messages/nl.json';
import fr from './messages/fr.json';
import da from './messages/da.json';
import es from './messages/es.json';
import cs from './messages/cs.json';
import hu from './messages/hu.json';
import tr from './messages/tr.json';
import bg from './messages/bg.json';
import ro from './messages/ro.json';

// Supported locales
export const locales = ['en', 'de', 'nl', 'fr', 'da', 'es', 'cs', 'hu', 'tr', 'bg', 'ro'] as const;
export type Locale = (typeof locales)[number];

// Default locale
export const defaultLocale: Locale = 'en';

// Locale labels for language switcher
export const localeLabels: Record<Locale, { name: string; flag: string }> = {
  en: { name: 'English', flag: '🇬🇧' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  nl: { name: 'Nederlands', flag: '🇳🇱' },
  fr: { name: 'Français', flag: '🇫🇷' },
  da: { name: 'Dansk', flag: '🇩🇰' },
  es: { name: 'Español', flag: '🇪🇸' },
  cs: { name: 'Čeština', flag: '🇨🇿' },
  hu: { name: 'Magyar', flag: '🇭🇺' },
  tr: { name: 'Türkçe', flag: '🇹🇷' },
  bg: { name: 'Български', flag: '🇧🇬' },
  ro: { name: 'Română', flag: '🇷🇴' },
};

// Messages map
const messages: Record<Locale, any> = {
  en,
  de,
  nl,
  fr,
  da,
  es,
  cs,
  hu,
  tr,
  bg,
  ro,
};

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: messages[locale as Locale]
  };
});
