'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import AISupportAgent from './AISupportAgent'

interface AISettings {
  supportAgent?: {
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
}

export default function AISupportAgentWrapper() {
  const [settings, setSettings] = useState<AISettings | null>(null)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()

  // Hide in admin panel
  const isAdminRoute = pathname?.startsWith('/admin')

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings')
        const data = await res.json()
        if (data.settings?.ai) {
          setSettings(data.settings.ai)
        }
      } catch (error) {
        console.error('Error fetching AI settings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  // Don't render in admin routes
  if (isAdminRoute) {
    return null
  }

  if (loading || !settings?.supportAgent?.enabled || !settings.supportAgent.agentId) {
    return null
  }

  const config = settings.supportAgent

  return (
    <AISupportAgent
      agentId={config.agentId}
      agentName={config.agentName || 'AI Assistant'}
      agentDescription={config.agentDescription || 'Online'}
      buttonSize={config.buttonSize || 64}
      position={config.position || 'bottom-right'}
      offsetX={config.offsetX ?? 24}
      offsetY={config.offsetY ?? 24}
      modalWidth={config.modalWidth || 400}
      modalHeight={config.modalHeight || 600}
      modalPosition={config.modalPosition || 'bottom-right'}
      showTooltip={config.showTooltip !== false}
      tooltipText={config.tooltipText || 'Need help? Chat with us!'}
      enableRipple={config.enableRipple !== false}
      autoOpen={config.autoOpen || false}
      autoOpenDelay={config.autoOpenDelay || 5}
      themeMode={config.themeMode || 'auto'}
    />
  )
}