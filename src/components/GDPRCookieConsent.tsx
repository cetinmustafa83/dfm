'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Cookie, Shield, AlertTriangle, Info, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import { consentManager, SERVICES, type CookiePreferences } from '@/lib/cookie-consent-manager'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface GDPRCookieConsentProps {
  position?: 'bottom' | 'top' | 'center'
  theme?: 'light' | 'dark'
}

export default function GDPRCookieConsent({ position = 'bottom', theme = 'light' }: GDPRCookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [showFloatingButton, setShowFloatingButton] = useState(false)
  const [preferences, setPreferences] = useState({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    // Check if user has already made a choice
    const hasConsent = consentManager.hasConsent()
    if (!hasConsent) {
      setIsVisible(true)
      setShowFloatingButton(false)
    } else {
      setShowFloatingButton(true)
      const saved = consentManager.getPreferences()
      if (saved) {
        setPreferences({
          necessary: saved.necessary,
          functional: saved.functional,
          analytics: saved.analytics,
          marketing: saved.marketing,
        })
      }
    }
  }, [])

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    }
    consentManager.savePreferences(allAccepted)
    setPreferences(allAccepted)
    setIsVisible(false)
    setShowFloatingButton(true)
  }

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    }
    consentManager.savePreferences(onlyNecessary)
    setPreferences(onlyNecessary)
    setIsVisible(false)
    setShowFloatingButton(true)
  }

  const handleSavePreferences = () => {
    consentManager.savePreferences(preferences)
    setIsVisible(false)
    setShowFloatingButton(true)
  }

  const handleOpenSettings = () => {
    setIsVisible(true)
    setShowDetails(true)
  }

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  const FloatingCookieButton = () => {
    if (!showFloatingButton || isVisible) return null

    return (
      <button
        onClick={handleOpenSettings}
        className="fixed bottom-4 left-4 z-[998] p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group"
        aria-label="Cookie-Einstellungen öffnen"
        title="Cookie-Einstellungen"
      >
        <Cookie className="h-6 w-6" />
        <span className="absolute left-full ml-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
          Cookie-Einstellungen
        </span>
      </button>
    )
  }

  if (!isVisible) return <FloatingCookieButton />

  const positionClasses = {
    bottom: 'bottom-0 left-0 right-0',
    top: 'top-0 left-0 right-0',
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  }

  const themeClasses = {
    light: 'bg-background border-border',
    dark: 'bg-gray-900 border-gray-800 text-white',
  }

  const necessaryServices = SERVICES.filter(s => s.category === 'necessary')
  const functionalServices = SERVICES.filter(s => s.category === 'functional')
  const analyticsServices = SERVICES.filter(s => s.category === 'analytics')
  const marketingServices = SERVICES.filter(s => s.category === 'marketing')

  return (
    <>
      <FloatingCookieButton />
      
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] animate-in fade-in duration-300" />
      
      {/* Cookie Banner */}
      <div className={`fixed ${positionClasses[position]} z-[1000] p-4 animate-in slide-in-from-bottom-8 duration-500`}>
        <Card className={`max-w-5xl mx-auto shadow-2xl border-2 ${themeClasses[theme]}`}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2.5 bg-primary/10 rounded-lg shrink-0">
                  <Cookie className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl font-bold mb-1">
                    Cookie-Einstellungen
                  </CardTitle>
                  <CardDescription className={`text-base ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}`}>
                    Wir respektieren Ihre Privatsphäre und halten uns an die DSGVO
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRejectAll}
                className="rounded-full shrink-0 hover:bg-destructive/10"
                title="Alle ablehnen und schließen"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Warning Notice */}
            <div className="flex gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-amber-900 dark:text-amber-200 text-sm mb-1">
                  Wichtiger Hinweis zur Datenverarbeitung
                </p>
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  Durch die Nutzung dieser Website werden personenbezogene Daten verarbeitet. 
                  Wir setzen Cookies und Dienste von Drittanbietern nur nach Ihrer ausdrücklichen Einwilligung ein. 
                  Sie können Ihre Einwilligung jederzeit widerrufen.
                </p>
              </div>
            </div>

            {/* Main Description */}
            <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}`}>
              Diese Website verwendet Cookies und ähnliche Technologien, um Ihnen ein optimales Nutzererlebnis zu bieten. 
              Einige Cookies sind technisch notwendig, andere helfen uns, die Website zu verbessern oder ermöglichen Marketing-Funktionen. 
              Sie haben die volle Kontrolle über Ihre Daten.
            </p>

            {showDetails && (
              <div className="space-y-4 pt-2">
                <Separator />
                
                {/* Necessary Cookies */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <h3 className="font-semibold text-base">Notwendige Cookies</h3>
                        <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs">
                          Immer aktiv
                        </Badge>
                      </div>
                      <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>
                        Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden. 
                        Sie speichern keine personenbezogenen Daten ohne Ihre Einwilligung.
                      </p>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => toggleCategory('necessary')}
                        className="text-xs p-0 h-auto text-primary"
                      >
                        {expandedCategories.has('necessary') ? (
                          <>Details ausblenden <ChevronUp className="h-3 w-3 ml-1" /></>
                        ) : (
                          <>Details anzeigen <ChevronDown className="h-3 w-3 ml-1" /></>
                        )}
                      </Button>
                      
                      {expandedCategories.has('necessary') && (
                        <div className="mt-3 space-y-2 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                          {necessaryServices.map((service) => (
                            <div key={service.name} className="text-xs">
                              <p className="font-medium text-foreground">{service.name}</p>
                              <p className="text-muted-foreground">{service.description}</p>
                              {service.cookies.length > 0 && (
                                <p className="text-muted-foreground mt-1">
                                  Cookies: {service.cookies.join(', ')}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Functional Cookies */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <h3 className="font-semibold text-base">Funktionale Cookies</h3>
                      </div>
                      <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>
                        Diese Cookies ermöglichen erweiterte Funktionen wie personalisierte Inhalte, 
                        eingebettete Karten und externe Schriftarten. Ohne diese Cookies können bestimmte Funktionen eingeschränkt sein.
                      </p>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => toggleCategory('functional')}
                        className="text-xs p-0 h-auto text-primary"
                      >
                        {expandedCategories.has('functional') ? (
                          <>Details ausblenden <ChevronUp className="h-3 w-3 ml-1" /></>
                        ) : (
                          <>Details anzeigen ({functionalServices.length} Dienste) <ChevronDown className="h-3 w-3 ml-1" /></>
                        )}
                      </Button>
                      
                      {expandedCategories.has('functional') && (
                        <div className="mt-3 space-y-2 pl-4 border-l-2 border-blue-200 dark:border-blue-800">
                          {functionalServices.map((service) => (
                            <div key={service.name} className="text-xs">
                              <p className="font-medium text-foreground">{service.name}</p>
                              <p className="text-muted-foreground">{service.description}</p>
                              <p className="text-muted-foreground mt-1">
                                Domains: {service.domains.join(', ')}
                              </p>
                              {service.cookies.length > 0 && (
                                <p className="text-muted-foreground">
                                  Cookies: {service.cookies.join(', ')}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={preferences.functional}
                        onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>

                <Separator />

                {/* Analytics Cookies */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        <h3 className="font-semibold text-base">Analyse-Cookies</h3>
                      </div>
                      <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>
                        Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren. 
                        Die Daten werden anonymisiert erfasst und ausgewertet, um die Website zu optimieren.
                      </p>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => toggleCategory('analytics')}
                        className="text-xs p-0 h-auto text-primary"
                      >
                        {expandedCategories.has('analytics') ? (
                          <>Details ausblenden <ChevronUp className="h-3 w-3 ml-1" /></>
                        ) : (
                          <>Details anzeigen ({analyticsServices.length} Dienste) <ChevronDown className="h-3 w-3 ml-1" /></>
                        )}
                      </Button>
                      
                      {expandedCategories.has('analytics') && (
                        <div className="mt-3 space-y-2 pl-4 border-l-2 border-purple-200 dark:border-purple-800">
                          {analyticsServices.map((service) => (
                            <div key={service.name} className="text-xs">
                              <p className="font-medium text-foreground">{service.name}</p>
                              <p className="text-muted-foreground">{service.description}</p>
                              <p className="text-muted-foreground mt-1">
                                Domains: {service.domains.join(', ')}
                              </p>
                              {service.cookies.length > 0 && (
                                <p className="text-muted-foreground">
                                  Cookies: {service.cookies.join(', ')}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>

                <Separator />

                {/* Marketing Cookies */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        <h3 className="font-semibold text-base">Marketing-Cookies</h3>
                      </div>
                      <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>
                        Diese Cookies werden verwendet, um Besuchern relevante Werbung anzuzeigen. 
                        Sie ermöglichen es, Besucher über Websites hinweg zu verfolgen und personalisierte Anzeigen zu schalten.
                      </p>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => toggleCategory('marketing')}
                        className="text-xs p-0 h-auto text-primary"
                      >
                        {expandedCategories.has('marketing') ? (
                          <>Details ausblenden <ChevronUp className="h-3 w-3 ml-1" /></>
                        ) : (
                          <>Details anzeigen ({marketingServices.length} Dienste) <ChevronDown className="h-3 w-3 ml-1" /></>
                        )}
                      </Button>
                      
                      {expandedCategories.has('marketing') && (
                        <div className="mt-3 space-y-2 pl-4 border-l-2 border-orange-200 dark:border-orange-800">
                          {marketingServices.map((service) => (
                            <div key={service.name} className="text-xs">
                              <p className="font-medium text-foreground">{service.name}</p>
                              <p className="text-muted-foreground">{service.description}</p>
                              <p className="text-muted-foreground mt-1">
                                Domains: {service.domains.join(', ')}
                              </p>
                              {service.cookies.length > 0 && (
                                <p className="text-muted-foreground">
                                  Cookies: {service.cookies.join(', ')}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>

                <Separator />

                {/* Legal Links */}
                <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}>
                    Weitere Informationen:
                  </span>
                  <Link href="/datenschutz" className="text-primary hover:underline font-medium">
                    Datenschutzerklärung
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <Link href="/impressum" className="text-primary hover:underline font-medium">
                    Impressum
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <Link href="/agb" className="text-primary hover:underline font-medium">
                    AGB
                  </Link>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-4">
            {showDetails ? (
              <>
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <Button 
                    onClick={handleSavePreferences} 
                    className="flex-1 font-semibold"
                    size="lg"
                  >
                    Auswahl speichern
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleRejectAll} 
                    className="flex-1"
                    size="lg"
                  >
                    Alle ablehnen
                  </Button>
                </div>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setShowDetails(false)}
                  className="text-sm"
                >
                  Zurück zur Übersicht
                </Button>
              </>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <Button 
                    onClick={handleAcceptAll} 
                    className="flex-1 font-semibold"
                    size="lg"
                  >
                    Alle akzeptieren
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleRejectAll} 
                    className="flex-1"
                    size="lg"
                  >
                    Nur notwendige
                  </Button>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => setShowDetails(true)}
                  className="w-full"
                  size="lg"
                >
                  Einstellungen anpassen
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </>
  )
}