/**
 * GDPR/DSGVO Compliant Cookie Consent Manager
 * Manages third-party service loading based on user consent
 */

export interface CookiePreferences {
  necessary: boolean
  functional: boolean
  analytics: boolean
  marketing: boolean
  timestamp: string
}

export interface ServiceConfig {
  name: string
  category: 'necessary' | 'functional' | 'analytics' | 'marketing'
  scripts: string[]
  domains: string[]
  cookies: string[]
  description: string
}

// Define all third-party services
export const SERVICES: ServiceConfig[] = [
  {
    name: 'Google Analytics',
    category: 'analytics',
    scripts: ['googletagmanager.com/gtag', 'google-analytics.com/analytics'],
    domains: ['google-analytics.com', 'googletagmanager.com'],
    cookies: ['_ga', '_gid', '_gat', '_gac_'],
    description: 'Tracking and analysis of website usage for optimization purposes'
  },
  {
    name: 'Google Fonts',
    category: 'functional',
    scripts: ['fonts.googleapis.com', 'fonts.gstatic.com'],
    domains: ['fonts.googleapis.com', 'fonts.gstatic.com'],
    cookies: [],
    description: 'Loading of external fonts for consistent design'
  },
  {
    name: 'Google Maps',
    category: 'functional',
    scripts: ['maps.googleapis.com', 'maps.google.com'],
    domains: ['maps.googleapis.com', 'maps.google.com'],
    cookies: ['NID', 'CONSENT'],
    description: 'Interactive maps and location services'
  },
  {
    name: 'Google reCAPTCHA',
    category: 'necessary',
    scripts: ['google.com/recaptcha', 'gstatic.com/recaptcha'],
    domains: ['google.com', 'gstatic.com'],
    cookies: ['_GRECAPTCHA'],
    description: 'Protection against spam and automated abuse'
  },
  {
    name: 'YouTube',
    category: 'marketing',
    scripts: ['youtube.com/iframe_api', 'youtube-nocookie.com'],
    domains: ['youtube.com', 'youtube-nocookie.com', 'googlevideo.com'],
    cookies: ['VISITOR_INFO1_LIVE', 'YSC', 'PREF'],
    description: 'Embedding of video content'
  },
  {
    name: 'Facebook Pixel',
    category: 'marketing',
    scripts: ['connect.facebook.net'],
    domains: ['facebook.com', 'connect.facebook.net'],
    cookies: ['_fbp', 'fr'],
    description: 'Conversion tracking and targeted advertising'
  }
]

const CONSENT_KEY = 'cookie_consent'
const CONSENT_DATE_KEY = 'cookie_consent_date'

export class CookieConsentManager {
  private static instance: CookieConsentManager
  private preferences: CookiePreferences | null = null
  private blockedScripts: Set<string> = new Set()

  private constructor() {
    this.loadPreferences()
    this.setupScriptBlocking()
  }

  static getInstance(): CookieConsentManager {
    if (!CookieConsentManager.instance) {
      CookieConsentManager.instance = new CookieConsentManager()
    }
    return CookieConsentManager.instance
  }

  private loadPreferences(): void {
    if (typeof window === 'undefined') return

    try {
      const saved = localStorage.getItem(CONSENT_KEY)
      if (saved) {
        this.preferences = JSON.parse(saved)
      }
    } catch (e) {
      console.error('Failed to load cookie preferences:', e)
    }
  }

  savePreferences(preferences: Omit<CookiePreferences, 'timestamp'>): void {
    if (typeof window === 'undefined') return

    const prefs: CookiePreferences = {
      ...preferences,
      timestamp: new Date().toISOString()
    }

    this.preferences = prefs
    localStorage.setItem(CONSENT_KEY, JSON.stringify(prefs))
    localStorage.setItem(CONSENT_DATE_KEY, prefs.timestamp)

    // Apply consent changes
    this.applyConsent()
  }

  getPreferences(): CookiePreferences | null {
    return this.preferences
  }

  hasConsent(): boolean {
    return this.preferences !== null
  }

  private setupScriptBlocking(): void {
    if (typeof window === 'undefined') return

    // Block scripts before they load
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeName === 'SCRIPT') {
            const script = node as HTMLScriptElement
            this.checkAndBlockScript(script)
          }
        })
      })
    })

    // Start observing
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      })
    }
  }

  private checkAndBlockScript(script: HTMLScriptElement): void {
    if (!this.preferences) {
      // No consent yet, block all non-necessary scripts
      const src = script.src || script.innerHTML
      const service = this.findServiceByScript(src)

      if (service && service.category !== 'necessary') {
        this.blockScript(script)
      }
      return
    }

    const src = script.src || script.innerHTML
    const service = this.findServiceByScript(src)

    if (service) {
      const hasConsent = this.preferences[service.category]
      if (!hasConsent) {
        this.blockScript(script)
      }
    }
  }

  private findServiceByScript(src: string): ServiceConfig | undefined {
    return SERVICES.find(service =>
      service.scripts.some(pattern => src.includes(pattern))
    )
  }

  private blockScript(script: HTMLScriptElement): void {
    // Change type to prevent execution
    script.type = 'text/plain'
    script.setAttribute('data-consent-blocked', 'true')

    const src = script.src || 'inline'
    this.blockedScripts.add(src)

    console.log('[Cookie Consent] Blocked script:', src)
  }

  private applyConsent(): void {
    if (!this.preferences) return

    // Remove cookies for services without consent
    SERVICES.forEach(service => {
      const hasConsent = this.preferences![service.category]
      if (!hasConsent) {
        this.removeCookies(service.cookies)
      }
    })

    // Reload blocked scripts if consent is granted
    this.reloadScriptsWithConsent()
  }

  private removeCookies(cookieNames: string[]): void {
    cookieNames.forEach(name => {
      // Remove cookie for current domain
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`

      // Try to remove for all possible domains
      const domain = window.location.hostname
      const parts = domain.split('.')

      for (let i = 0; i < parts.length; i++) {
        const testDomain = parts.slice(i).join('.')
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${testDomain}`
      }
    })
  }

  private reloadScriptsWithConsent(): void {
    // Find all blocked scripts
    const blockedScripts = document.querySelectorAll('script[data-consent-blocked="true"]')

    blockedScripts.forEach((script) => {
      const src = (script as HTMLScriptElement).src || script.innerHTML
      const service = this.findServiceByScript(src)

      if (service && this.preferences![service.category]) {
        // User has granted consent, reload script
        const newScript = document.createElement('script')

        if ((script as HTMLScriptElement).src) {
          newScript.src = (script as HTMLScriptElement).src
        } else {
          newScript.innerHTML = script.innerHTML
        }

        // Copy attributes
        Array.from(script.attributes).forEach(attr => {
          if (attr.name !== 'type' && attr.name !== 'data-consent-blocked') {
            newScript.setAttribute(attr.name, attr.value)
          }
        })

        script.parentNode?.replaceChild(newScript, script)
        console.log('[Cookie Consent] Reloaded script with consent:', src)
      }
    })
  }

  // Public method to check if a specific service has consent
  hasServiceConsent(serviceName: string): boolean {
    const service = SERVICES.find(s => s.name === serviceName)
    if (!service || !this.preferences) return false

    return this.preferences[service.category]
  }

  // Get all services by category
  getServicesByCategory(category: 'necessary' | 'functional' | 'analytics' | 'marketing'): ServiceConfig[] {
    return SERVICES.filter(s => s.category === category)
  }

  // Reset all consent
  resetConsent(): void {
    if (typeof window === 'undefined') return

    localStorage.removeItem(CONSENT_KEY)
    localStorage.removeItem(CONSENT_DATE_KEY)
    this.preferences = null

    // Remove all service cookies
    SERVICES.forEach(service => {
      this.removeCookies(service.cookies)
    })
  }
}

// Export singleton instance
export const consentManager = CookieConsentManager.getInstance()