import { settingsDb } from './settings-db'

const defaultMetadata = {
  title: 'Modern Web Agency | Professional Digital Solutions',
  description: 'We create stunning websites, powerful applications, and strategic digital solutions that drive real business results.',
  openGraph: {
    title: 'Modern Web Agency | Professional Digital Solutions',
    description: 'We create stunning websites, powerful applications, and strategic digital solutions that drive real business results.',
    url: 'https://modernagency.com',
    siteName: 'Modern Web Agency',
  },
}

export async function generateDynamicMetadata() {
  // During build time, if database is not available, return default metadata
  if (!process.env.DATABASE_URL) {
    return defaultMetadata
  }

  try {
    const settings = await settingsDb.getGeneral()

    return {
      title: `${settings.siteName || 'Modern Web Agency'} | Professional Digital Solutions`,
      description: settings.description || 'We create stunning websites, powerful applications, and strategic digital solutions that drive real business results.',
      icons: settings.faviconUrl ? {
        icon: settings.faviconUrl,
        shortcut: settings.faviconUrl,
        apple: settings.faviconUrl,
      } : undefined,
      openGraph: {
        title: `${settings.siteName || 'Modern Web Agency'} | Professional Digital Solutions`,
        description: settings.description || 'We create stunning websites, powerful applications, and strategic digital solutions that drive real business results.',
        url: settings.siteUrl || 'https://modernagency.com',
        siteName: settings.siteName || 'Modern Web Agency',
        images: settings.websiteLogoUrl ? [
          {
            url: settings.websiteLogoUrl,
            width: 1200,
            height: 630,
            alt: settings.siteName || 'Modern Web Agency',
          },
        ] : undefined,
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return defaultMetadata
  }
}