'use client'

import { toast } from 'sonner'

/**
 * Custom hook for displaying notifications
 * Uses Sonner toast library (already installed with shadcn/ui)
 */

export interface NotificationOptions {
  title?: string
  description?: string
  duration?: number
}

export function useNotifications() {
  /**
   * Show success notification
   */
  function success(message: string, options?: NotificationOptions) {
    toast.success(options?.title || 'Success', {
      description: options?.description || message,
      duration: options?.duration || 4000
    })
  }

  /**
   * Show error notification
   */
  function error(message: string, options?: NotificationOptions) {
    toast.error(options?.title || 'Error', {
      description: options?.description || message,
      duration: options?.duration || 5000
    })
  }

  /**
   * Show warning notification
   */
  function warning(message: string, options?: NotificationOptions) {
    toast.warning(options?.title || 'Warning', {
      description: options?.description || message,
      duration: options?.duration || 4000
    })
  }

  /**
   * Show info notification
   */
  function info(message: string, options?: NotificationOptions) {
    toast.info(options?.title || 'Info', {
      description: options?.description || message,
      duration: options?.duration || 4000
    })
  }

  /**
   * Show loading notification with promise
   */
  function loading<T>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string
      error: string
    }
  ): Promise<T> {
    return toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error
    })
  }

  /**
   * Show custom notification
   */
  function custom(message: string, options?: NotificationOptions) {
    toast(options?.title || message, {
      description: options?.description,
      duration: options?.duration || 4000
    })
  }

  /**
   * Dismiss all notifications
   */
  function dismiss() {
    toast.dismiss()
  }

  return {
    success,
    error,
    warning,
    info,
    loading,
    custom,
    dismiss
  }
}

/**
 * Example usage:
 * 
 * const { success, error, loading } = useNotifications()
 * 
 * // Simple success
 * success('Settings saved successfully')
 * 
 * // With title and description
 * success('Payment processed', {
 *   title: 'Success',
 *   description: 'Your payment has been processed successfully'
 * })
 * 
 * // Loading with promise
 * await loading(
 *   fetch('/api/settings'),
 *   {
 *     loading: 'Saving settings...',
 *     success: 'Settings saved!',
 *     error: 'Failed to save settings'
 *   }
 * )
 */