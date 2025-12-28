'use client'

import { useEffect, useState } from 'react'
import { X, MessageCircle } from 'lucide-react'

interface AISupportAgentProps {
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

export default function AISupportAgent({
  agentId,
  agentName,
  agentDescription,
  buttonSize,
  position,
  offsetX,
  offsetY,
  modalWidth,
  modalHeight,
  modalPosition,
  showTooltip,
  tooltipText,
  enableRipple,
  autoOpen,
  autoOpenDelay,
  themeMode,
}: AISupportAgentProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const [iframeSrc, setIframeSrc] = useState('')
  const [primaryColor, setPrimaryColor] = useState('0 0 0') // Default black
  const [isDark, setIsDark] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [buttonBgColor, setButtonBgColor] = useState('rgb(0 0 0)')
  const [modalBgColor, setModalBgColor] = useState('white')
  const [modalContentBg, setModalContentBg] = useState('rgb(243 244 246)')

  useEffect(() => {
    // Get CSS variable colors from the page
    const root = document.documentElement
    const computedStyle = getComputedStyle(root)
    
    // Get primary color from CSS variables (Tailwind uses various formats)
    const primary = computedStyle.getPropertyValue('--primary').trim()
    
    if (primary) {
      // Check if it's OKLCH format (like "oklch(0.205 0 0)" or "0.205 0 0")
      if (primary.includes('oklch') || (primary.includes('0.') && primary.split(' ').length >= 3)) {
        // Extract numbers from oklch format
        const numbers = primary.match(/[\d.]+/g)
        if (numbers && numbers.length >= 3) {
          const [l, c, h] = numbers.map(parseFloat)
          // Convert OKLCH to RGB (simplified - using lightness as grayscale for now)
          const gray = Math.round(l * 255)
          setPrimaryColor(`${gray} ${gray} ${gray}`)
          console.log('AI Support Agent - Detected OKLCH:', primary, '→ RGB:', `${gray} ${gray} ${gray}`)
        }
      }
      // Check if it's HSL format (like "222.47% 84.85% 4.91%")
      else if (primary.includes('%')) {
        // Convert HSL to RGB
        const parts = primary.split(' ').map(v => parseFloat(v))
        if (parts.length >= 3) {
          const [h, s, l] = parts
          const rgb = hslToRgb(h, s, l)
          setPrimaryColor(`${rgb[0]} ${rgb[1]} ${rgb[2]}`)
          console.log('AI Support Agent - Detected HSL:', primary, '→ RGB:', `${rgb[0]} ${rgb[1]} ${rgb[2]}`)
        }
      }
      // Already in RGB format (e.g., "59 130 246")
      else if (primary.includes(' ')) {
        setPrimaryColor(primary)
        console.log('AI Support Agent - Using RGB:', primary)
      } else {
        console.warn('AI Support Agent - Unknown primary color format:', primary, '- using default black')
      }
    } else {
      console.warn('AI Support Agent - No --primary CSS variable found, using default black')
    }

    // Detect dark mode and update colors
    const detectDarkMode = () => {
      if (themeMode === 'auto') {
        const isDarkMode = root.classList.contains('dark') ||
                          window.matchMedia('(prefers-color-scheme: dark)').matches
        setIsDark(isDarkMode)
        
        // Update colors based on theme
        if (isDarkMode) {
          setButtonBgColor('rgb(255 255 255)') // White button in dark mode
          setModalBgColor('rgb(17 24 39)') // Dark modal background
          setModalContentBg('rgb(31 41 55)') // Dark content background
        } else {
          setButtonBgColor(`rgb(${primaryColor})`) // Primary color in light mode
          setModalBgColor('white')
          setModalContentBg('rgb(243 244 246)')
        }
      } else {
        const isDarkMode = themeMode === 'dark'
        setIsDark(isDarkMode)
        
        if (isDarkMode) {
          setButtonBgColor('rgb(255 255 255)')
          setModalBgColor('rgb(17 24 39)')
          setModalContentBg('rgb(31 41 55)')
        } else {
          setButtonBgColor(`rgb(${primaryColor})`)
          setModalBgColor('white')
          setModalContentBg('rgb(243 244 246)')
        }
      }
    }

    detectDarkMode()

    // Watch for theme changes
    const observer = new MutationObserver(detectDarkMode)
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })

    return () => observer.disconnect()
  }, [themeMode, primaryColor])

  // Helper function to convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
    // Normalize values
    h = h / 360
    s = s / 100
    l = l / 100

    let r, g, b

    if (s === 0) {
      r = g = b = l // achromatic
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1/6) return p + (q - p) * 6 * t
        if (t < 1/2) return q
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
        return p
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1/3)
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
  }

  useEffect(() => {
    // Auto-open functionality
    if (autoOpen && autoOpenDelay > 0 && !isOpen) {
      const timer = setTimeout(() => {
        handleOpen()
      }, autoOpenDelay * 1000) // autoOpenDelay is in seconds, convert to ms

      return () => clearTimeout(timer)
    }
  }, [autoOpen, autoOpenDelay, isOpen])

  useEffect(() => {
    // Prevent body scroll when modal is open on mobile
    if (isOpen && typeof window !== 'undefined' && window.innerWidth <= 768) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    // Aggressively modify iframe content for EU law compliance
    if (!isOpen || !iframeSrc) return

    const iframe = document.querySelector('iframe[src*="bey.chat"]') as HTMLIFrameElement
    if (!iframe) return

    const modifyIframeContent = () => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
        if (!iframeDoc) return

        // Find and replace links aggressively
        const links = iframeDoc.querySelectorAll('a')
        links.forEach(link => {
          const href = link.getAttribute('href') || ''
          const text = link.textContent?.toLowerCase() || ''

          // Replace Terms of Service links
          if (text.includes('terms') || href.includes('terms')) {
            link.setAttribute('href', '/agb')
            link.setAttribute('target', '_blank')
            console.log('Modified Terms link to /agb')
          }

          // Replace Privacy Policy links
          if (text.includes('privacy') || href.includes('privacy') || text.includes('datenschutz')) {
            link.setAttribute('href', '/datenschutz')
            link.setAttribute('target', '_blank')
            console.log('Modified Privacy link to /datenschutz')
          }
        })

        // Change button color from yellow to black
        const buttons = iframeDoc.querySelectorAll('button, [role="button"]')
        buttons.forEach(button => {
          const bgColor = window.getComputedStyle(button).backgroundColor
          // Check if button is yellow/orange colored
          if (bgColor.includes('255, 193') || bgColor.includes('251, 191') || button.textContent?.includes('Start')) {
            (button as HTMLElement).style.backgroundColor = '#000000'
            (button as HTMLElement).style.color = '#ffffff'
            console.log('Modified button color to black')
          }
        })
      } catch (e) {
        // Cross-origin restriction - use message passing instead
        console.warn('Cannot directly access iframe content (cross-origin), attempting alternative method')
      }
    }

    // Try multiple times as iframe content loads asynchronously
    const intervals = [500, 1000, 2000, 3000, 5000]
    const timers = intervals.map(delay =>
      setTimeout(modifyIframeContent, delay)
    )

    // Also monitor for DOM changes
    iframe.addEventListener('load', () => {
      setTimeout(modifyIframeContent, 500)
      setTimeout(modifyIframeContent, 2000)
    })

    return () => {
      timers.forEach(timer => clearTimeout(timer))
    }
  }, [isOpen, iframeSrc])

  const agentUrl = `https://bey.chat/agent/${agentId}`

  const handleOpen = () => {
    setIsOpen(true)
    if (!iframeSrc) {
      setIframeSrc(agentUrl)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  // Position styles for button
  const getButtonPositionStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {}
    
    switch (position) {
      case 'bottom-right':
        base.bottom = `${offsetY}px`
        base.right = `${offsetX}px`
        break
      case 'bottom-left':
        base.bottom = `${offsetY}px`
        base.left = `${offsetX}px`
        break
      case 'middle-right':
        base.top = '50%'
        base.right = `${offsetX}px`
        base.transform = 'translateY(-50%)'
        break
      case 'middle-left':
        base.top = '50%'
        base.left = `${offsetX}px`
        base.transform = 'translateY(-50%)'
        break
    }
    return base
  }

  // Position styles for modal
  const getModalPositionStyles = (): React.CSSProperties => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
    const base: React.CSSProperties = {}

    if (isMobile) {
      return {
        bottom: '10px',
        right: '10px',
        left: '10px',
        margin: 'auto',
        width: 'calc(100vw - 20px)',
        height: 'calc(100vh - 80px)',
      }
    }

    base.width = `${modalWidth}px`
    base.height = `${modalHeight}px`

    switch (modalPosition) {
      case 'bottom-right':
        base.bottom = `${offsetY}px`
        base.right = `${offsetX}px`
        break
      case 'bottom-left':
        base.bottom = `${offsetY}px`
        base.left = `${offsetX}px`
        break
      case 'top-right':
        base.top = `${offsetY}px`
        base.right = `${offsetX}px`
        break
      case 'top-left':
        base.top = `${offsetY}px`
        base.left = `${offsetX}px`
        break
      case 'center':
        base.top = '50%'
        base.left = '50%'
        base.transform = 'translate(-50%, -50%)'
        break
    }
    return base
  }

  const getTooltipPosition = (): React.CSSProperties => {
    const base: React.CSSProperties = {}
    
    // Match button's vertical position
    if (position.includes('bottom')) {
      base.bottom = `${offsetY}px`
    } else if (position.includes('middle')) {
      base.top = '50%'
      base.transform = 'translateY(-50%)'
    }
    
    // Tooltip should be on the OPPOSITE horizontal side of the button
    if (position.includes('right')) {
      // Button is on right side, place tooltip to its left
      base.right = `${offsetX + buttonSize + 12}px`
    } else if (position.includes('left')) {
      // Button is on left side, place tooltip to its right
      base.left = `${offsetX + buttonSize + 12}px`
    }
    
    return base
  }

  const getTooltipArrow = () => {
    // Arrow points towards the button
    if (position.includes('right')) {
      // Button is on right, arrow on right side of tooltip pointing right
      return 'right-[-8px] border-l-[8px] border-r-0'
    }
    // Button is on left, arrow on left side of tooltip pointing left
    return 'left-[-8px] border-r-[8px] border-l-0'
  }

  const buttonPositionStyles = getButtonPositionStyles()
  const modalPositionStyles = getModalPositionStyles()
  const tooltipPositionStyles = getTooltipPosition()

  // Dynamic color styles
  const getBgColor = (opacity: number) => `rgba(${primaryColor} / ${opacity})`
  const getBorderColor = (opacity: number) => `rgba(${primaryColor} / ${opacity})`

  return (
    <>
      <style jsx global>{`
        @keyframes ripple {
          0% {
            width: 100%;
            height: 100%;
            opacity: 1;
          }
          100% {
            width: 200%;
            height: 200%;
            opacity: 0;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed z-[9999] animate-[slideUp_0.3s_ease] rounded-2xl shadow-2xl"
          style={modalPositionStyles}
        >
          <div
            className="w-full h-full rounded-2xl flex flex-col overflow-hidden"
            style={{
              backgroundColor: modalBgColor,
            }}
          >
            {/* Header */}
            <div 
              className="text-white p-4 flex items-center justify-between flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${getBgColor(1)} 0%, ${getBgColor(0.8)} 100%)`,
              }}
            >
              <div>
                <h3 className="font-semibold text-base m-0">{agentName}</h3>
                <span className="text-xs opacity-90">{agentDescription}</span>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full hover:bg-red-600 transition-colors flex items-center justify-center flex-shrink-0 border-0 cursor-pointer p-0 group"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                }}
                aria-label="Close"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Iframe Container */}
            <div
              className="flex-1 w-full"
              style={{
                backgroundColor: modalContentBg,
              }}
            >
              <iframe
                src={iframeSrc}
                allow="camera; microphone; fullscreen"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating Button - Only show when modal is closed */}
      {!isOpen && (
        <div
          className="fixed z-[9998]"
          style={buttonPositionStyles}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Main Button */}
          <button
            onClick={handleOpen}
            className="rounded-full cursor-pointer flex items-center justify-center transition-all duration-300 hover:scale-110 border-0 p-0 relative"
            style={{
              width: `${buttonSize}px`,
              height: `${buttonSize}px`,
              background: buttonBgColor,
              boxShadow: isDark
                ? `0 8px 32px rgba(255 255 255 / 0.2)`
                : `0 8px 32px ${getBgColor(0.4)}`,
            }}
            aria-label={`Chat with ${agentName}`}
          >
            {/* Icon */}
            <MessageCircle
              className="relative z-10"
              style={{ color: isDark ? 'rgb(0 0 0)' : 'white' }}
              size={buttonSize * 0.5}
              strokeWidth={2}
            />
            
            {/* Ripple Effect */}
            {enableRipple && (
              <>
                <span
                  className="absolute top-1/2 left-1/2 w-full h-full rounded-full -translate-x-1/2 -translate-y-1/2 animate-[ripple_2s_infinite_ease-out]"
                  style={{ border: `2px solid ${getBorderColor(0.6)}` }}
                />
                <span
                  className="absolute top-1/2 left-1/2 w-full h-full rounded-full -translate-x-1/2 -translate-y-1/2 animate-[ripple_2s_infinite_ease-out]"
                  style={{ border: `2px solid ${getBorderColor(0.6)}`, animationDelay: '1s' }}
                />
              </>
            )}
          </button>

          {/* Tooltip - Only show on hover */}
          {showTooltip && isHovering && (
            <div
              className="absolute whitespace-nowrap rounded-lg z-10 transition-opacity duration-200"
              style={{
                background: getBgColor(0.95),
                backdropFilter: 'blur(10px)',
                color: 'white',
                padding: '10px 16px',
                fontSize: '14px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                // Position tooltip relative to button
                ...(position.includes('right')
                  ? { right: `${buttonSize + 12}px`, top: '50%', transform: 'translateY(-50%)' }
                  : { left: `${buttonSize + 12}px`, top: '50%', transform: 'translateY(-50%)' }
                ),
              }}
            >
              {tooltipText}
              <span
                className={`absolute top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ${getTooltipArrow()}`}
                style={{
                  borderLeftColor: position.includes('right') ? getBgColor(0.95) : 'transparent',
                  borderRightColor: position.includes('left') ? getBgColor(0.95) : 'transparent',
                }}
              />
            </div>
          )}
        </div>
      )}
    </>
  )
}