'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lock, User, Eye, EyeOff, Shield, Mail } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'

export function LoginModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter()
  const t = useTranslations('login')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loginType, setLoginType] = useState<'email' | 'username'>('email')
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  })

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    if (loginType === 'email') {
      if (formData.email === 'user@example.com' && formData.password === 'user123') {
        localStorage.setItem('user_logged_in', 'true')
        localStorage.setItem('user_email', formData.email)

        toast({
          title: t('loginSuccessful'),
          description: t('redirectingDashboard'),
        })

        setTimeout(() => {
          setLoading(false)
          onOpenChange(false)
          router.push('/user/dashboard')
        }, 1000)
      } else {
        setTimeout(() => setLoading(false), 1000)
        toast({
          title: t('loginFailed'),
          description: t('invalidEmailPassword'),
          variant: 'destructive',
        })
      }
    } else {
      if (formData.username === 'admin' && formData.password === 'admin123') {
        localStorage.setItem('admin_logged_in', 'true')
        localStorage.setItem('admin_username', formData.username)

        toast({
          title: t('loginSuccessful'),
          description: t('redirectingAdminDashboard'),
        })

        setTimeout(() => {
          setLoading(false)
          onOpenChange(false)
          router.push('/admin')
        }, 1000)
      } else {
        setTimeout(() => setLoading(false), 1000)
        toast({
          title: t('loginFailed'),
          description: t('invalidUsernamePassword'),
          variant: 'destructive',
        })
      }
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-6">
          <SheetTitle className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            {t('title')}
          </SheetTitle>
          <SheetDescription>
            {t('description')}
          </SheetDescription>
        </SheetHeader>

        <div className="px-2 pb-6">
          <div className="mb-6 flex gap-2 bg-muted/50 rounded-lg p-1">
            <button
              type="button"
              onClick={() => {
                setLoginType('email')
                setFormData({ email: '', username: '', password: '' })
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                loginType === 'email'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Mail className="h-4 w-4 mr-2 inline" />
              {t('user')}
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginType('username')
                setFormData({ email: '', username: '', password: '' })
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                loginType === 'username'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Shield className="h-4 w-4 mr-2 inline" />
              {t('admin')}
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 max-w-sm mx-auto">
            <div className="space-y-2">
              <Label htmlFor={loginType === 'email' ? 'email' : 'username'}>
                {loginType === 'email' ? t('email') : t('username')}
              </Label>
              <div className="relative">
                {loginType === 'email' ? (
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                ) : (
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                )}
                <Input
                  id={loginType === 'email' ? 'email' : 'username'}
                  type={loginType === 'email' ? 'email' : 'text'}
                  placeholder={loginType === 'email' ? t('emailPlaceholder') : t('usernamePlaceholder')}
                  value={loginType === 'email' ? formData.email : formData.username}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [loginType === 'email' ? 'email' : 'username']: e.target.value,
                    })
                  }
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('passwordPlaceholder')}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium">{t('demoCredentials')}</p>
              {loginType === 'email' ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    {t('email')}: <code className="bg-background px-2 py-0.5 rounded text-xs">user@example.com</code>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('password')}: <code className="bg-background px-2 py-0.5 rounded text-xs">user123</code>
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    {t('username')}: <code className="bg-background px-2 py-0.5 rounded text-xs">admin</code>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('password')}: <code className="bg-background px-2 py-0.5 rounded text-xs">admin123</code>
                  </p>
                </>
              )}
            </div>

            <Button type="submit" disabled={loading} className="w-full max-w-sm mx-auto">
              {loading ? t('signingIn') : t('signIn')}
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
