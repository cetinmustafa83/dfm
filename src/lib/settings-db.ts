import { prisma } from '@/lib/db'

export interface NavMenuItem {
  name: string
  href: string
  external?: boolean
}

export interface FooterColumn {
  title: string
  links: Array<{
    name: string
    href: string
    external?: boolean
  }>
}

export interface GeneralSettings {
  id: string
  siteName: string
  siteUrl: string
  description: string
  email: string
  phone: string
  address: string
  companyName: string
  taxId: string
  commercialRegister: string
  managingDirector: string
  companyLogoUrl: string
  websiteLogoUrl: string
  faviconUrl: string
  // Navigation Menu
  navMenu: NavMenuItem[]
  // Footer Menu
  footerColumns: FooterColumn[]
  // Hero Section
  heroTitle: string
  heroSubtitle: string
  heroDescription: string
  heroButtonText: string
  heroSecondaryButtonText: string
  heroBadgeText: string
  // Services Section
  servicesTitle: string
  servicesSubtitle: string
  servicesDescription: string
  servicesBadge: string
  // Portfolio Section
  portfolioTitle: string
  portfolioSubtitle: string
  portfolioDescription: string
  portfolioBadge: string
  // Blog Section
  blogTitle: string
  blogSubtitle: string
  blogDescription: string
  blogBadge: string
  // Testimonials Section
  testimonialsTitle: string
  testimonialsSubtitle: string
  testimonialsDescription: string
  testimonialsBadge: string
  // Contact Section
  contactTitle: string
  contactDescription: string
  contactFormTitle: string
  contactFormDescription: string
  contactEmail: string
  contactPhone: string
  contactAddress: string
}

export interface PaymentSettings {
  id: string
  paypal: {
    enabled: boolean
    clientId: string
    clientSecret: string
    webhookId: string
    testMode: boolean
  }
  mollie: {
    enabled: boolean
    apiKey: string
    webhookUrl: string
    testMode: boolean
  }
  bankTransfer: {
    enabled: boolean
    bankName: string
    accountHolder: string
    iban: string
    bic: string
    currency: string
    instructions: string
  }
}

export interface InvoiceSettings {
  id: string
  template: string
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  logoUrl: string
  logoWidth: number
  headerText: string
  footerText: string
  showPayPalQR: boolean
  showBankQR: boolean
  taxRate: number
  currency: string
  invoicePrefix: string
  invoiceNumberStart: number
}

export interface AISettings {
  id: string
  provider: string
  baseUrl: string
  apiKey: string
  model: string
  textModel: string
  searchModel: string
  imageModel: string
  maxTokens: number
  temperature: number
  seoOptimization: boolean
  contentGeneration: boolean
  autoBlogging: boolean
  blogSchedule: string
  webSearch: {
    topics: string[]
    categories: string[]
    sampleUrls: string[]
  }
  supportAgent: {
    enabled: boolean
    agentId: string
    agentName: string
    agentDescription: string
    buttonSize: number
    position: 'bottom-right' | 'bottom-left' | 'middle-right' | 'middle-left'
    offsetX: number
    offsetY: number
    modalWidth: number
    modalHeight: number
    modalPosition: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center'
    showTooltip: boolean
    tooltipText: string
    enableRipple: boolean
    autoOpen: boolean
    autoOpenDelay: number
    themeMode: 'auto' | 'light' | 'dark'
  }
  blogAssistant: {
    enabled: boolean
    tone: 'professional' | 'casual' | 'friendly' | 'formal' | 'technical'
    length: 'short' | 'medium' | 'long'
    includeImages: boolean
    includeSources: boolean
    autoPublish: boolean
    categories: string[]
    language: string
    keywordDensity: number
  }
  seoTools: {
    enabled: boolean
    autoMetaTags: boolean
    autoKeywords: boolean
    autoDescriptions: boolean
    keywordResearch: boolean
    competitorAnalysis: boolean
    contentOptimization: boolean
    focusKeywords: string[]
    metaDescriptionLength: number
    titleLength: number
  }
  marketing: {
    enabled: boolean
    emailCampaigns: boolean
    socialMedia: boolean
    contentCalendar: boolean
    analyticsIntegration: boolean
    autoSocialPost: boolean
    platforms: string[]
    postingSchedule: string
    hashtagGeneration: boolean
    targetAudience: string
  }
}

export interface GoogleSettings {
  id: string
  analytics: {
    enabled: boolean
    measurementId: string
  }
  searchConsole: {
    enabled: boolean
    verificationCode: string
  }
  tagManager: {
    enabled: boolean
    containerId: string
  }
  recaptcha: {
    enabled: boolean
    siteKey: string
    secretKey: string
  }
}

export interface LegalSettings {
  id: string
  impressum: {
    companyName: string
    address: string
    phone: string
    email: string
    managingDirector: string
    commercialRegister: string
    registerCourt: string
    taxId: string
    content: string
  }
  datenschutz: {
    content: string
    lastUpdated: string
  }
  agb: {
    content: string
    lastUpdated: string
  }
  widerrufsrecht: {
    content: string
    lastUpdated: string
  }
  cookieConsent: {
    enabled: boolean
    position: string
    theme: string
  }
}

export interface AllSettings {
  general: GeneralSettings
  payment: PaymentSettings
  invoice: InvoiceSettings
  ai: AISettings
  google: GoogleSettings
  legal: LegalSettings
}

async function getSettingByKey(key: string): Promise<any> {
  try {
    const setting = await prisma.settings.findUnique({
      where: { key },
    })
    return setting ? JSON.parse(setting.value) : getDefaultSettings(key)
  } catch (error) {
    console.error(`Error reading setting ${key}:`, error)
    return getDefaultSettings(key)
  }
}

async function setSettingByKey(key: string, value: any): Promise<void> {
  try {
    await prisma.settings.upsert({
      where: { key },
      update: { value: JSON.stringify(value) },
      create: { key, value: JSON.stringify(value) },
    })
  } catch (error) {
    console.error(`Error writing setting ${key}:`, error)
    throw error
  }
}

function getDefaultSettings(key: string): any {
  const defaults: Record<string, any> = {
    general: {
      id: '1',
      siteName: 'My Site',
      siteUrl: 'https://example.com',
      description: 'Site description',
      email: 'info@example.com',
      phone: '+1234567890',
      address: 'Street Address',
      companyName: 'Company Name',
      taxId: 'TAX123',
      commercialRegister: 'REG123',
      managingDirector: 'Director Name',
      companyLogoUrl: '',
      websiteLogoUrl: '',
      faviconUrl: '',
      // Navigation Menu
      navMenu: [
        { name: 'Home', href: '#hero' },
        { name: 'Services', href: '#services' },
        { name: 'Portfolio', href: '#portfolio' },
        { name: 'Marketplace', href: '/marketplace' },
        { name: 'Blog', href: '#blog' },
        { name: 'Contact', href: '#contact' },
      ],
      // Footer Menu
      footerColumns: [
        {
          title: 'Services',
          links: [
            { name: 'Web Development', href: '#services' },
            { name: 'UI/UX Design', href: '#services' },
            { name: 'E-commerce', href: '#services' },
            { name: 'Mobile Apps', href: '#services' },
          ],
        },
        {
          title: 'Company',
          links: [
            { name: 'About Us', href: '/about' },
            { name: 'Careers', href: '#contact' },
            { name: 'Blog', href: '/blog' },
            { name: 'Contact', href: '#contact' },
          ],
        },
        {
          title: 'Legal',
          links: [
            { name: 'Privacy Policy', href: '/datenschutz' },
            { name: 'Terms of Service', href: '#' },
            { name: 'Cookie Policy', href: '#' },
          ],
        },
      ],
      // Hero Section
      heroTitle: 'We Create Digital',
      heroSubtitle: 'Experiences That Matter',
      heroDescription: 'Transform your online presence with stunning websites, powerful applications, and strategic digital solutions that drive real business results.',
      heroButtonText: 'Get Started',
      heroSecondaryButtonText: 'View Our Work',
      heroBadgeText: '#1 Digital Agency 2024',
      // Services Section
      servicesTitle: 'What We Do Best',
      servicesSubtitle: '',
      servicesDescription: 'Comprehensive digital solutions tailored to your unique business needs',
      servicesBadge: 'Our Services',
      // Portfolio Section
      portfolioTitle: 'Featured Projects',
      portfolioSubtitle: '',
      portfolioDescription: 'Explore our latest work and see how we have helped businesses succeed',
      portfolioBadge: 'Our Portfolio',
      // Blog Section
      blogTitle: 'Insights & Updates',
      blogSubtitle: '',
      blogDescription: 'Stay updated with the latest trends and news from the digital world',
      blogBadge: 'Latest from Our Blog',
      // Testimonials Section
      testimonialsTitle: 'What Our Clients Say',
      testimonialsSubtitle: '',
      testimonialsDescription: 'Real feedback from businesses we have helped grow',
      testimonialsBadge: 'Client Testimonials',
      // Contact Section
      contactTitle: 'Let us Build Something Amazing Together',
      contactDescription: 'Ready to transform your digital presence? Get in touch with our team today.',
      contactFormTitle: 'Send us a message',
      contactFormDescription: "We'll get back to you within 24 hours",
      contactEmail: 'hello@modernagency.com',
      contactPhone: '+1 (555) 123-4567',
      contactAddress: 'San Francisco, CA',
    },
    payment: {
      id: '1',
      paypal: {
        enabled: false,
        clientId: '',
        clientSecret: '',
        webhookId: '',
        testMode: true,
      },
      mollie: {
        enabled: false,
        apiKey: '',
        webhookUrl: '',
        testMode: true,
      },
      bankTransfer: {
        enabled: false,
        bankName: '',
        accountHolder: '',
        iban: '',
        bic: '',
        currency: 'EUR',
        instructions: 'Please use the invoice number as reference when making the bank transfer.',
      },
    },
    invoice: {
      id: '1',
      template: 'dfm',
      primaryColor: '#000000',
      secondaryColor: '#666666',
      fontFamily: 'Arial',
      logoUrl: '',
      logoWidth: 128,
      headerText: 'Unsere Lieferungen/Leistungen stellen wir Ihnen wie folgt in Rechnung.',
      footerText: 'Thank you for your business',
      showPayPalQR: true,
      showBankQR: true,
      taxRate: 19,
      currency: 'EUR',
      invoicePrefix: 'INV',
      invoiceNumberStart: 1000,
    },
    ai: {
      id: '1',
      provider: 'openai',
      baseUrl: 'https://api.openai.com/v1',
      apiKey: '',
      model: 'gpt-4',
      textModel: 'provider-8/claude-sonnet-4.5',
      searchModel: 'provider-3/sonar-pro',
      imageModel: 'provider-8/nano-banana-pro',
      maxTokens: 2000,
      temperature: 0.7,
      seoOptimization: false,
      contentGeneration: false,
      autoBlogging: false,
      blogSchedule: 'weekly',
      supportAgent: {
        enabled: false,
        agentId: '',
        agentName: 'AI Assistant',
        agentDescription: 'Online',
        buttonSize: 64,
        position: 'bottom-right',
        offsetX: 24,
        offsetY: 24,
        modalWidth: 400,
        modalHeight: 600,
        modalPosition: 'bottom-right',
        showTooltip: true,
        tooltipText: 'Need help? Chat with us!',
        enableRipple: true,
        autoOpen: false,
        autoOpenDelay: 5,
        themeMode: 'auto',
      },
      blogAssistant: {
        enabled: false,
        tone: 'professional',
        length: 'medium',
        includeImages: true,
        includeSources: true,
        autoPublish: false,
        categories: [],
        language: 'en',
        keywordDensity: 2,
      },
      seoTools: {
        enabled: false,
        autoMetaTags: true,
        autoKeywords: true,
        autoDescriptions: true,
        keywordResearch: false,
        competitorAnalysis: false,
        contentOptimization: true,
        focusKeywords: [],
        metaDescriptionLength: 160,
        titleLength: 60,
      },
      marketing: {
        enabled: false,
        emailCampaigns: false,
        socialMedia: false,
        contentCalendar: false,
        analyticsIntegration: false,
        autoSocialPost: false,
        platforms: [],
        postingSchedule: 'daily',
        hashtagGeneration: true,
        targetAudience: '',
      },
    },
    google: {
      id: '1',
      analytics: {
        enabled: false,
        measurementId: '',
      },
      searchConsole: {
        enabled: false,
        verificationCode: '',
      },
      tagManager: {
        enabled: false,
        containerId: '',
      },
      recaptcha: {
        enabled: false,
        siteKey: '',
        secretKey: '',
      },
    },
    legal: {
      id: '1',
      impressum: {
        companyName: '',
        address: '',
        phone: '',
        email: '',
        managingDirector: '',
        commercialRegister: '',
        registerCourt: '',
        taxId: '',
        content: '',
      },
      datenschutz: {
        content: '',
        lastUpdated: new Date().toISOString(),
      },
      agb: {
        content: '',
        lastUpdated: new Date().toISOString(),
      },
      widerrufsrecht: {
        content: '',
        lastUpdated: new Date().toISOString(),
      },
      cookieConsent: {
        enabled: false,
        position: 'bottom',
        theme: 'light',
      },
    },
  }
  return defaults[key] || {}
}

// Export getSettings for invoice PDF generator
export async function getSettings(): Promise<AllSettings> {
  return settingsDb.getAll()
}

export const settingsDb = {
  async getAll(): Promise<AllSettings> {
    const [general, payment, invoice, ai, google, legal] = await Promise.all([
      getSettingByKey('general'),
      getSettingByKey('payment'),
      getSettingByKey('invoice'),
      getSettingByKey('ai'),
      getSettingByKey('google'),
      getSettingByKey('legal'),
    ])

    return {
      general,
      payment,
      invoice,
      ai,
      google,
      legal,
    }
  },

  async getGeneral(): Promise<GeneralSettings> {
    return await getSettingByKey('general')
  },

  async updateGeneral(data: Partial<GeneralSettings>): Promise<void> {
    try {
      const current = await getSettingByKey('general')
      await setSettingByKey('general', { ...current, ...data })
    } catch (error) {
      console.error('Error in updateGeneral:', error)
      throw new Error(`Failed to update general settings: ${error instanceof Error ? error.message : String(error)}`)
    }
  },

  async getPayment(): Promise<PaymentSettings> {
    return await getSettingByKey('payment')
  },

  async updatePayment(data: Partial<PaymentSettings>): Promise<void> {
    try {
      const current = await getSettingByKey('payment')
      console.log('Current payment settings:', current)
      console.log('New payment data:', data)
      await setSettingByKey('payment', { ...current, ...data })
    } catch (error) {
      console.error('Error in updatePayment:', error)
      throw new Error(`Failed to update payment settings: ${error instanceof Error ? error.message : String(error)}`)
    }
  },

  async getInvoice(): Promise<InvoiceSettings> {
    return await getSettingByKey('invoice')
  },

  async updateInvoice(data: Partial<InvoiceSettings>): Promise<void> {
    const current = await getSettingByKey('invoice')
    await setSettingByKey('invoice', { ...current, ...data })
  },

  async getAI(): Promise<AISettings> {
    return await getSettingByKey('ai')
  },

  async updateAI(data: Partial<AISettings>): Promise<void> {
    const current = await getSettingByKey('ai')
    await setSettingByKey('ai', { ...current, ...data })
  },

  async getGoogle(): Promise<GoogleSettings> {
    return await getSettingByKey('google')
  },

  async updateGoogle(data: Partial<GoogleSettings>): Promise<void> {
    const current = await getSettingByKey('google')
    await setSettingByKey('google', { ...current, ...data })
  },

  async getLegal(): Promise<LegalSettings> {
    return await getSettingByKey('legal')
  },

  async updateLegal(data: Partial<LegalSettings>): Promise<void> {
    const current = await getSettingByKey('legal')
    await setSettingByKey('legal', { ...current, ...data })
  },
}