'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Save, Globe, Mail, CreditCard, FileText, Brain, BarChart3, Scale, Palette, Upload, Eye, X, Image as ImageIcon, Wand2, TrendingUp, Target, Calendar, Hash, Users, Share2, Mail as MailIcon } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import type { AllSettings } from '@/lib/settings-db'
import Image from 'next/image'
import InvoicePreview from '@/components/invoice/InvoicePreview'

export default function AdminSettings() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState<AllSettings | null>(null)
  const [uploadingCompanyLogo, setUploadingCompanyLogo] = useState(false)
  const [uploadingWebsiteLogo, setUploadingWebsiteLogo] = useState(false)
  const [uploadingFavicon, setUploadingFavicon] = useState(false)
  const [showInvoicePreview, setShowInvoicePreview] = useState(false)
  const [aiSubTab, setAiSubTab] = useState('provider')
  const [legalSubTab, setLegalSubTab] = useState('impressum')
  const companyLogoInputRef = useRef<HTMLInputElement>(null)
  const websiteLogoInputRef = useRef<HTMLInputElement>(null)
  const faviconInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const loggedIn = localStorage.getItem('admin_logged_in')
    if (loggedIn !== 'true') {
      router.push('/admin/login')
      return
    }

    fetchSettings()
  }, [])

  async function fetchSettings() {
    try {
      const res = await fetch('/api/settings')
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      }
      const data = await res.json()
      console.log('Fetched settings:', data)
      if (data && data.settings) {
        setSettings(data.settings)
      } else {
        console.error('Invalid settings data:', data)
        throw new Error('Invalid settings data received')
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load settings',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(section: string, data: any) {
    setSaving(true)
    try {
      console.log('Saving:', { section, data })
      
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, data }),
      })

      let responseData
      try {
        responseData = await res.json()
        console.log('Response:', responseData)
      } catch (e) {
        console.error('Failed to parse response:', e)
        throw new Error('Server returned invalid response')
      }

      if (!res.ok) {
        console.error('Save failed:', responseData)
        throw new Error(responseData?.error || responseData?.details || `Server error: ${res.status}`)
      }

      toast({
        title: 'Success',
        description: 'Settings saved successfully',
      })
      
      await fetchSettings()
    } catch (error) {
      console.error('Error saving settings:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to save settings'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  async function handleCompanyLogoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Error',
        description: 'Invalid file type. Please upload PNG, JPG, WebP, or SVG images.',
        variant: 'destructive',
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'File too large. Maximum size is 5MB.',
        variant: 'destructive',
      })
      return
    }

    setUploadingCompanyLogo(true)
    try {
      const formData = new FormData()
      formData.append('logo', file)

      const res = await fetch('/api/upload/logo', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload company logo')
      }

      if (settings) {
        const updatedSettings = {
          ...settings,
          general: { ...settings.general, companyLogoUrl: data.url }
        }
        setSettings(updatedSettings)
        await handleSave('general', updatedSettings.general)
      }

      toast({
        title: 'Success',
        description: 'Company logo uploaded successfully',
      })
    } catch (error) {
      console.error('Company logo upload error:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload company logo',
        variant: 'destructive',
      })
    } finally {
      setUploadingCompanyLogo(false)
      if (companyLogoInputRef.current) {
        companyLogoInputRef.current.value = ''
      }
    }
  }

  async function handleRemoveCompanyLogo() {
    if (!settings?.general.companyLogoUrl) return

    try {
      const filename = settings.general.companyLogoUrl.split('/').pop()
      if (filename) {
        await fetch(`/api/upload/logo?filename=${filename}`, {
          method: 'DELETE',
        })
      }

      const updatedSettings = {
        ...settings,
        general: { ...settings.general, companyLogoUrl: '' }
      }
      setSettings(updatedSettings)
      await handleSave('general', updatedSettings.general)

      toast({
        title: 'Success',
        description: 'Company logo removed successfully',
      })
    } catch (error) {
      console.error('Company logo removal error:', error)
      toast({
        title: 'Error',
        description: 'Failed to remove company logo',
        variant: 'destructive',
      })
    }
  }

  async function handleWebsiteLogoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Error',
        description: 'Invalid file type. Please upload PNG, JPG, WebP, or SVG images.',
        variant: 'destructive',
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'File too large. Maximum size is 5MB.',
        variant: 'destructive',
      })
      return
    }

    setUploadingWebsiteLogo(true)
    try {
      const formData = new FormData()
      formData.append('logo', file)

      const res = await fetch('/api/upload/logo', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload website logo')
      }

      if (settings) {
        const updatedSettings = {
          ...settings,
          general: { ...settings.general, websiteLogoUrl: data.url }
        }
        setSettings(updatedSettings)
        await handleSave('general', updatedSettings.general)
      }

      toast({
        title: 'Success',
        description: 'Website logo uploaded successfully',
      })
    } catch (error) {
      console.error('Website logo upload error:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload website logo',
        variant: 'destructive',
      })
    } finally {
      setUploadingWebsiteLogo(false)
      if (websiteLogoInputRef.current) {
        websiteLogoInputRef.current.value = ''
      }
    }
  }

  async function handleRemoveWebsiteLogo() {
    if (!settings?.general.websiteLogoUrl) return

    try {
      const filename = settings.general.websiteLogoUrl.split('/').pop()
      if (filename) {
        await fetch(`/api/upload/logo?filename=${filename}`, {
          method: 'DELETE',
        })
      }

      const updatedSettings = {
        ...settings,
        general: { ...settings.general, websiteLogoUrl: '' }
      }
      setSettings(updatedSettings)
      await handleSave('general', updatedSettings.general)

      toast({
        title: 'Success',
        description: 'Website logo removed successfully',
      })
    } catch (error) {
      console.error('Website logo removal error:', error)
      toast({
        title: 'Error',
        description: 'Failed to remove website logo',
        variant: 'destructive',
      })
    }
  }

  async function handleFaviconUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type (favicon should be ico, png, or svg)
    const allowedTypes = ['image/x-icon', 'image/vnd.microsoft.icon', 'image/png', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Error',
        description: 'Invalid file type. Please upload ICO, PNG, or SVG images.',
        variant: 'destructive',
      })
      return
    }

    // Validate file size (2MB for favicon)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'File too large. Maximum size is 2MB.',
        variant: 'destructive',
      })
      return
    }

    setUploadingFavicon(true)
    try {
      const formData = new FormData()
      formData.append('logo', file)

      const res = await fetch('/api/upload/logo', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload favicon')
      }

      // Update settings with new favicon URL
      if (settings) {
        const updatedSettings = {
          ...settings,
          general: { ...settings.general, faviconUrl: data.url }
        }
        setSettings(updatedSettings)
        
        // Save to database
        await handleSave('general', updatedSettings.general)
      }

      toast({
        title: 'Success',
        description: 'Favicon uploaded successfully',
      })
    } catch (error) {
      console.error('Favicon upload error:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload favicon',
        variant: 'destructive',
      })
    } finally {
      setUploadingFavicon(false)
      if (faviconInputRef.current) {
        faviconInputRef.current.value = ''
      }
    }
  }

  async function handleRemoveFavicon() {
    if (!settings?.general.faviconUrl) return

    try {
      // Extract filename from URL
      const filename = settings.general.faviconUrl.split('/').pop()
      if (filename) {
        // Delete file
        await fetch(`/api/upload/logo?filename=${filename}`, {
          method: 'DELETE',
        })
      }

      // Update settings to remove favicon URL
      const updatedSettings = {
        ...settings,
        general: { ...settings.general, faviconUrl: '' }
      }
      setSettings(updatedSettings)
      
      // Save to database
      await handleSave('general', updatedSettings.general)

      toast({
        title: 'Success',
        description: 'Favicon removed successfully',
      })
    } catch (error) {
      console.error('Favicon removal error:', error)
      toast({
        title: 'Error',
        description: 'Failed to remove favicon',
        variant: 'destructive',
      })
    }
  }

  if (loading || !settings) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <div className="h-96 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your application configuration
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden md:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden md:inline">Payment</span>
          </TabsTrigger>
          <TabsTrigger value="invoice" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden md:inline">Invoice</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden md:inline">AI</span>
          </TabsTrigger>
          <TabsTrigger value="google" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden md:inline">Google</span>
          </TabsTrigger>
          <TabsTrigger value="legal" className="flex items-center gap-2">
            <Scale className="h-4 w-4" />
            <span className="hidden md:inline">Legal</span>
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden md:inline">SEO</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Company Information
              </CardTitle>
              <CardDescription>
                Basic company details for legal compliance (German law)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={settings.general.companyName}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, companyName: e.target.value }
                    })}
                    placeholder="ModernAgency GmbH"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="managingDirector">Managing Director *</Label>
                  <Input
                    id="managingDirector"
                    value={settings.general.managingDirector}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, managingDirector: e.target.value }
                    })}
                    placeholder="Max Mustermann"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID (USt-IdNr.) *</Label>
                  <Input
                    id="taxId"
                    value={settings.general.taxId}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, taxId: e.target.value }
                    })}
                    placeholder="DE123456789"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commercialRegister">Commercial Register</Label>
                  <Input
                    id="commercialRegister"
                    value={settings.general.commercialRegister}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, commercialRegister: e.target.value }
                    })}
                    placeholder="HRB 12345 B (optional)"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={settings.general.address}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, address: e.target.value }
                  })}
                  placeholder="Berlin, Germany"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.general.email}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, email: e.target.value }
                    })}
                    placeholder="hello@company.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={settings.general.phone}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, phone: e.target.value }
                    })}
                    placeholder="+49 30 12345678"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <Label htmlFor="companyLogo">Company Logo</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Used in invoices and official documents (PNG, JPG, WebP, or SVG, max 5MB)
                </p>
                {settings.general.companyLogoUrl ? (
                  <div className="flex items-start gap-4">
                    <div className="relative w-32 h-32 border rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={settings.general.companyLogoUrl}
                        alt="Company Logo"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => companyLogoInputRef.current?.click()}
                        disabled={uploadingCompanyLogo}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Change Logo
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleRemoveCompanyLogo}
                        disabled={uploadingCompanyLogo}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => companyLogoInputRef.current?.click()}
                    disabled={uploadingCompanyLogo}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {uploadingCompanyLogo ? 'Uploading...' : 'Upload Company Logo'}
                  </Button>
                )}
                <input
                  ref={companyLogoInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                  onChange={handleCompanyLogoUpload}
                  className="hidden"
                />
              </div>

              <div className="pt-4 border-t">
                <Button type="button" onClick={() => handleSave('general', settings.general)} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : 'Save General Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Website Information</CardTitle>
              <CardDescription>
                Public-facing website details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.general.siteName}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, siteName: e.target.value }
                  })}
                  placeholder="ModernAgency"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteUrl">Site URL</Label>
                <Input
                  id="siteUrl"
                  value={settings.general.siteUrl}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, siteUrl: e.target.value }
                  })}
                  placeholder="https://modernagency.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={settings.general.description}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, description: e.target.value }
                  })}
                  rows={3}
                  placeholder="Brief description..."
                />
              </div>

              <div className="space-y-2 pt-4 border-t">
                <Label htmlFor="websiteLogo">Website Logo</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Used for website branding and navigation (PNG, JPG, WebP, or SVG, max 5MB)
                </p>
                {settings.general.websiteLogoUrl ? (
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="relative w-32 h-32 border rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={settings.general.websiteLogoUrl}
                          alt="Website Logo"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => websiteLogoInputRef.current?.click()}
                          disabled={uploadingWebsiteLogo}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Change Logo
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={handleRemoveWebsiteLogo}
                          disabled={uploadingWebsiteLogo}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="websiteLogoWidth">Logo Width (px)</Label>
                      <Input
                        id="websiteLogoWidth"
                        type="number"
                        value={settings.general.websiteLogoWidth || 150}
                        onChange={(e) => setSettings({
                          ...settings,
                          general: { ...settings.general, websiteLogoWidth: parseInt(e.target.value) || 150 }
                        })}
                        placeholder="150"
                        min="50"
                        max="500"
                      />
                      <p className="text-xs text-muted-foreground">
                        Height will adjust automatically to maintain aspect ratio
                      </p>
                    </div>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => websiteLogoInputRef.current?.click()}
                    disabled={uploadingWebsiteLogo}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {uploadingWebsiteLogo ? 'Uploading...' : 'Upload Website Logo'}
                  </Button>
                )}
                <input
                  ref={websiteLogoInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                  onChange={handleWebsiteLogoUpload}
                  className="hidden"
                />
              </div>

              <div className="space-y-2 pt-4 border-t">
                <Label htmlFor="favicon">Favicon</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Browser tab icon (ICO, PNG, or SVG, max 2MB)
                </p>
                {settings.general.faviconUrl ? (
                  <div className="flex items-start gap-4">
                    <div className="relative w-16 h-16 border rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={settings.general.faviconUrl}
                        alt="Favicon"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => faviconInputRef.current?.click()}
                        disabled={uploadingFavicon}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Change Favicon
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleRemoveFavicon}
                        disabled={uploadingFavicon}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => faviconInputRef.current?.click()}
                    disabled={uploadingFavicon}
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    {uploadingFavicon ? 'Uploading...' : 'Upload Favicon'}
                  </Button>
                )}
                <input
                  ref={faviconInputRef}
                  type="file"
                  accept="image/x-icon,image/vnd.microsoft.icon,image/png,image/svg+xml"
                  onChange={handleFaviconUpload}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Integration Tab */}
        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                PayPal Integration
              </CardTitle>
              <CardDescription>
                Configure PayPal payment processing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable PayPal</Label>
                  <p className="text-sm text-muted-foreground">Accept payments via PayPal</p>
                </div>
                <Switch
                  checked={settings.payment.paypal.enabled}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    payment: {
                      ...settings.payment,
                      paypal: { ...settings.payment.paypal, enabled: checked }
                    }
                  })}
                />
              </div>

              {settings.payment.paypal.enabled && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="paypalClientId">Client ID</Label>
                    <Input
                      id="paypalClientId"
                      type="password"
                      value={settings.payment.paypal.clientId}
                      onChange={(e) => setSettings({
                        ...settings,
                        payment: {
                          ...settings.payment,
                          paypal: { ...settings.payment.paypal, clientId: e.target.value }
                        }
                      })}
                      placeholder="Your PayPal Client ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paypalSecret">Client Secret</Label>
                    <Input
                      id="paypalSecret"
                      type="password"
                      value={settings.payment.paypal.clientSecret}
                      onChange={(e) => setSettings({
                        ...settings,
                        payment: {
                          ...settings.payment,
                          paypal: { ...settings.payment.paypal, clientSecret: e.target.value }
                        }
                      })}
                      placeholder="Your PayPal Client Secret"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paypalWebhook">Webhook ID</Label>
                    <Input
                      id="paypalWebhook"
                      value={settings.payment.paypal.webhookId}
                      onChange={(e) => setSettings({
                        ...settings,
                        payment: {
                          ...settings.payment,
                          paypal: { ...settings.payment.paypal, webhookId: e.target.value }
                        }
                      })}
                      placeholder="Webhook ID"
                    />
                    <p className="text-xs text-muted-foreground">
                      Webhook URL: {settings.general.siteUrl}/api/webhooks/paypal
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Test Mode</Label>
                      <p className="text-sm text-muted-foreground">Use PayPal sandbox</p>
                    </div>
                    <Switch
                      checked={settings.payment.paypal.testMode}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        payment: {
                          ...settings.payment,
                          paypal: { ...settings.payment.paypal, testMode: checked }
                        }
                      })}
                    />
                  </div>
                </>
              )}

              {settings.payment.paypal.enabled && (
                <div className="pt-4 border-t">
                  <Button type="button" onClick={() => handleSave('payment', settings.payment)} disabled={saving}>
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? 'Saving...' : 'Save PayPal Settings'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mollie Integration</CardTitle>
              <CardDescription>
                Configure Mollie payment processing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Mollie</Label>
                  <p className="text-sm text-muted-foreground">Accept payments via Mollie</p>
                </div>
                <Switch
                  checked={settings.payment.mollie.enabled}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    payment: {
                      ...settings.payment,
                      mollie: { ...settings.payment.mollie, enabled: checked }
                    }
                  })}
                />
              </div>

              {settings.payment.mollie.enabled && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="mollieApiKey">API Key</Label>
                    <Input
                      id="mollieApiKey"
                      type="password"
                      value={settings.payment.mollie.apiKey}
                      onChange={(e) => setSettings({
                        ...settings,
                        payment: {
                          ...settings.payment,
                          mollie: { ...settings.payment.mollie, apiKey: e.target.value }
                        }
                      })}
                      placeholder="live_xxx or test_xxx"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mollieWebhook">Webhook URL</Label>
                    <Input
                      id="mollieWebhook"
                      value={`${settings.general.siteUrl}/api/webhooks/mollie`}
                      readOnly
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      Configure this URL in your Mollie dashboard
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Test Mode</Label>
                      <p className="text-sm text-muted-foreground">Use test API key</p>
                    </div>
                    <Switch
                      checked={settings.payment.mollie.testMode}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        payment: {
                          ...settings.payment,
                          mollie: { ...settings.payment.mollie, testMode: checked }
                        }
                      })}
                    />
                  </div>
                </>
              )}

              {settings.payment.mollie.enabled && (
                <div className="pt-4 border-t">
                  <Button type="button" onClick={() => handleSave('payment', settings.payment)} disabled={saving}>
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? 'Saving...' : 'Save Mollie Settings'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bank Transfer (SEPA/Local Transfer)</CardTitle>
              <CardDescription>
                Configure bank transfer payment option for local payments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Bank Transfer</Label>
                  <p className="text-sm text-muted-foreground">Accept payments via bank transfer</p>
                </div>
                <Switch
                  checked={settings.payment.bankTransfer?.enabled || false}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    payment: {
                      ...settings.payment,
                      bankTransfer: { ...settings.payment.bankTransfer, enabled: checked }
                    }
                  })}
                />
              </div>

              {settings.payment.bankTransfer?.enabled && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      value={settings.payment.bankTransfer?.bankName || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        payment: {
                          ...settings.payment,
                          bankTransfer: { ...(settings.payment.bankTransfer || {}), bankName: e.target.value }
                        }
                      })}
                      placeholder="Deutsche Bank AG"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountHolder">Account Holder</Label>
                    <Input
                      id="accountHolder"
                      value={settings.payment.bankTransfer?.accountHolder || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        payment: {
                          ...settings.payment,
                          bankTransfer: { ...(settings.payment.bankTransfer || {}), accountHolder: e.target.value }
                        }
                      })}
                      placeholder="Company Name GmbH"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="iban">IBAN</Label>
                      <Input
                        id="iban"
                        value={settings.payment.bankTransfer?.iban || ''}
                        onChange={(e) => setSettings({
                          ...settings,
                          payment: {
                            ...settings.payment,
                            bankTransfer: { ...(settings.payment.bankTransfer || {}), iban: e.target.value }
                          }
                        })}
                        placeholder="DE89 3704 0044 0532 0130 00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bic">BIC/SWIFT</Label>
                      <Input
                        id="bic"
                        value={settings.payment.bankTransfer?.bic || ''}
                        onChange={(e) => setSettings({
                          ...settings,
                          payment: {
                            ...settings.payment,
                            bankTransfer: { ...(settings.payment.bankTransfer || {}), bic: e.target.value }
                          }
                        })}
                        placeholder="COBADEFFXXX"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <select
                      id="currency"
                      value={settings.payment.bankTransfer?.currency || 'EUR'}
                      onChange={(e) => setSettings({
                        ...settings,
                        payment: {
                          ...settings.payment,
                          bankTransfer: { ...(settings.payment.bankTransfer || {}), currency: e.target.value }
                        }
                      })}
                      className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm"
                    >
                      <option value="EUR">EUR (€)</option>
                      <option value="USD">USD ($)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="CHF">CHF (Fr)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transferInstructions">Payment Instructions</Label>
                    <Textarea
                      id="transferInstructions"
                      value={settings.payment.bankTransfer?.instructions || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        payment: {
                          ...settings.payment,
                          bankTransfer: { ...(settings.payment.bankTransfer || {}), instructions: e.target.value }
                        }
                      })}
                      rows={3}
                      placeholder="Please use the invoice number as reference when making the bank transfer."
                    />
                    <p className="text-xs text-muted-foreground">
                      These instructions will be shown to customers choosing bank transfer
                    </p>
                  </div>
                </>
              )}

              {settings.payment.bankTransfer?.enabled && (
                <div className="pt-4 border-t">
                  <Button type="button" onClick={() => handleSave('payment', settings.payment)} disabled={saving}>
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? 'Saving...' : 'Save Bank Transfer Settings'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoice Designer Tab */}
        <TabsContent value="invoice" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Invoice Template Design
              </CardTitle>
              <CardDescription>
                Customize your invoice appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoiceTemplate">Template</Label>
                  <select
                    id="invoiceTemplate"
                    value={settings.invoice.template}
                    onChange={(e) => setSettings({
                      ...settings,
                      invoice: { ...settings.invoice, template: e.target.value }
                    })}
                    className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm"
                    disabled
                  >
                    <option value="dfm">DFM Template (Professional German Invoice)</option>
                  </select>
                  <p className="text-xs text-muted-foreground">
                    Fixed template designed for professional German invoices
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fontFamily">Font Family</Label>
                  <select
                    id="fontFamily"
                    value={settings.invoice.fontFamily}
                    onChange={(e) => setSettings({
                      ...settings,
                      invoice: { ...settings.invoice, fontFamily: e.target.value }
                    })}
                    className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={settings.invoice.primaryColor}
                      onChange={(e) => setSettings({
                        ...settings,
                        invoice: { ...settings.invoice, primaryColor: e.target.value }
                      })}
                      className="w-20 h-10"
                    />
                    <Input
                      value={settings.invoice.primaryColor}
                      onChange={(e) => setSettings({
                        ...settings,
                        invoice: { ...settings.invoice, primaryColor: e.target.value }
                      })}
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={settings.invoice.secondaryColor}
                      onChange={(e) => setSettings({
                        ...settings,
                        invoice: { ...settings.invoice, secondaryColor: e.target.value }
                      })}
                      className="w-20 h-10"
                    />
                    <Input
                      value={settings.invoice.secondaryColor}
                      onChange={(e) => setSettings({
                        ...settings,
                        invoice: { ...settings.invoice, secondaryColor: e.target.value }
                      })}
                      placeholder="#64748b"
                    />
                  </div>
                </div>
              </div>


              <div className="space-y-2">
                <Label htmlFor="headerText">Invoice Header Text</Label>
                <Textarea
                  id="headerText"
                  value={settings.invoice.headerText || 'Unsere Lieferungen/Leistungen stellen wir Ihnen wie folgt in Rechnung.'}
                  onChange={(e) => setSettings({
                    ...settings,
                    invoice: { ...settings.invoice, headerText: e.target.value }
                  })}
                  rows={2}
                  placeholder="Unsere Lieferungen/Leistungen stellen wir Ihnen wie folgt in Rechnung."
                />
                <p className="text-xs text-muted-foreground">
                  Text shown before the invoice items table
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="footerText">Footer Text</Label>
                <Textarea
                  id="footerText"
                  value={settings.invoice.footerText}
                  onChange={(e) => setSettings({
                    ...settings,
                    invoice: { ...settings.invoice, footerText: e.target.value }
                  })}
                  rows={2}
                  placeholder="Thank you for your business!"
                />
                <p className="text-xs text-muted-foreground">
                  Text shown above QR codes section
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium">QR Code Display Options</h4>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show PayPal QR Code</Label>
                    <p className="text-sm text-muted-foreground">Display PayPal payment QR code</p>
                  </div>
                  <Switch
                    checked={settings.invoice.showPayPalQR !== false}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      invoice: { ...settings.invoice, showPayPalQR: checked }
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Bank Transfer QR Code</Label>
                    <p className="text-sm text-muted-foreground">Display bank transfer (SEPA) QR code</p>
                  </div>
                  <Switch
                    checked={settings.invoice.showBankQR !== false}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      invoice: { ...settings.invoice, showBankQR: checked }
                    })}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logoWidth">Logo Width (px)</Label>
                  <Input
                    id="logoWidth"
                    type="number"
                    value={settings.invoice.logoWidth || 128}
                    onChange={(e) => setSettings({
                      ...settings,
                      invoice: { ...settings.invoice, logoWidth: parseInt(e.target.value) || 128 }
                    })}
                    placeholder="128"
                    min="50"
                    max="400"
                  />
                  <p className="text-xs text-muted-foreground">
                    Height auto-adjusts
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={settings.invoice.taxRate}
                    onChange={(e) => setSettings({
                      ...settings,
                      invoice: { ...settings.invoice, taxRate: parseFloat(e.target.value) || 0 }
                    })}
                    placeholder="19"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
                  <Input
                    id="invoicePrefix"
                    value={settings.invoice.invoicePrefix}
                    onChange={(e) => setSettings({
                      ...settings,
                      invoice: { ...settings.invoice, invoicePrefix: e.target.value }
                    })}
                    placeholder="INV"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoiceStart">Starting Number</Label>
                  <Input
                    id="invoiceStart"
                    type="number"
                    value={settings.invoice.invoiceNumberStart}
                    onChange={(e) => setSettings({
                      ...settings,
                      invoice: { ...settings.invoice, invoiceNumberStart: parseInt(e.target.value) || 1000 }
                    })}
                    placeholder="1000"
                  />
                </div>
              </div>

              <div className="pt-4 border-t flex gap-2">
                <Button type="button" onClick={() => handleSave('invoice', settings.invoice)} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Invoice Settings'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowInvoicePreview(true)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview Invoice
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Configuration Tab */}
        <TabsContent value="ai" className="space-y-6">
          <div className="flex gap-6">
            {/* Vertical Sub-tabs */}
            <div className="w-64 flex-shrink-0">
              <nav className="space-y-1">
                <button
                  onClick={() => setAiSubTab('provider')}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    aiSubTab === 'provider'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Brain className="h-5 w-5" />
                  <span>AI Provider</span>
                </button>
                <button
                  onClick={() => setAiSubTab('blog')}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    aiSubTab === 'blog'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Wand2 className="h-5 w-5" />
                  <span>Blog Assistant</span>
                </button>
                <button
                  onClick={() => setAiSubTab('seo')}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    aiSubTab === 'seo'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <TrendingUp className="h-5 w-5" />
                  <span>SEO Tools</span>
                </button>
                <button
                  onClick={() => setAiSubTab('marketing')}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    aiSubTab === 'marketing'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Target className="h-5 w-5" />
                  <span>Marketing</span>
                </button>
                <button
                  onClick={() => setAiSubTab('support')}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    aiSubTab === 'support'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Users className="h-5 w-5" />
                  <span>Support Agent</span>
                </button>
              </nav>
            </div>

            {/* Content Area */}
            <div className="flex-1 space-y-6">
              {/* AI Provider Configuration */}
              {aiSubTab === 'provider' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      AI Provider Configuration
                    </CardTitle>
                    <CardDescription>
                      Configure OpenAI-compatible AI provider for content generation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aiProvider">Provider</Label>
                <select
                  id="aiProvider"
                  value={settings.ai.provider}
                  onChange={(e) => {
                    const newProvider = e.target.value
                    const updates: any = { provider: newProvider }
                    
                    // Set default values when A4F is selected
                    if (newProvider === 'a4f') {
                      updates.baseUrl = 'https://api.a4f.co/v1'
                      updates.textModel = 'provider-8/claude-sonnet-4.5'
                      updates.searchModel = 'provider-3/sonar-pro'
                      updates.imageModel = 'provider-8/nano-banana-pro'
                    }
                    
                    setSettings({
                      ...settings,
                      ai: { ...settings.ai, ...updates }
                    })
                  }}
                  className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm"
                >
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic (Claude)</option>
                  <option value="a4f">A4F (OpenAI Compatible)</option>
                  <option value="custom">Custom Provider</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="baseUrl">Base URL</Label>
                <Input
                  id="baseUrl"
                  value={settings.ai.baseUrl}
                  onChange={(e) => setSettings({
                    ...settings,
                    ai: { ...settings.ai, baseUrl: e.target.value }
                  })}
                  placeholder="https://api.openai.com/v1"
                />
                <p className="text-xs text-muted-foreground">
                  API endpoint for your AI provider
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={settings.ai.apiKey}
                  onChange={(e) => setSettings({
                    ...settings,
                    ai: { ...settings.ai, apiKey: e.target.value }
                  })}
                  placeholder="sk-..."
                />
              </div>

              {settings.ai.provider === 'a4f' ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="textModel">Text/SEO Model</Label>
                    <select
                      id="textModel"
                      value={settings.ai.textModel || 'provider-8/claude-sonnet-4.5'}
                      onChange={(e) => setSettings({
                        ...settings,
                        ai: { ...settings.ai, textModel: e.target.value }
                      })}
                      className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm"
                    >
                      <option value="provider-8/claude-sonnet-4.5">provider-8/claude-sonnet-4.5</option>
                      <option value="provider-8/gemini-3-pro">provider-8/gemini-3-pro</option>
                      <option value="provider-3/gpt-5.1">provider-3/gpt-5.1</option>
                      <option value="provider-8/glm-4.7-thinking">provider-8/glm-4.7-thinking</option>
                    </select>
                    <p className="text-xs text-muted-foreground">
                      Blog konularını işlemek ve projenin SEO'sunu iyileştirmek için kullanılır
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <h4 className="font-medium">Web Search Configuration</h4>
                    
                    <div className="space-y-2">
                      <Label htmlFor="searchModel">Web Search Model</Label>
                      <select
                        id="searchModel"
                        value={settings.ai.searchModel || 'provider-3/sonar-pro'}
                        onChange={(e) => setSettings({
                          ...settings,
                          ai: { ...settings.ai, searchModel: e.target.value }
                        })}
                        className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm"
                      >
                        <option value="provider-3/sonar-reasoning-pro">provider-3/sonar-reasoning-pro</option>
                        <option value="provider-3/sonar-pro">provider-3/sonar-pro</option>
                        <option value="provider-3/sonar-reasoning">provider-3/sonar-reasoning</option>
                        <option value="provider-3/sonar">provider-3/sonar</option>
                      </select>
                      <p className="text-xs text-muted-foreground">
                        Blog için otomatik konu araştırma, tespit ve web scraping görevleri için kullanılır
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="searchTopics">Araştırma Konuları (virgülle ayırın)</Label>
                      <Textarea
                        id="searchTopics"
                        value={settings.ai.webSearch?.topics?.join(', ') || ''}
                        onChange={(e) => setSettings({
                          ...settings,
                          ai: {
                            ...settings.ai,
                            webSearch: {
                              ...(settings.ai.webSearch || { topics: [], categories: [], sampleUrls: [] }),
                              topics: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                            }
                          }
                        })}
                        rows={3}
                        placeholder="web development, artificial intelligence, digital marketing"
                      />
                      <p className="text-xs text-muted-foreground">
                        AI'ın araştırma yapacağı konular
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="searchCategories">Kategoriler (virgülle ayırın)</Label>
                      <Input
                        id="searchCategories"
                        value={settings.ai.webSearch?.categories?.join(', ') || ''}
                        onChange={(e) => setSettings({
                          ...settings,
                          ai: {
                            ...settings.ai,
                            webSearch: {
                              ...(settings.ai.webSearch || { topics: [], categories: [], sampleUrls: [] }),
                              categories: e.target.value.split(',').map(c => c.trim()).filter(Boolean)
                            }
                          }
                        })}
                        placeholder="Technology, Business, Marketing"
                      />
                      <p className="text-xs text-muted-foreground">
                        İçerik kategorileri
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="searchUrls">Örnek URL'ler (her satıra bir URL)</Label>
                      <Textarea
                        id="searchUrls"
                        value={settings.ai.webSearch?.sampleUrls?.join('\n') || ''}
                        onChange={(e) => setSettings({
                          ...settings,
                          ai: {
                            ...settings.ai,
                            webSearch: {
                              ...(settings.ai.webSearch || { topics: [], categories: [], sampleUrls: [] }),
                              sampleUrls: e.target.value.split('\n').map(u => u.trim()).filter(Boolean)
                            }
                          }
                        })}
                        rows={5}
                        placeholder="https://example.com/blog&#10;https://techcrunch.com&#10;https://medium.com"
                      />
                      <p className="text-xs text-muted-foreground">
                        AI'ın referans alacağı web siteleri ve blog URL'leri
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageModel">Image Generation Model</Label>
                    <select
                      id="imageModel"
                      value={settings.ai.imageModel || 'provider-8/nano-banana-pro'}
                      onChange={(e) => setSettings({
                        ...settings,
                        ai: { ...settings.ai, imageModel: e.target.value }
                      })}
                      className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm"
                    >
                      <option value="provider-8/nano-banana-pro">provider-8/nano-banana-pro</option>
                      <option value="provider-4/gemini-2.5-flash-image">provider-4/gemini-2.5-flash-image</option>
                      <option value="provider-3/dall-e-3">provider-3/dall-e-3</option>
                    </select>
                    <p className="text-xs text-muted-foreground">
                      Proje ve blog görselleri için kullanılır (blog başlığı ve içeriğinden otomatik görsel üretimi)
                    </p>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={settings.ai.model}
                    onChange={(e) => setSettings({
                      ...settings,
                      ai: { ...settings.ai, model: e.target.value }
                    })}
                    placeholder="gpt-4"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="maxTokens">Max Tokens</Label>
                <Input
                  id="maxTokens"
                  type="number"
                  value={settings.ai.maxTokens}
                  onChange={(e) => setSettings({
                    ...settings,
                    ai: { ...settings.ai, maxTokens: parseInt(e.target.value) || 2000 }
                  })}
                  placeholder="2000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature: {settings.ai.temperature}</Label>
                <input
                  id="temperature"
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={settings.ai.temperature}
                  onChange={(e) => setSettings({
                    ...settings,
                    ai: { ...settings.ai, temperature: parseFloat(e.target.value) }
                  })}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Lower values = more focused, higher values = more creative
                </p>
              </div>

              <div className="pt-4 border-t">
                <Button type="button" onClick={() => handleSave('ai', settings.ai)} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : 'Save AI Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
              )}

              {/* Blog Writing Assistant */}
              {aiSubTab === 'blog' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5" />
                Blog Writing Assistant
              </CardTitle>
              <CardDescription>
                AI-powered blog creation and content generation tools
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Blog Assistant</Label>
                  <p className="text-sm text-muted-foreground">
                    AI-assisted blog post writing and generation
                  </p>
                </div>
                <Switch
                  checked={settings.ai.blogAssistant?.enabled || false}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    ai: {
                      ...settings.ai,
                      blogAssistant: {
                        ...(settings.ai.blogAssistant || {
                          enabled: false,
                          tone: 'professional',
                          length: 'medium',
                          includeImages: true,
                          includeSources: true,
                          autoPublish: false,
                          categories: [],
                          language: 'en',
                          keywordDensity: 2,
                        }),
                        enabled: checked
                      }
                    }
                  })}
                />
              </div>

              {settings.ai.blogAssistant?.enabled && (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="blogTone">Writing Tone</Label>
                      <select
                        id="blogTone"
                        value={settings.ai.blogAssistant.tone}
                        onChange={(e) => setSettings({
                          ...settings,
                          ai: {
                            ...settings.ai,
                            blogAssistant: { ...settings.ai.blogAssistant, tone: e.target.value as any }
                          }
                        })}
                        className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm"
                      >
                        <option value="professional">Professional</option>
                        <option value="casual">Casual</option>
                        <option value="friendly">Friendly</option>
                        <option value="formal">Formal</option>
                        <option value="technical">Technical</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="blogLength">Default Length</Label>
                      <select
                        id="blogLength"
                        value={settings.ai.blogAssistant.length}
                        onChange={(e) => setSettings({
                          ...settings,
                          ai: {
                            ...settings.ai,
                            blogAssistant: { ...settings.ai.blogAssistant, length: e.target.value as any }
                          }
                        })}
                        className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm"
                      >
                        <option value="short">Short (500-800 words)</option>
                        <option value="medium">Medium (1000-1500 words)</option>
                        <option value="long">Long (2000+ words)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="blogLanguage">Language</Label>
                      <select
                        id="blogLanguage"
                        value={settings.ai.blogAssistant.language}
                        onChange={(e) => setSettings({
                          ...settings,
                          ai: {
                            ...settings.ai,
                            blogAssistant: { ...settings.ai.blogAssistant, language: e.target.value }
                          }
                        })}
                        className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm"
                      >
                        <option value="en">English</option>
                        <option value="de">German</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="it">Italian</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="keywordDensity">Keyword Density (%)</Label>
                      <Input
                        id="keywordDensity"
                        type="number"
                        min="0"
                        max="5"
                        step="0.5"
                        value={settings.ai.blogAssistant.keywordDensity}
                        onChange={(e) => setSettings({
                          ...settings,
                          ai: {
                            ...settings.ai,
                            blogAssistant: { ...settings.ai.blogAssistant, keywordDensity: parseFloat(e.target.value) || 2 }
                          }
                        })}
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Include Images</Label>
                        <p className="text-sm text-muted-foreground">Suggest relevant images for blog posts</p>
                      </div>
                      <Switch
                        checked={settings.ai.blogAssistant.includeImages}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          ai: {
                            ...settings.ai,
                            blogAssistant: { ...settings.ai.blogAssistant, includeImages: checked }
                          }
                        })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Include Sources</Label>
                        <p className="text-sm text-muted-foreground">Add source citations and references</p>
                      </div>
                      <Switch
                        checked={settings.ai.blogAssistant.includeSources}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          ai: {
                            ...settings.ai,
                            blogAssistant: { ...settings.ai.blogAssistant, includeSources: checked }
                          }
                        })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Auto-Publish</Label>
                        <p className="text-sm text-muted-foreground">Automatically publish generated posts</p>
                      </div>
                      <Switch
                        checked={settings.ai.blogAssistant.autoPublish}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          ai: {
                            ...settings.ai,
                            blogAssistant: { ...settings.ai.blogAssistant, autoPublish: checked }
                          }
                        })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="blogCategories">Default Categories (comma-separated)</Label>
                    <Input
                      id="blogCategories"
                      value={settings.ai.blogAssistant.categories?.join(', ') || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        ai: {
                          ...settings.ai,
                          blogAssistant: {
                            ...settings.ai.blogAssistant,
                            categories: e.target.value.split(',').map(c => c.trim()).filter(Boolean)
                          }
                        }
                      })}
                      placeholder="Technology, Business, Marketing"
                    />
                  </div>

                  <div className="pt-4 border-t">
                    <Button type="button" onClick={() => handleSave('ai', settings.ai)} disabled={saving}>
                      <Save className="mr-2 h-4 w-4" />
                      {saving ? 'Saving...' : 'Save Blog Assistant Settings'}
                    </Button>
                  </div>
                </>
              )}

              {!settings.ai.blogAssistant?.enabled && (
                <div className="pt-4 border-t">
                  <Button type="button" onClick={() => handleSave('ai', settings.ai)} disabled={saving}>
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? 'Saving...' : 'Save Blog Assistant Settings'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
              )}

              {/* SEO Tools */}
              {aiSubTab === 'seo' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                SEO Optimization Tools
              </CardTitle>
              <CardDescription>
                AI-powered search engine optimization features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable SEO Tools</Label>
                  <p className="text-sm text-muted-foreground">
                    Automated SEO optimization and analysis
                  </p>
                </div>
                <Switch
                  checked={settings.ai.seoTools?.enabled || false}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    ai: {
                      ...settings.ai,
                      seoTools: {
                        ...(settings.ai.seoTools || {
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
                        }),
                        enabled: checked
                      }
                    }
                  })}
                />
              </div>

              {settings.ai.seoTools?.enabled && (
                <>
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Auto Meta Tags</Label>
                        <p className="text-sm text-muted-foreground">Generate meta tags automatically</p>
                      </div>
                      <Switch
                        checked={settings.ai.seoTools.autoMetaTags}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          ai: {
                            ...settings.ai,
                            seoTools: { ...settings.ai.seoTools, autoMetaTags: checked }
                          }
                        })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Auto Keywords</Label>
                        <p className="text-sm text-muted-foreground">Generate relevant keywords</p>
                      </div>
                      <Switch
                        checked={settings.ai.seoTools.autoKeywords}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          ai: {
                            ...settings.ai,
                            seoTools: { ...settings.ai.seoTools, autoKeywords: checked }
                          }
                        })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Auto Descriptions</Label>
                        <p className="text-sm text-muted-foreground">Generate meta descriptions</p>
                      </div>
                      <Switch
                        checked={settings.ai.seoTools.autoDescriptions}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          ai: {
                            ...settings.ai,
                            seoTools: { ...settings.ai.seoTools, autoDescriptions: checked }
                          }
                        })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Keyword Research</Label>
                        <p className="text-sm text-muted-foreground">AI-powered keyword research tool</p>
                      </div>
                      <Switch
                        checked={settings.ai.seoTools.keywordResearch}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          ai: {
                            ...settings.ai,
                            seoTools: { ...settings.ai.seoTools, keywordResearch: checked }
                          }
                        })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Competitor Analysis</Label>
                        <p className="text-sm text-muted-foreground">Analyze competitor content</p>
                      </div>
                      <Switch
                        checked={settings.ai.seoTools.competitorAnalysis}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          ai: {
                            ...settings.ai,
                            seoTools: { ...settings.ai.seoTools, competitorAnalysis: checked }
                          }
                        })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Content Optimization</Label>
                        <p className="text-sm text-muted-foreground">Optimize content for search engines</p>
                      </div>
                      <Switch
                        checked={settings.ai.seoTools.contentOptimization}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          ai: {
                            ...settings.ai,
                            seoTools: { ...settings.ai.seoTools, contentOptimization: checked }
                          }
                        })}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label htmlFor="metaDescLength">Meta Description Length</Label>
                      <Input
                        id="metaDescLength"
                        type="number"
                        min="120"
                        max="160"
                        value={settings.ai.seoTools.metaDescriptionLength}
                        onChange={(e) => setSettings({
                          ...settings,
                          ai: {
                            ...settings.ai,
                            seoTools: { ...settings.ai.seoTools, metaDescriptionLength: parseInt(e.target.value) || 160 }
                          }
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="titleLength">Title Length</Label>
                      <Input
                        id="titleLength"
                        type="number"
                        min="50"
                        max="70"
                        value={settings.ai.seoTools.titleLength}
                        onChange={(e) => setSettings({
                          ...settings,
                          ai: {
                            ...settings.ai,
                            seoTools: { ...settings.ai.seoTools, titleLength: parseInt(e.target.value) || 60 }
                          }
                        })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="focusKeywords">Focus Keywords (comma-separated)</Label>
                    <Input
                      id="focusKeywords"
                      value={settings.ai.seoTools.focusKeywords?.join(', ') || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        ai: {
                          ...settings.ai,
                          seoTools: {
                            ...settings.ai.seoTools,
                            focusKeywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean)
                          }
                        }
                      })}
                      placeholder="web development, design, SEO"
                    />
                  </div>

                  <div className="pt-4 border-t">
                    <Button type="button" onClick={() => handleSave('ai', settings.ai)} disabled={saving}>
                      <Save className="mr-2 h-4 w-4" />
                      {saving ? 'Saving...' : 'Save SEO Tools Settings'}
                    </Button>
                  </div>
                </>
              )}

              {!settings.ai.seoTools?.enabled && (
                <div className="pt-4 border-t">
                  <Button type="button" onClick={() => handleSave('ai', settings.ai)} disabled={saving}>
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? 'Saving...' : 'Save SEO Tools Settings'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
              )}

              {/* Marketing Tools */}
              {aiSubTab === 'marketing' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Marketing Automation
              </CardTitle>
              <CardDescription>
                AI-powered marketing tools and automation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Marketing Tools</Label>
                  <p className="text-sm text-muted-foreground">
                    Automated marketing campaigns and social media
                  </p>
                </div>
                <Switch
                  checked={settings.ai.marketing?.enabled || false}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    ai: {
                      ...settings.ai,
                      marketing: {
                        ...(settings.ai.marketing || {
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
                        }),
                        enabled: checked
                      }
                    }
                  })}
                />
              </div>

              {settings.ai.marketing?.enabled && (
                <>
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5 flex items-center gap-2">
                        <MailIcon className="h-4 w-4" />
                        <div>
                          <Label>Email Campaigns</Label>
                          <p className="text-sm text-muted-foreground">AI-generated email marketing</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.ai.marketing.emailCampaigns}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          ai: {
                            ...settings.ai,
                            marketing: { ...settings.ai.marketing, emailCampaigns: checked }
                          }
                        })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5 flex items-center gap-2">
                        <Share2 className="h-4 w-4" />
                        <div>
                          <Label>Social Media</Label>
                          <p className="text-sm text-muted-foreground">Social media content generation</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.ai.marketing.socialMedia}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          ai: {
                            ...settings.ai,
                            marketing: { ...settings.ai.marketing, socialMedia: checked }
                          }
                        })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <div>
                          <Label>Content Calendar</Label>
                          <p className="text-sm text-muted-foreground">Plan and schedule content</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.ai.marketing.contentCalendar}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          ai: {
                            ...settings.ai,
                            marketing: { ...settings.ai.marketing, contentCalendar: checked }
                          }
                        })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Auto Social Post</Label>
                        <p className="text-sm text-muted-foreground">Automatically post to social media</p>
                      </div>
                      <Switch
                        checked={settings.ai.marketing.autoSocialPost}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          ai: {
                            ...settings.ai,
                            marketing: { ...settings.ai.marketing, autoSocialPost: checked }
                          }
                        })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5 flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        <div>
                          <Label>Hashtag Generation</Label>
                          <p className="text-sm text-muted-foreground">Auto-generate relevant hashtags</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.ai.marketing.hashtagGeneration}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          ai: {
                            ...settings.ai,
                            marketing: { ...settings.ai.marketing, hashtagGeneration: checked }
                          }
                        })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Analytics Integration</Label>
                        <p className="text-sm text-muted-foreground">Connect with analytics platforms</p>
                      </div>
                      <Switch
                        checked={settings.ai.marketing.analyticsIntegration}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          ai: {
                            ...settings.ai,
                            marketing: { ...settings.ai.marketing, analyticsIntegration: checked }
                          }
                        })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t">
                    <Label htmlFor="platforms">Social Media Platforms</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {['Twitter', 'Facebook', 'LinkedIn', 'Instagram', 'TikTok', 'YouTube', 'Pinterest', 'Reddit'].map((platform) => (
                        <label key={platform} className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-accent">
                          <input
                            type="checkbox"
                            checked={(settings.ai.marketing?.platforms || []).includes(platform)}
                            onChange={(e) => {
                              const platforms = settings.ai.marketing?.platforms || []
                              const updated = e.target.checked
                                ? [...platforms, platform]
                                : platforms.filter(p => p !== platform)
                              setSettings({
                                ...settings,
                                ai: {
                                  ...settings.ai,
                                  marketing: { ...(settings.ai.marketing || {}), platforms: updated }
                                }
                              })
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">{platform}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postingSchedule">Posting Schedule</Label>
                    <select
                      id="postingSchedule"
                      value={settings.ai.marketing.postingSchedule}
                      onChange={(e) => setSettings({
                        ...settings,
                        ai: {
                          ...settings.ai,
                          marketing: { ...settings.ai.marketing, postingSchedule: e.target.value }
                        }
                      })}
                      className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm"
                    >
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetAudience">Target Audience</Label>
                    <Textarea
                      id="targetAudience"
                      value={settings.ai.marketing.targetAudience}
                      onChange={(e) => setSettings({
                        ...settings,
                        ai: {
                          ...settings.ai,
                          marketing: { ...settings.ai.marketing, targetAudience: e.target.value }
                        }
                      })}
                      rows={3}
                      placeholder="Describe your target audience (age, interests, location, etc.)"
                    />
                  </div>

                  <div className="pt-4 border-t">
                    <Button type="button" onClick={() => handleSave('ai', settings.ai)} disabled={saving}>
                      <Save className="mr-2 h-4 w-4" />
                      {saving ? 'Saving...' : 'Save Marketing Settings'}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
              )}

              {/* Support Agent */}
              {aiSubTab === 'support' && (
          <Card>
            <CardHeader>
              <CardTitle>AI Support Agent Widget</CardTitle>
              <CardDescription>
                Add a floating AI support agent widget to your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Support Agent</Label>
                  <p className="text-sm text-muted-foreground">
                    Show floating AI support widget on website
                  </p>
                </div>
                <Switch
                  checked={settings.ai.supportAgent?.enabled || false}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    ai: {
                      ...settings.ai,
                      supportAgent: {
                        ...(settings.ai.supportAgent || {
                          agentId: '',
                          agentName: 'AI Assistant',
                          agentDescription: 'Online',
                          buttonEmoji: '🎧',
                          position: 'bottom-right'
                        }),
                        enabled: checked
                      }
                    }
                  })}
                />
              </div>

              {settings.ai.supportAgent?.enabled && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="agentId">Agent ID *</Label>
                    <Input
                      id="agentId"
                      value={settings.ai.supportAgent.agentId}
                      onChange={(e) => setSettings({
                        ...settings,
                        ai: {
                          ...settings.ai,
                          supportAgent: { ...settings.ai.supportAgent, agentId: e.target.value }
                        }
                      })}
                      placeholder="70d8325c-bb9f-4c76-92e1-fb8ea7e03207"
                    />
                    <p className="text-xs text-muted-foreground">
                      Your BeyondPresence agent ID from https://bey.chat
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="agentName">Agent Name</Label>
                      <Input
                        id="agentName"
                        value={settings.ai.supportAgent.agentName}
                        onChange={(e) => setSettings({
                          ...settings,
                          ai: {
                            ...settings.ai,
                            supportAgent: { ...settings.ai.supportAgent, agentName: e.target.value }
                          }
                        })}
                        placeholder="AI Assistant"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="agentDescription">Status Text</Label>
                      <Input
                        id="agentDescription"
                        value={settings.ai.supportAgent.agentDescription}
                        onChange={(e) => setSettings({
                          ...settings,
                          ai: {
                            ...settings.ai,
                            supportAgent: { ...settings.ai.supportAgent, agentDescription: e.target.value }
                          }
                        })}
                        placeholder="Online"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="buttonSize">Button Size (px)</Label>
                    <Input
                      id="buttonSize"
                      type="number"
                      value={settings.ai.supportAgent.buttonSize || 64}
                      onChange={(e) => setSettings({
                        ...settings,
                        ai: {
                          ...settings.ai,
                          supportAgent: { ...settings.ai.supportAgent, buttonSize: parseInt(e.target.value) || 64 }
                        }
                      })}
                      placeholder="64"
                      min="48"
                      max="96"
                    />
                    <p className="text-xs text-muted-foreground">
                      Button displays a MessageCircle icon from Lucide
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="agentPosition">Button Position</Label>
                      <select
                        id="agentPosition"
                        value={settings.ai.supportAgent.position}
                        onChange={(e) => setSettings({
                          ...settings,
                          ai: {
                            ...settings.ai,
                            supportAgent: { ...settings.ai.supportAgent, position: e.target.value as any }
                          }
                        })}
                        className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm"
                      >
                        <option value="bottom-right">Bottom Right</option>
                        <option value="bottom-left">Bottom Left</option>
                        <option value="middle-right">Middle Right</option>
                        <option value="middle-left">Middle Left</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="modalPosition">Modal Position</Label>
                      <select
                        id="modalPosition"
                        value={settings.ai.supportAgent.modalPosition || 'bottom-right'}
                        onChange={(e) => setSettings({
                          ...settings,
                          ai: {
                            ...settings.ai,
                            supportAgent: { ...settings.ai.supportAgent, modalPosition: e.target.value as any }
                          }
                        })}
                        className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm"
                      >
                        <option value="bottom-right">Bottom Right</option>
                        <option value="bottom-left">Bottom Left</option>
                        <option value="center">Center</option>
                        <option value="top-right">Top Right</option>
                        <option value="top-left">Top Left</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="offsetX">Horizontal Offset (px)</Label>
                      <Input
                        id="offsetX"
                        type="number"
                        value={settings.ai.supportAgent.offsetX || 24}
                        onChange={(e) => setSettings({
                          ...settings,
                          ai: {
                            ...settings.ai,
                            supportAgent: { ...settings.ai.supportAgent, offsetX: parseInt(e.target.value) || 24 }
                          }
                        })}
                        placeholder="24"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="offsetY">Vertical Offset (px)</Label>
                      <Input
                        id="offsetY"
                        type="number"
                        value={settings.ai.supportAgent.offsetY || 24}
                        onChange={(e) => setSettings({
                          ...settings,
                          ai: {
                            ...settings.ai,
                            supportAgent: { ...settings.ai.supportAgent, offsetY: parseInt(e.target.value) || 24 }
                          }
                        })}
                        placeholder="24"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="modalWidth">Modal Width (px)</Label>
                      <Input
                        id="modalWidth"
                        type="number"
                        value={settings.ai.supportAgent.modalWidth || 400}
                        onChange={(e) => setSettings({
                          ...settings,
                          ai: {
                            ...settings.ai,
                            supportAgent: { ...settings.ai.supportAgent, modalWidth: parseInt(e.target.value) || 400 }
                          }
                        })}
                        placeholder="400"
                        min="300"
                        max="600"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="modalHeight">Modal Height (px)</Label>
                      <Input
                        id="modalHeight"
                        type="number"
                        value={settings.ai.supportAgent.modalHeight || 600}
                        onChange={(e) => setSettings({
                          ...settings,
                          ai: {
                            ...settings.ai,
                            supportAgent: { ...settings.ai.supportAgent, modalHeight: parseInt(e.target.value) || 600 }
                          }
                        })}
                        placeholder="600"
                        min="400"
                        max="800"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Show Tooltip</Label>
                        <p className="text-sm text-muted-foreground">Display tooltip on hover</p>
                      </div>
                      <Switch
                        checked={settings.ai.supportAgent.showTooltip !== false}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          ai: {
                            ...settings.ai,
                            supportAgent: { ...settings.ai.supportAgent, showTooltip: checked }
                          }
                        })}
                      />
                    </div>

                    {settings.ai.supportAgent.showTooltip !== false && (
                      <div className="space-y-2 pl-6">
                        <Label htmlFor="tooltipText">Tooltip Text</Label>
                        <Input
                          id="tooltipText"
                          value={settings.ai.supportAgent.tooltipText || 'Need help? Chat with us!'}
                          onChange={(e) => setSettings({
                            ...settings,
                            ai: {
                              ...settings.ai,
                              supportAgent: { ...settings.ai.supportAgent, tooltipText: e.target.value }
                            }
                          })}
                          placeholder="Need help? Chat with us!"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Ripple Effect</Label>
                        <p className="text-sm text-muted-foreground">Animated ripple on button</p>
                      </div>
                      <Switch
                        checked={settings.ai.supportAgent.enableRipple !== false}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          ai: {
                            ...settings.ai,
                            supportAgent: { ...settings.ai.supportAgent, enableRipple: checked }
                          }
                        })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Auto Open</Label>
                        <p className="text-sm text-muted-foreground">Automatically open after delay</p>
                      </div>
                      <Switch
                        checked={settings.ai.supportAgent.autoOpen || false}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          ai: {
                            ...settings.ai,
                            supportAgent: { ...settings.ai.supportAgent, autoOpen: checked }
                          }
                        })}
                      />
                    </div>

                    {settings.ai.supportAgent.autoOpen && (
                      <div className="space-y-2 pl-6">
                        <Label htmlFor="autoOpenDelay">Auto Open Delay (seconds)</Label>
                        <Input
                          id="autoOpenDelay"
                          type="number"
                          value={settings.ai.supportAgent.autoOpenDelay || 5}
                          onChange={(e) => setSettings({
                            ...settings,
                            ai: {
                              ...settings.ai,
                              supportAgent: { ...settings.ai.supportAgent, autoOpenDelay: parseInt(e.target.value) || 5 }
                            }
                          })}
                          placeholder="5"
                          min="1"
                          max="60"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="themeMode">Theme Mode</Label>
                      <select
                        id="themeMode"
                        value={settings.ai.supportAgent.themeMode || 'auto'}
                        onChange={(e) => setSettings({
                          ...settings,
                          ai: {
                            ...settings.ai,
                            supportAgent: { ...settings.ai.supportAgent, themeMode: e.target.value as any }
                          }
                        })}
                        className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm"
                      >
                        <option value="auto">Auto (Follow System)</option>
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                      </select>
                      <p className="text-xs text-muted-foreground">
                        Auto mode reads the site's CSS variables for theming
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-muted rounded-md">
                    <h4 className="font-medium mb-2">Preview</h4>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">{settings.ai.supportAgent.agentName}</p>
                        <p className="text-sm text-muted-foreground">{settings.ai.supportAgent.agentDescription}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button type="button" onClick={() => handleSave('ai', settings.ai)} disabled={saving}>
                      <Save className="mr-2 h-4 w-4" />
                      {saving ? 'Saving...' : 'Save Support Agent Settings'}
                    </Button>
                  </div>
                </>
              )}

              {!settings.ai.supportAgent?.enabled && (
                <div className="pt-4 border-t">
                  <Button type="button" onClick={() => handleSave('ai', settings.ai)} disabled={saving}>
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? 'Saving...' : 'Save Support Agent Settings'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Google Services Tab */}
        <TabsContent value="google" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Google Analytics
              </CardTitle>
              <CardDescription>
                Track website traffic and user behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Google Analytics</Label>
                  <p className="text-sm text-muted-foreground">GA4 property</p>
                </div>
                <Switch
                  checked={settings.google.analytics.enabled}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    google: {
                      ...settings.google,
                      analytics: { ...settings.google.analytics, enabled: checked }
                    }
                  })}
                />
              </div>

              {settings.google.analytics.enabled && (
                <div className="space-y-2">
                  <Label htmlFor="measurementId">Measurement ID</Label>
                  <Input
                    id="measurementId"
                    value={settings.google.analytics.measurementId}
                    onChange={(e) => setSettings({
                      ...settings,
                      google: {
                        ...settings.google,
                        analytics: { ...settings.google.analytics, measurementId: e.target.value }
                      }
                    })}
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>
              )}

              <div className="pt-4 border-t">
                <Button type="button" onClick={() => handleSave('google', settings.google)} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Google Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Google Search Console</CardTitle>
              <CardDescription>
                Verify site ownership
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Search Console</Label>
                  <p className="text-sm text-muted-foreground">Add verification meta tag</p>
                </div>
                <Switch
                  checked={settings.google.searchConsole.enabled}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    google: {
                      ...settings.google,
                      searchConsole: { ...settings.google.searchConsole, enabled: checked }
                    }
                  })}
                />
              </div>

              {settings.google.searchConsole.enabled && (
                <div className="space-y-2">
                  <Label htmlFor="verificationCode">Verification Code</Label>
                  <Input
                    id="verificationCode"
                    value={settings.google.searchConsole.verificationCode}
                    onChange={(e) => setSettings({
                      ...settings,
                      google: {
                        ...settings.google,
                        searchConsole: { ...settings.google.searchConsole, verificationCode: e.target.value }
                      }
                    })}
                    placeholder="google-site-verification code"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Google Tag Manager</CardTitle>
              <CardDescription>
                Manage marketing and analytics tags
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Tag Manager</Label>
                  <p className="text-sm text-muted-foreground">GTM container</p>
                </div>
                <Switch
                  checked={settings.google.tagManager.enabled}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    google: {
                      ...settings.google,
                      tagManager: { ...settings.google.tagManager, enabled: checked }
                    }
                  })}
                />
              </div>

              {settings.google.tagManager.enabled && (
                <div className="space-y-2">
                  <Label htmlFor="containerId">Container ID</Label>
                  <Input
                    id="containerId"
                    value={settings.google.tagManager.containerId}
                    onChange={(e) => setSettings({
                      ...settings,
                      google: {
                        ...settings.google,
                        tagManager: { ...settings.google.tagManager, containerId: e.target.value }
                      }
                    })}
                    placeholder="GTM-XXXXXXX"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Google reCAPTCHA</CardTitle>
              <CardDescription>
                Protect forms from spam and abuse
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable reCAPTCHA</Label>
                  <p className="text-sm text-muted-foreground">v3 recommended</p>
                </div>
                <Switch
                  checked={settings.google.recaptcha.enabled}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    google: {
                      ...settings.google,
                      recaptcha: { ...settings.google.recaptcha, enabled: checked }
                    }
                  })}
                />
              </div>

              {settings.google.recaptcha.enabled && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="siteKey">Site Key</Label>
                    <Input
                      id="siteKey"
                      value={settings.google.recaptcha.siteKey}
                      onChange={(e) => setSettings({
                        ...settings,
                        google: {
                          ...settings.google,
                          recaptcha: { ...settings.google.recaptcha, siteKey: e.target.value }
                        }
                      })}
                      placeholder="6Lc..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secretKey">Secret Key</Label>
                    <Input
                      id="secretKey"
                      type="password"
                      value={settings.google.recaptcha.secretKey}
                      onChange={(e) => setSettings({
                        ...settings,
                        google: {
                          ...settings.google,
                          recaptcha: { ...settings.google.recaptcha, secretKey: e.target.value }
                        }
                      })}
                      placeholder="6Lc..."
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Legal Compliance Tab */}
        <TabsContent value="legal" className="space-y-6">
          <div className="flex gap-6">
            {/* Vertical Sub-tabs */}
            <div className="w-64 flex-shrink-0">
              <nav className="space-y-1">
                <button
                  onClick={() => setLegalSubTab('impressum')}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    legalSubTab === 'impressum'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <FileText className="h-5 w-5" />
                  <span>Impressum</span>
                </button>
                <button
                  onClick={() => setLegalSubTab('privacy')}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    legalSubTab === 'privacy'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Scale className="h-5 w-5" />
                  <span>Privacy Policy</span>
                </button>
                <button
                  onClick={() => setLegalSubTab('terms')}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    legalSubTab === 'terms'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <FileText className="h-5 w-5" />
                  <span>Terms & Conditions</span>
                </button>
                <button
                  onClick={() => setLegalSubTab('withdrawal')}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    legalSubTab === 'withdrawal'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <FileText className="h-5 w-5" />
                  <span>Right of Withdrawal</span>
                </button>
                <button
                  onClick={() => setLegalSubTab('cookies')}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    legalSubTab === 'cookies'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Globe className="h-5 w-5" />
                  <span>Cookie Consent</span>
                </button>
              </nav>
            </div>

            {/* Content Area */}
            <div className="flex-1 space-y-6">
              {/* Impressum */}
              {legalSubTab === 'impressum' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Impressum (German Law Required)
                    </CardTitle>
                    <CardDescription>
                      Company details required by German law (§5 TMG)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="impressumContent">Impressum Content</Label>
                      <Textarea
                        id="impressumContent"
                        value={settings.legal.impressum.content}
                        onChange={(e) => setSettings({
                          ...settings,
                          legal: {
                            ...settings.legal,
                            impressum: { ...settings.legal.impressum, content: e.target.value }
                          }
                        })}
                        rows={15}
                        placeholder="Enter your Impressum content here..."
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        Must include: Company name, address, managing director, commercial register, tax ID
                      </p>
                    </div>

                    <div className="pt-4 border-t">
                      <Button type="button" onClick={() => handleSave('legal', settings.legal)} disabled={saving}>
                        <Save className="mr-2 h-4 w-4" />
                        {saving ? 'Saving...' : 'Save Impressum'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Privacy Policy */}
              {legalSubTab === 'privacy' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Scale className="h-5 w-5" />
                      Datenschutzerklärung (Privacy Policy)
                    </CardTitle>
                    <CardDescription>
                      GDPR-compliant privacy policy
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="datenschutzContent">Privacy Policy Content</Label>
                      <Textarea
                        id="datenschutzContent"
                        value={settings.legal.datenschutz.content}
                        onChange={(e) => setSettings({
                          ...settings,
                          legal: {
                            ...settings.legal,
                            datenschutz: { ...settings.legal.datenschutz, content: e.target.value }
                          }
                        })}
                        rows={15}
                        placeholder="Enter your privacy policy here..."
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        Last updated: {settings.legal.datenschutz.lastUpdated}
                      </p>
                    </div>

                    <div className="pt-4 border-t">
                      <Button type="button" onClick={() => handleSave('legal', settings.legal)} disabled={saving}>
                        <Save className="mr-2 h-4 w-4" />
                        {saving ? 'Saving...' : 'Save Privacy Policy'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Terms and Conditions */}
              {legalSubTab === 'terms' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      AGB (Terms and Conditions)
                    </CardTitle>
                    <CardDescription>
                      General terms and conditions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="agbContent">Terms and Conditions</Label>
                      <Textarea
                        id="agbContent"
                        value={settings.legal.agb.content}
                        onChange={(e) => setSettings({
                          ...settings,
                          legal: {
                            ...settings.legal,
                            agb: { ...settings.legal.agb, content: e.target.value }
                          }
                        })}
                        rows={15}
                        placeholder="Enter your terms and conditions here..."
                        className="font-mono text-sm"
                      />
                    </div>

                    <div className="pt-4 border-t">
                      <Button type="button" onClick={() => handleSave('legal', settings.legal)} disabled={saving}>
                        <Save className="mr-2 h-4 w-4" />
                        {saving ? 'Saving...' : 'Save Terms & Conditions'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Right of Withdrawal */}
              {legalSubTab === 'withdrawal' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Widerrufsrecht (Right of Withdrawal)
                    </CardTitle>
                    <CardDescription>
                      Consumer protection for online purchases (German law)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="widerrufsrechtContent">Right of Withdrawal</Label>
                      <Textarea
                        id="widerrufsrechtContent"
                        value={settings.legal.widerrufsrecht.content}
                        onChange={(e) => setSettings({
                          ...settings,
                          legal: {
                            ...settings.legal,
                            widerrufsrecht: { ...settings.legal.widerrufsrecht, content: e.target.value }
                          }
                        })}
                        rows={15}
                        placeholder="Enter withdrawal policy here..."
                        className="font-mono text-sm"
                      />
                    </div>

                    <div className="pt-4 border-t">
                      <Button type="button" onClick={() => handleSave('legal', settings.legal)} disabled={saving}>
                        <Save className="mr-2 h-4 w-4" />
                        {saving ? 'Saving...' : 'Save Withdrawal Policy'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Cookie Consent */}
              {legalSubTab === 'cookies' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Cookie Consent
                    </CardTitle>
                    <CardDescription>
                      GDPR-compliant cookie consent banner
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Enable Cookie Consent</Label>
                        <p className="text-sm text-muted-foreground">Required by GDPR</p>
                      </div>
                      <Switch
                        checked={settings.legal.cookieConsent.enabled}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          legal: {
                            ...settings.legal,
                            cookieConsent: { ...settings.legal.cookieConsent, enabled: checked }
                          }
                        })}
                      />
                    </div>

                    {settings.legal.cookieConsent.enabled && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="cookiePosition">Banner Position</Label>
                          <select
                            id="cookiePosition"
                            value={settings.legal.cookieConsent.position}
                            onChange={(e) => setSettings({
                              ...settings,
                              legal: {
                                ...settings.legal,
                                cookieConsent: { ...settings.legal.cookieConsent, position: e.target.value }
                              }
                            })}
                            className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm"
                          >
                            <option value="bottom">Bottom</option>
                            <option value="top">Top</option>
                            <option value="center">Center</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cookieTheme">Theme</Label>
                          <select
                            id="cookieTheme"
                            value={settings.legal.cookieConsent.theme}
                            onChange={(e) => setSettings({
                              ...settings,
                              legal: {
                                ...settings.legal,
                                cookieConsent: { ...settings.legal.cookieConsent, theme: e.target.value }
                              }
                            })}
                            className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm"
                          >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                          </select>
                        </div>
                      </>
                    )}

                    <div className="pt-4 border-t">
                      <Button type="button" onClick={() => handleSave('legal', settings.legal)} disabled={saving}>
                        <Save className="mr-2 h-4 w-4" />
                        {saving ? 'Saving...' : 'Save Cookie Settings'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO Configuration</CardTitle>
              <CardDescription>
                Search engine optimization settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seoKeywords">Keywords (comma separated)</Label>
                <Input
                  id="seoKeywords"
                  placeholder="web agency, web development, UI/UX design"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ogImage">Open Graph Image URL</Label>
                <Input
                  id="ogImage"
                  placeholder="/images/og-image.jpg"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>AI SEO Optimization</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically generate meta tags using AI
                  </p>
                </div>
                <Switch checked={settings.ai.seoOptimization} disabled />
              </div>
              <p className="text-xs text-muted-foreground">
                Configure AI settings in the AI tab to enable this feature
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invoice Preview Sheet */}
      <Sheet open={showInvoicePreview} onOpenChange={setShowInvoicePreview}>
        <SheetContent side="right" className="sm:max-w-[95vw] w-full overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Invoice Preview</SheetTitle>
            <SheetDescription>
              Preview of your invoice template with sample data
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <InvoicePreview
              invoiceNumber="RE000023"
              customerNumber="10018"
              invoiceDate={new Date().toISOString()}
              dueDate={new Date().toISOString()}
              customerName="Net und Print Verlag und Marketing GmbH"
              customerEmail="herrn.andreas.krznar@example.com"
              customerAddress="Herrn Andreas Krznar, Benzstraße 4, 45891 Gelsenkirchen"
              items={[
                {
                  description: "Business Webseite Basic\nCMS Business Webseite Basic - Händlerpreis",
                  quantity: 1,
                  unitPrice: 1500.00,
                  discount: 50.00,
                  total: 750.00
                },
                {
                  description: "Logo Design\ninkl. in Händlerpreis",
                  quantity: 1,
                  unitPrice: 180.00,
                  discount: 100.00,
                  total: 0.00
                }
              ]}
              subtotal={750.00}
              taxRate={settings.invoice.taxRate}
              taxAmount={142.50}
              total={892.50}
              paymentLink="https://paypal.me/dfmsolutions/892.5eur"
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}