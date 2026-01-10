'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Cookie, Shield } from 'lucide-react'
import Link from 'next/link'

interface CookieConsentProps {
  position?: 'bottom' | 'top' | 'center'
  theme?: 'light' | 'dark'
}

export default function CookieConsent({ position = 'bottom', theme = 'light' }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [preferences, setPreferences] = useState({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  })
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) {
      setIsVisible(true)
    } else {
      try {
        const saved = JSON.parse(consent)
        setPreferences(saved)
      } catch (e) {
        console.error('Failed to parse cookie consent', e)
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
    setPreferences(allAccepted)
    localStorage.setItem('cookie_consent', JSON.stringify(allAccepted))
    localStorage.setItem('cookie_consent_date', new Date().toISOString())
    setIsVisible(false)
  }

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    }
    setPreferences(onlyNecessary)
    localStorage.setItem('cookie_consent', JSON.stringify(onlyNecessary))
    localStorage.setItem('cookie_consent_date', new Date().toISOString())
    setIsVisible(false)
  }

  const handleSavePreferences = () => {
    localStorage.setItem('cookie_consent', JSON.stringify(preferences))
    localStorage.setItem('cookie_consent_date', new Date().toISOString())
    setIsVisible(false)
  }

  if (!isVisible) return null

  const positionClasses = {
    bottom: 'bottom-0 left-0 right-0',
    top: 'top-0 left-0 right-0',
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  }

  const themeClasses = {
    light: 'bg-background border-border',
    dark: 'bg-gray-900 border-gray-800 text-white',
  }

  return (
    <div className={`fixed ${positionClasses[position]} z-50 p-4 animate-in slide-in-from-bottom-4 duration-500`}>
      <Card className={`max-w-4xl mx-auto shadow-2xl ${themeClasses[theme]}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Cookie className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Cookie Settings</CardTitle>
                <CardDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
                  We use cookies to enhance your experience
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRejectAll}
              className="rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}`}>
            We use cookies and similar technologies to provide, protect, and improve our services. 
            By clicking "Accept All", you consent to the use of all cookies. You can customize your preferences below.
          </p>

          {showDetails && (
            <div className="space-y-4 pt-4 border-t">
              {/* Necessary Cookies */}
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <p className="font-medium text-sm">Necessary Cookies</p>
                    <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-0.5 rounded">
                      Always Active
                    </span>
                  </div>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>
                    Essential for the website to function properly. These cookies enable core functionality such as security, 
                    network management, and accessibility. They cannot be disabled.
                  </p>
                </div>
              </div>

              {/* Functional Cookies */}
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">Functional Cookies</p>
                  </div>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>
                    Enable enhanced functionality and personalization, such as remembering your preferences and settings.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.functional}
                    onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">Analytics Cookies</p>
                  </div>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>
                    Help us understand how visitors interact with our website by collecting and reporting information anonymously.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">Marketing Cookies</p>
                  </div>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>
                    Used to track visitors across websites to display relevant and engaging advertisements.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <Button
              variant="link"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs p-0 h-auto"
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </Button>
            <span className="text-xs text-muted-foreground">•</span>
            <Link href="/datenschutz" className="text-xs text-primary hover:underline">
              Privacy Policy
            </Link>
            <span className="text-xs text-muted-foreground">•</span>
            <Link href="/impressum" className="text-xs text-primary hover:underline">
              Impressum
            </Link>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-2">
          {showDetails ? (
            <>
              <Button onClick={handleSavePreferences} className="flex-1">
                Save My Preferences
              </Button>
              <Button variant="outline" onClick={handleRejectAll} className="flex-1">
                Reject All
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleAcceptAll} className="flex-1">
                Accept All Cookies
              </Button>
              <Button variant="outline" onClick={() => setShowDetails(true)} className="flex-1">
                Customize
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}