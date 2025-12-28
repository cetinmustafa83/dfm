'use client'

import { useState } from 'react'
import { toast } from '@/hooks/use-toast'

interface UseAIGenerationOptions {
  onSuccess?: (content: string) => void
  onError?: (error: Error) => void
}

interface GenerateOptions {
  prompt: string
  context?: string
  type?: 'generate' | 'enhance' | 'rewrite' | 'expand' | 'summarize'
  maxTokens?: number
}

export function useAIGeneration(options?: UseAIGenerationOptions) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<string>('')
  const [error, setError] = useState<Error | null>(null)

  async function generate({
    prompt,
    context,
    type = 'generate',
    maxTokens,
  }: GenerateOptions) {
    setIsGenerating(true)
    setError(null)
    setGeneratedContent('')

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          context,
          type,
          maxTokens,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate content')
      }

      setGeneratedContent(data.content)
      options?.onSuccess?.(data.content)

      toast({
        title: 'Success',
        description: 'Content generated successfully',
      })

      return data.content
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      options?.onError?.(error)

      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })

      throw error
    } finally {
      setIsGenerating(false)
    }
  }

  function reset() {
    setGeneratedContent('')
    setError(null)
  }

  return {
    generate,
    isGenerating,
    generatedContent,
    error,
    reset,
  }
}