'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Menu, X, Code, Palette, ShoppingCart, Smartphone, TrendingUp, Sparkles, ArrowRight, Mail, MapPin, Phone, Calendar, CheckCircle, Shield, Key, Moon, Sun, ChevronDown, Store, Globe, Search, FileText, Briefcase, GraduationCap, Ticket as TicketIcon, CalendarCheck } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { LoginModal } from '@/components/LoginModal'
import { TopGradientBar } from '@/components/GradientEffect'
import { useMediaQuery } from '@/hooks/use-media-query'
import { DrawerContent, HeaderDrawer } from '@/components/ui/responsive-header'
import { useTheme } from 'next-themes'
import { LiquidLogo } from '@/components/ui/LiquidLogo'
import { Liquid, Colors } from '@/components/ui/liquid-glass'
import { RandomizedTextEffect } from '@/components/ui/text-randomized'
import { Sparkles as SparklesEffect } from '@/components/sparkles'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

export default function Home() {
  const t = useTranslations()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [blogPosts, setBlogPosts] = useState<any[]>([])
  const [loadingBlog, setLoadingBlog] = useState(true)
  const [services, setServices] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [loadingContent, setLoadingContent] = useState(true)
  const [settings, setSettings] = useState<any>(null)
  const [submittingContact, setSubmittingContact] = useState(false)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [navScale, setNavScale] = useState(1)
  const [mounted, setMounted] = useState(false)
  const [showAmbient, setShowAmbient] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    // Start ambient effect 20 seconds after logo appears
    const timer = setTimeout(() => {
      setShowAmbient(true)
    }, 20000)
    
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'services', 'portfolio', 'blog', 'contact']
      for (const id of sections) {
        const element = document.getElementById(id)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(id)
            break
          }
        }
      }

      // Navigation scale effect on scroll
      const scrollY = window.scrollY
      const scrollSteps = Math.floor(scrollY / 80)
      const maxSteps = 4
      const currentStep = Math.min(scrollSteps, maxSteps)
      const scaleReduction = currentStep * 0.05
      const newScale = 1 - scaleReduction
      setNavScale(newScale)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    async function fetchContent() {
      try {
        // Fetch settings
        const settingsRes = await fetch('/api/settings')
        const settingsData = await settingsRes.json()
        setSettings(settingsData.settings)

        // Fetch services
        const servicesRes = await fetch('/api/services')
        const servicesData = await servicesRes.json()
        setServices(servicesData.slice(0, 6))

        // Fetch projects
        const projectsRes = await fetch('/api/projects')
        const projectsData = await projectsRes.json()
        setProjects(projectsData.slice(0, 4))
      } catch (error) {
        console.error('Error fetching content:', error)
      } finally {
        setLoadingContent(false)
      }
    }

    async function fetchBlogPosts() {
      try {
        const res = await fetch('/api/blog')
        const data = await res.json()
        setBlogPosts(data.slice(0, 3))
      } catch (error) {
        console.error('Error fetching blog posts:', error)
      } finally {
        setLoadingBlog(false)
      }
    }

    fetchContent()
    fetchBlogPosts()
  }, [])

  async function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmittingContact(true)

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...contactForm,
          date: new Date().toISOString().split('T')[0],
          read: false,
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to submit message')
      }

      toast({
        title: t('contact.form.successTitle'),
        description: t('contact.form.successMessage'),
      })

      setContactForm({ name: '', email: '', message: '' })
      setPrivacyAccepted(false)
    } catch (error) {
      console.error('Error submitting contact form:', error)
      toast({
        title: t('contact.form.errorTitle'),
        description: t('contact.form.errorMessage'),
        variant: 'destructive',
      })
    } finally {
      setSubmittingContact(false)
    }
  }

  // Icon mapping for services
  const iconMap: any = {
    'Code': Code,
    'Palette': Palette,
    'ShoppingCart': ShoppingCart,
    'Smartphone': Smartphone,
    'TrendingUp': TrendingUp,
    'Sparkles': Sparkles,
  }

  // Get nav links from settings or use defaults with translations
  const navLinks = settings?.general?.navMenu || [
    { name: t('navigation.home'), href: '#hero' },
    {
      name: t('navigation.company'),
      href: '#',
      dropdown: [
        { name: t('navigation.appointment'), href: '/appointment' },
        { name: t('navigation.career'), href: '/career' },
        { name: t('navigation.training'), href: '/training' },
        { name: t('navigation.ticket'), href: '/ticket' }
      ]
    },
    {
      name: t('navigation.services'),
      href: '#services',
      dropdown: [
        {
          name: t('navigation.eShopSolutions'),
          items: [
            { name: t('services.onlineShop'), href: '/services/online-shop' },
            { name: t('services.individualOnlineShop'), href: '/services/individual-online-shop' }
          ]
        },
        {
          name: t('navigation.seo'),
          items: [
            { name: t('services.searchEngineOptimization'), href: '/services/seo' },
            { name: t('services.landingPage'), href: '/services/landing-page' }
          ]
        },
        {
          name: t('navigation.webSolutions'),
          items: [
            { name: t('services.fullServiceWebsite'), href: '/services/fullservice-website' },
            { name: t('services.webVCardBasic'), href: '/services/web-vcard-basic' },
            { name: t('services.webVCardPremium'), href: '/services/web-vcard-premium' },
            { name: t('services.businessWebsiteBasic'), href: '/services/business-website-basic' },
            { name: t('services.businessWebsitePremium'), href: '/services/business-website-premium' },
            { name: t('services.individualWebsite'), href: '/services/individual-website' }
          ]
        }
      ]
    },
    { name: t('navigation.blog'), href: '#blog' },
    { name: t('navigation.contact'), href: '#contact' },
  ]

  const IconComponent = ({ icon: Icon }: { icon: any }) => {
    return <Icon className="w-6 h-6 text-primary" />
  }

  const isDesktop = useMediaQuery('(min-width: 768px)')

  // Smooth scroll handler for navigation links
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Only handle hash links
    if (href.startsWith('#')) {
      e.preventDefault()
      const targetId = href.substring(1)
      const element = document.getElementById(targetId)
      if (element) {
        const navHeight = 100 // Approximate header height + offset
        const elementPosition = element.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - navHeight

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
    }
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <header className="fixed top-[30px] left-0 right-0 z-[100] transition-all duration-300">
          <div
            className="mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300"
            style={{
              width: `${navScale * 100}%`,
              maxWidth: '1280px'
            }}
          >
            <div className="flex justify-between border items-center p-3 bg-white/70 dark:bg-black/40 backdrop-blur-xl rounded-md shadow-lg h-[76px]">
              <Link href="/" className="flex items-center space-x-2">
                {settings?.general?.websiteLogoUrl && (
                  <div className="relative inline-block group">
                    {/* Philips Hue style dancing lights effect - brand colors #050afd (blue) and #4cc57a (green) */}
                    {/* Ambient effect fades in 20 seconds after logo with very slow transition */}
                    <div
                      className="absolute inset-0 -z-10 transition-opacity duration-[2500ms] ease-in-out"
                      style={{ opacity: showAmbient ? 1 : 0 }}
                    >
                      {/* Multiple colored glows that pulse and move - using brand colors - SLOWLY ROTATING */}
                      <div className="absolute w-[200%] h-[200%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" style={{ animationDuration: '30s' }}>
                        <div className="absolute top-[20%] left-[30%] w-24 h-24 rounded-full opacity-10 blur-2xl animate-pulse" style={{ background: 'radial-gradient(circle, #050afd 0%, #4cc57a 100%)', animationDuration: '3s' }}></div>
                        <div className="absolute top-[60%] left-[60%] w-28 h-28 rounded-full opacity-8 blur-2xl animate-pulse" style={{ background: 'radial-gradient(circle, #4cc57a 0%, #050afd 100%)', animationDuration: '4s', animationDelay: '0.5s' }}></div>
                        <div className="absolute top-[40%] left-[70%] w-20 h-20 rounded-full opacity-12 blur-2xl animate-pulse" style={{ background: 'radial-gradient(circle, #050afd 0%, rgba(5, 10, 253, 0.6) 100%)', animationDuration: '3.5s', animationDelay: '1s' }}></div>
                        <div className="absolute top-[70%] left-[20%] w-26 h-26 rounded-full opacity-9 blur-2xl animate-pulse" style={{ background: 'radial-gradient(circle, #4cc57a 0%, rgba(76, 197, 122, 0.6) 100%)', animationDuration: '4.5s', animationDelay: '1.5s' }}></div>
                        <div className="absolute top-[30%] left-[50%] w-22 h-22 rounded-full opacity-11 blur-2xl animate-pulse" style={{ background: 'radial-gradient(circle, rgba(5, 10, 253, 0.8) 0%, rgba(76, 197, 122, 0.8) 100%)', animationDuration: '3.8s', animationDelay: '0.8s' }}></div>
                      </div>
                      {/* Additional rotating glow effect with brand colors */}
                      <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
                        <div className="absolute top-0 left-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl opacity-8" style={{ background: 'radial-gradient(circle, #050afd 0%, transparent 70%)' }}></div>
                      </div>
                    </div>
                    {/* Logo fades in with very slow transition */}
                    <div
                      className="transition-opacity duration-[1800ms] ease-in-out"
                      style={{ opacity: mounted ? 1 : 0 }}
                    >
                      <LiquidLogo
                        src={settings.general.websiteLogoUrl}
                        alt={settings?.general?.siteName || 'Logo'}
                        className="h-14 w-auto object-contain relative z-10"
                      />
                    </div>
                  </div>
                )}
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-6">
                {navLinks.map((link) => (
                  link.dropdown ? (
                    <div key={link.name} className="relative group">
                      <button
                        className="text-sm font-medium transition-colors hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 dark:after:bg-white after:bg-neutral-800 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom-left hover:after:scale-x-100 flex items-center gap-1"
                      >
                        {link.name}
                        <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
                      </button>
                      {/* Professional Mega Menu */}
                      <div className="absolute left-1/2 -translate-x-1/2 mt-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-border/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden"
                        style={{
                          minWidth: link.dropdown.some((item: any) => item.items) ? '750px' : '320px',
                          maxWidth: '900px'
                        }}
                      >
                        {link.dropdown.some((item: any) => item.items) ? (
                          // Professional Multi-column Mega Menu for Services
                          <div className="relative">
                            {/* Background gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
                            
                            <div className="relative p-8">
                              <div className="grid grid-cols-3 gap-8">
                                {link.dropdown.map((dropdownItem: any, idx: number) => {
                                  if (!dropdownItem.items) return null
                                  
                                  // Icon mapping for categories
                                  const categoryIcons: any = {
                                    'E-Shop Solutions': ShoppingCart,
                                    'SEO': Search,
                                    'Web Solutions': Globe
                                  }
                                  const CategoryIcon = categoryIcons[dropdownItem.name] || Code
                                  
                                  return (
                                    <div key={idx} className="space-y-4">
                                      {/* Category Header */}
                                      <div className="flex items-center gap-3 pb-3 border-b-2 border-primary/20">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0">
                                          <CategoryIcon className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                          <h3 className="text-sm font-bold text-foreground">
                                            {dropdownItem.name}
                                          </h3>
                                          <p className="text-xs text-muted-foreground">
                                            {idx === 0 ? t('navigation.eCommerceDesc') : idx === 1 ? t('navigation.optimizationDesc') : t('navigation.customWebsitesDesc')}
                                          </p>
                                        </div>
                                      </div>
                                      
                                      {/* Category Items */}
                                      <ul className="space-y-1">
                                        {dropdownItem.items.map((subItem: any, subIdx: number) => (
                                          <li key={subIdx}>
                                            <Link
                                              href={subItem.href}
                                              className="group/item flex items-start gap-2 px-3 py-2.5 rounded-lg hover:bg-primary/5 transition-all duration-200"
                                            >
                                              <ArrowRight className="w-4 h-4 text-primary mt-0.5 group-hover/item:translate-x-1 transition-transform flex-shrink-0" />
                                              <span className="text-sm text-foreground group-hover/item:text-primary transition-colors leading-tight">
                                                {subItem.name}
                                              </span>
                                            </Link>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )
                                })}
                              </div>
                              
                              {/* Call to Action Footer */}
                              <div className="mt-8 pt-6 border-t border-border/50">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-semibold text-foreground">{t('navigation.needHelp')}</p>
                                    <p className="text-xs text-muted-foreground">{t('navigation.getInTouch')}</p>
                                  </div>
                                  <Link
                                    href="#contact"
                                    className="px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-shadow"
                                  >
                                    {t('navigation.contactUs')}
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          // Professional Company Menu
                          <div className="p-6">
                            <div className="space-y-1">
                              {link.dropdown.map((dropdownItem: any, idx: number) => {
                                // Icon mapping for company items
                                const itemIcons: any = {
                                  'Appointment': CalendarCheck,
                                  'Career': Briefcase,
                                  'Training': GraduationCap,
                                  'Ticket': TicketIcon
                                }
                                const ItemIcon = itemIcons[dropdownItem.name] || CheckCircle
                                
                                return (
                                  <Link
                                    key={idx}
                                    href={dropdownItem.href}
                                    className="group/item flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-primary/5 transition-all duration-200"
                                  >
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover/item:from-primary group-hover/item:to-primary/80 transition-all">
                                      <ItemIcon className="w-5 h-5 text-primary group-hover/item:text-white transition-colors" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="text-sm font-medium text-foreground group-hover/item:text-primary transition-colors">
                                        {dropdownItem.name}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        {idx === 0 ? t('navigation.scheduleMeeting') : idx === 1 ? t('navigation.joinTeam') : idx === 2 ? t('navigation.learnWithUs') : t('navigation.getSupport')}
                                      </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover/item:text-primary group-hover/item:translate-x-1 transition-all" />
                                  </Link>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="text-sm font-medium transition-colors hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 dark:after:bg-white after:bg-neutral-800 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom-left hover:after:scale-x-100"
                    >
                      {link.name}
                    </Link>
                  )
                ))}
                <div className="flex items-center gap-[10px]">
                  <LanguageSwitcher />
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
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
                    title="Admin Login"
                  >
                    <Key className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
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
                    title="Toggle theme"
                  >
                    {mounted && (
                      theme === 'dark' ? (
                        <Sun className="w-5 h-5" />
                      ) : (
                        <Moon className="w-5 h-5" />
                      )
                    )}
                  </button>
                </div>
              </nav>

              {/* Mobile Hamburger Menu */}
              <div className="md:hidden">
                <HeaderDrawer
                  open={isMenuOpen}
                  setOpen={setIsMenuOpen}
                  drawerBtn={() => (
                    <button className="p-2 rounded-md hover:bg-accent transition-colors">
                      <Menu className="w-6 h-6" />
                    </button>
                  )}
                >
                  <DrawerContent>
                    <div className="flex justify-center w-full absolute bottom-1 left-0">
                      <div className="w-16 h-[0.30rem] shrink-0 rounded-full bg-gray-600 my-4" />
                    </div>
                    <div className="container mx-auto gap-4">
                      <div className="flex justify-center items-center border-b p-4">
                        <h1 className="text-2xl font-bold">{settings?.general?.siteName || 'ModernAgency'}</h1>
                      </div>
                      <nav className="px-4 py-6">
                        <ul className="space-y-4">
                          {navLinks.map((link) => (
                            <li key={link.name}>
                              {link.dropdown ? (
                                <div className="space-y-2">
                                  <div className="text-lg font-semibold uppercase text-primary">
                                    {link.name}
                                  </div>
                                  <ul className="ml-4 space-y-2">
                                    {link.dropdown.map((dropdownItem: any, idx: number) => (
                                      dropdownItem.items ? (
                                        <li key={idx} className="space-y-1">
                                          <div className="text-xs font-semibold text-muted-foreground uppercase">
                                            {dropdownItem.name}
                                          </div>
                                          <ul className="ml-2 space-y-1">
                                            {dropdownItem.items.map((subItem: any, subIdx: number) => (
                                              <li key={subIdx}>
                                                <Link
                                                  href={subItem.href}
                                                  onClick={() => setIsMenuOpen(false)}
                                                  className="block text-sm hover:text-primary transition-colors"
                                                >
                                                  {subItem.name}
                                                </Link>
                                              </li>
                                            ))}
                                          </ul>
                                        </li>
                                      ) : (
                                        <li key={idx}>
                                          <Link
                                            href={dropdownItem.href}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block text-sm hover:text-primary transition-colors"
                                          >
                                            {dropdownItem.name}
                                          </Link>
                                        </li>
                                      )
                                    ))}
                                  </ul>
                                </div>
                              ) : (
                                <Link
                                  href={link.href}
                                  onClick={(e) => {
                                    handleNavClick(e, link.href)
                                    setIsMenuOpen(false)
                                  }}
                                  className="block text-lg font-semibold uppercase hover:text-primary transition-colors"
                                >
                                  {link.name}
                                </Link>
                              )}
                            </li>
                          ))}
                          <li>
                            <button
                              onClick={() => {
                                setTheme(theme === 'dark' ? 'light' : 'dark')
                                setIsMenuOpen(false)
                              }}
                              className="flex items-center gap-2 text-lg font-semibold uppercase hover:text-primary transition-colors"
                            >
                              {mounted && (
                                theme === 'dark' ? (
                                  <>
                                    <Sun className="h-5 w-5" />
                                    {t('navigation.lightMode')}
                                  </>
                                ) : (
                                  <>
                                    <Moon className="h-5 w-5" />
                                    {t('navigation.darkMode')}
                                  </>
                                )
                              )}
                            </button>
                          </li>
                          <li>
                            <div className="pt-2">
                              <LanguageSwitcher />
                            </div>
                          </li>
                          <li>
                            <button
                              onClick={() => {
                                setIsLoginModalOpen(true)
                                setIsMenuOpen(false)
                              }}
                              className="flex items-center gap-2 text-lg font-semibold uppercase hover:text-primary transition-colors"
                            >
                              <Key className="h-5 w-5" />
                              {t('navigation.adminLogin')}
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </DrawerContent>
                </HeaderDrawer>
              </div>
            </div>
          </div>
        </header>

        <div className="wrapper">
          {/* Hero Section with Sticky Effect */}
          <section id="hero" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 h-screen sticky top-0 flex items-center justify-center bg-background z-[1] relative overflow-hidden">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[54px_54px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            
            {/* Sparkles Effect at Bottom */}
            <div className="absolute bottom-0 z-[2] h-[400px] w-full overflow-hidden" style={{
              maskImage: 'radial-gradient(100% 50% at 50% 100%, white, transparent)',
              WebkitMaskImage: 'radial-gradient(100% 50% at 50% 100%, white, transparent)'
            }}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_center,#3273ff,transparent_90%)] opacity-40"></div>
              <SparklesEffect
                density={1800}
                speed={1.2}
                color="#48b6ff"
                direction="top"
                className="absolute inset-x-0 bottom-0 h-full w-full"
              />
            </div>

            <div className="container mx-auto max-w-6xl relative z-10">
              <div className="text-center space-y-8">
                <Badge variant="outline" className="text-sm">
                  {settings?.general?.heroBadgeText || t('hero.badge')}
                </Badge>
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight">
                  {settings?.general?.heroTitle || t('hero.title')}
                  <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    {settings?.general?.heroSubtitle || t('hero.subtitle')}
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  {settings?.general?.heroDescription || t('hero.description')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="text-base" asChild>
                    <Link href="#contact">
                      {settings?.general?.heroButtonText || t('hero.getStarted')} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="text-base" asChild>
                    <Link href="#portfolio">
                      {settings?.general?.heroSecondaryButtonText || t('hero.viewWork')}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Services Section with Sticky Effect */}
          <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted dark:bg-gray-900 sticky top-0 rounded-tr-2xl rounded-tl-2xl min-h-screen flex items-center z-[2]">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center space-y-4 mb-16">
                <Badge variant="secondary">{settings?.general?.servicesBadge || t('services.badge')}</Badge>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                  {settings?.general?.servicesTitle || t('services.title')}
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  {settings?.general?.servicesDescription || t('services.description')}
                </p>
              </div>

              {loadingContent ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="border-2">
                      <CardHeader>
                        <div className="w-12 h-12 bg-muted animate-pulse rounded-lg mb-4" />
                        <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                        <div className="h-4 w-full bg-muted animate-pulse rounded mt-2" />
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service) => {
                    const ServiceIcon = iconMap[service.icon] || Code
                    return (
                      <Card key={service.id} className="border-2 hover:border-primary transition-all duration-300 group relative overflow-hidden hover:shadow-xl">
                        {/* Monthly Badge - Top Center */}
                        {service.price && service.price > 0 && (service as any).isMonthly && (
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
                            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-1.5 rounded-b-lg shadow-lg text-xs font-semibold uppercase tracking-wide">
                              {t('services.monthly')}
                            </div>
                          </div>
                        )}
                        
                        {/* Price Badge - Top Right */}
                        {service.price && service.price > 0 && (
                          <div className="absolute top-4 right-4 z-10">
                            <div className="bg-gradient-to-br from-primary to-primary/80 text-white px-4 py-2 rounded-lg shadow-lg">
                              <div className="text-xs font-medium opacity-90">{t('services.startingAt')}</div>
                              <div className="text-2xl font-bold">
                                {service.price}€
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <CardHeader className="pb-6 pt-8">
                          <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <ServiceIcon className="w-7 h-7 text-primary" />
                          </div>
                          <CardTitle className="text-xl font-bold mb-3">{service.title}</CardTitle>
                          <CardDescription className="text-base leading-relaxed">{service.description}</CardDescription>
                        </CardHeader>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Portfolio Section with Sticky Effect */}
          <section id="portfolio" className="py-20 px-4 sm:px-6 lg:px-8 sticky top-0 bg-background min-h-screen flex items-center z-[3]">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center space-y-4 mb-16">
                <Badge variant="secondary">{settings?.general?.portfolioBadge || t('portfolio.badge')}</Badge>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                  {settings?.general?.portfolioTitle || t('portfolio.title')}
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  {settings?.general?.portfolioDescription || t('portfolio.description')}
                </p>
              </div>

              {loadingContent ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <div className="aspect-video bg-muted animate-pulse" />
                      <CardHeader>
                        <div className="h-6 w-48 bg-muted animate-pulse rounded" />
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {projects.map((project) => {
                    const tags = project.tags ? JSON.parse(project.tags) : []
                    return (
                      <Card key={project.id} className="overflow-hidden group">
                        <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          {project.featured ? (
                            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                              <Code className="w-8 h-8 text-primary" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                              <Code className="w-6 h-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <Badge variant="outline">{project.category}</Badge>
                              <CardTitle className="text-2xl">{project.title}</CardTitle>
                            </div>
                            {project.featured && (
                              <Badge>{t('portfolio.featured')}</Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {tags.map((tag: string, index: number) => (
                              <Badge key={index} variant="secondary">{tag}</Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Blog Section with Sticky Effect */}
          <section id="blog" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted dark:bg-gray-900 sticky top-0 rounded-tr-2xl rounded-tl-2xl min-h-screen flex items-center z-[4]">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center space-y-4 mb-16">
                <Badge variant="secondary">{settings?.general?.blogBadge || t('blog.badge')}</Badge>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                  {settings?.general?.blogTitle || t('blog.title')}
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  {settings?.general?.blogDescription || t('blog.description')}
                </p>
              </div>

              {loadingBlog ? (
                <div className="grid md:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                      <CardHeader>
                        <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-6">
                  {blogPosts.map((post) => (
                    <Link key={post.id} href={`/blog/${post.id}`} className="group">
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                        <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                            <span className="text-2xl font-bold text-primary">
                              {post.title.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <CardHeader>
                          <div className="space-y-2">
                            <Badge variant="outline">{post.category}</Badge>
                            <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
                          </div>
                          <CardDescription className="flex items-center gap-2">
                            <span>{t('blog.by')} {post.author}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {post.date}
                            </span>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                          <Button size="sm" variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            {t('blog.readMore')}
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}

              <div className="text-center mt-12">
                <Button size="lg" variant="outline" asChild>
                  <Link href="/blog">
                    {t('blog.viewAll')} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Contact Section with Sticky Effect */}
          <section
            id="contact"
            className="py-20 px-4 sm:px-6 lg:px-8 sticky top-0 min-h-screen flex items-center z-[5] relative overflow-hidden"
            style={{
              backgroundColor: '#FFFFFF'
            }}
          >
            {/* Background image layer */}
            <div
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: 'url(/uploads/content/bg_img.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
            
            {/* Background overlay with radial gradient */}
            <div
              className="absolute inset-0 z-[1]"
              style={{
                backgroundColor: 'transparent',
                backgroundImage: 'radial-gradient(at bottom center, #FFFFFF9E 0%, #FFFFFF 75%)',
                opacity: 1,
                transition: 'background 0.3s, border-radius 0.3s, opacity 0.3s'
              }}
            />
            
            <div className="container mx-auto max-w-6xl relative z-10">
              <div className="grid lg:grid-cols-2 gap-8 items-stretch">
                {/* Left Side - Blue Background with Contact Info */}
                <div
                  className="relative overflow-hidden rounded-lg p-8 lg:p-12 text-white"
                  style={{
                    backgroundImage: 'url(/uploads/content/kontakt-background.webp)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundColor: 'transparent',
                      backgroundImage: 'linear-gradient(135deg, #354AC2E6 0%, #011480D9 100%)',
                      opacity: 1
                    }}
                  />
                  
                  <div className="relative z-10 space-y-8">
                    <div>
                      <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        {settings?.general?.contactFormTitle || t('contact.title')}
                      </h2>
                      <p className="text-lg opacity-90">
                        {settings?.general?.contactFormDescription || t('contact.description')}
                      </p>
                    </div>
                    
                    <div className="h-px bg-white/20 my-8" />
                    
                    <div className="space-y-6">
                      <a
                        href={`tel:${settings?.general?.contactPhone?.replace(/\s/g, '') || '+15551234567'}`}
                        className="flex items-center gap-4 group"
                      >
                        <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                          <Phone className="w-6 h-6" />
                        </div>
                        <span className="text-xl font-medium">{settings?.general?.contactPhone || '+1 (555) 123-4567'}</span>
                      </a>
                      
                      <a
                        href={`mailto:${settings?.general?.contactEmail || 'hello@modernagency.com'}`}
                        className="flex items-center gap-4 group"
                      >
                        <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                          <Mail className="w-6 h-6" />
                        </div>
                        <span className="text-xl font-medium">{settings?.general?.contactEmail || 'hello@modernagency.com'}</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Right Side - Form */}
                <div className="bg-white dark:bg-gray-900 rounded-lg p-8 lg:p-10 shadow-lg">
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <input
                          type="text"
                          required
                          placeholder={settings?.general?.contactFormFirstNamePlaceholder || t('contact.form.firstName')}
                          className="flex h-12 w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                      </div>
                      <div className="grid gap-2">
                        <input
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          placeholder={settings?.general?.contactFormLastNamePlaceholder || t('contact.form.lastName')}
                          className="flex h-12 w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <input
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          placeholder={settings?.general?.contactFormEmailPlaceholder || t('contact.form.email')}
                          className="flex h-12 w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                      </div>
                      <div className="grid gap-2">
                        <input
                          type="tel"
                          placeholder={settings?.general?.contactFormPhonePlaceholder || t('contact.form.phone')}
                          className="flex h-12 w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <textarea
                        required
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder={settings?.general?.contactFormMessagePlaceholder || t('contact.form.message')}
                        rows={6}
                        className="flex w-full rounded-md border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                      />
                    </div>

                    {/* Privacy Policy Checkbox */}
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="privacy-contact"
                        checked={privacyAccepted}
                        onChange={(e) => setPrivacyAccepted(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                        required
                      />
                      <label htmlFor="privacy-contact" className="text-sm text-muted-foreground cursor-pointer">
                        {settings?.general?.contactFormPrivacyText || (
                          <>
                            {t('contact.form.privacyText')}{' '}
                            <a href="/datenschutz" target="_blank" className="text-primary hover:underline font-medium">
                              {t('contact.form.privacyPolicy')}
                            </a>{' '}
                            {t('contact.form.privacyAgreement')}
                          </>
                        )}
                      </label>
                    </div>

                    <Button
                      type="submit"
                      disabled={submittingContact || !privacyAccepted}
                      className="w-full h-12 text-base transition-all hover:scale-105 hover:shadow-xl"
                      style={{
                        background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)'
                      }}
                    >
                      {submittingContact ? (settings?.general?.contactFormSendingText || t('contact.form.sending')) : (settings?.general?.contactFormSubmitText || t('contact.form.submit'))} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer
          className="bg-muted/30"
          style={{
            borderTop: '5px solid',
            borderImage: 'linear-gradient(90deg, #c4e17f 0 50px, #f7fdca 0 100px, #fad071 0 150px, #f0766b 0 200px, #db9dbe 0 250px, #c49cdf 0 300px, #6599e2 0 350px, #0068cf 0 400px) 1'
          }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-[1280px]">
            <div className="grid md:grid-cols-[1fr_auto_auto_auto] gap-8 md:gap-24 items-start">
              <div className="space-y-4 flex flex-col items-start max-w-md">
                {settings?.general?.websiteLogoUrl ? (
                  <LiquidLogo
                    src={settings.general.websiteLogoUrl}
                    alt={settings?.general?.siteName || 'Logo'}
                    className="h-14 w-auto object-contain"
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <LiquidLogo className="w-14 h-14">
                      <div className="w-full h-full bg-gradient-to-br from-primary to-primary/60 rounded flex items-center justify-center">
                        <Code className="w-8 h-8 text-primary-foreground" />
                      </div>
                    </LiquidLogo>
                    <span className="font-bold text-lg">{settings?.general?.siteName || 'ModernAgency'}</span>
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  {settings?.general?.description || t('footer.description')}
                </p>
              </div>

              {settings?.general?.footerColumns && settings.general.footerColumns.length > 0 ? (
                settings.general.footerColumns.map((column: any, index: number) => (
                  <div key={index}>
                    <h3 className="font-semibold mb-4">{column.title}</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {column.links.map((link: any, linkIndex: number) => (
                        <li key={linkIndex}>
                          <Link
                            href={link.href}
                            className="hover:text-primary transition-colors"
                            target={link.external ? '_blank' : undefined}
                            rel={link.external ? 'noopener noreferrer' : undefined}
                          >
                            {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <>
                  <div>
                    <h3 className="font-semibold mb-4">{t('footer.ourServices')}</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li><Link href="/services/fullservice-website" className="hover:text-primary transition-colors">{t('services.fullServiceWebsite')}</Link></li>
                      <li><Link href="/services/online-shop" className="hover:text-primary transition-colors">{t('services.onlineShop')}</Link></li>
                      <li><Link href="/services/individual-online-shop" className="hover:text-primary transition-colors">{t('services.individualOnlineShop')}</Link></li>
                      <li><Link href="/services/web-vcard-basic" className="hover:text-primary transition-colors">{t('services.webVCardBasic')}</Link></li>
                      <li><Link href="/services/web-vcard-premium" className="hover:text-primary transition-colors">{t('services.webVCardPremium')}</Link></li>
                      <li><Link href="/services/seo" className="hover:text-primary transition-colors">{t('services.searchEngineOptimization')}</Link></li>
                      <li><Link href="/services/landing-page" className="hover:text-primary transition-colors">{t('services.landingPage')}</Link></li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">{t('footer.company')}</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li><Link href="/" className="hover:text-primary transition-colors">{t('navigation.home')}</Link></li>
                      <li><Link href="/company" className="hover:text-primary transition-colors">{t('footer.aboutUs')}</Link></li>
                      <li><Link href="/appointment" className="hover:text-primary transition-colors">{t('navigation.appointment')}</Link></li>
                      <li><Link href="/career" className="hover:text-primary transition-colors">{t('navigation.career')}</Link></li>
                      <li><Link href="/training" className="hover:text-primary transition-colors">{t('navigation.training')}</Link></li>
                      <li><Link href="/ticket" className="hover:text-primary transition-colors">{t('footer.supportTicket')}</Link></li>
                      <li><Link href="#contact" className="hover:text-primary transition-colors">{t('navigation.contact')}</Link></li>
                      <li><Link href="/impressum" className="hover:text-primary transition-colors">{t('footer.imprint')}</Link></li>
                      <li><Link href="/datenschutz" className="hover:text-primary transition-colors">{t('footer.privacyPolicy')}</Link></li>
                      <li><Link href="/arbeitsgrundsaetze-und-regeln" className="hover:text-primary transition-colors">{t('footer.workPrinciples')}</Link></li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">{t('footer.findUs')}</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>
                        <a
                          href={`tel:${settings?.general?.contactPhone?.replace(/\s/g, '') || '+15551234567'}`}
                          className="hover:text-primary transition-colors flex items-center gap-2"
                        >
                          <Phone className="w-4 h-4" />
                          {settings?.general?.contactPhone || '+1 (555) 123-4567'}
                        </a>
                      </li>
                      {settings?.general?.contactPhone2 && (
                        <li>
                          <a
                            href={`tel:${settings.general.contactPhone2.replace(/\s/g, '')}`}
                            className="hover:text-primary transition-colors flex items-center gap-2"
                          >
                            <Phone className="w-4 h-4" />
                            {settings.general.contactPhone2}
                          </a>
                        </li>
                      )}
                      <li>
                        <a
                          href={`mailto:${settings?.general?.contactEmail || 'hello@modernagency.com'}`}
                          className="hover:text-primary transition-colors flex items-center gap-2"
                        >
                          <Mail className="w-4 h-4" />
                          {settings?.general?.contactEmail || 'hello@modernagency.com'}
                        </a>
                      </li>
                      <li>
                        <a
                          href={settings?.general?.googleMapsUrl || 'https://maps.google.com'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary transition-colors flex items-center gap-2"
                        >
                          <MapPin className="w-4 h-4" />
                          {settings?.general?.contactAddress || 'San Francisco, CA'}
                        </a>
                      </li>
                      <li className="flex items-start gap-2 pt-2">
                        <Calendar className="w-4 h-4 mt-0.5" />
                        <div>
                          <div className="font-medium text-foreground">{t('footer.workingHours')}</div>
                          <div>{t('footer.workingTime')}</div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </>
              )}
            </div>

            <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
              <p>{new Date().getFullYear()} {settings?.general?.siteName || 'ModernAgency'}. {t('footer.allRightsReserved')}</p>
            </div>
          </div>
        </footer>

        {/* Login Modal */}
        <LoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} />
      </div>
    </>
  )
}