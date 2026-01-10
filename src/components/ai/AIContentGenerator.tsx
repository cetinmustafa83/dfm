'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Wand2, Sparkles, Loader2, Copy, Check } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface AIContentGeneratorProps {
  onContentGenerated: (content: string) => void
  currentContent?: string
  placeholder?: string
  label?: string
  context?: string
}

export default function AIContentGenerator({
  onContentGenerated,
  currentContent = '',
  placeholder = 'Enter your prompt...',
  label = 'Generate Content',
  context,
}: AIContentGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [generatedContent, setGeneratedContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [selectedType, setSelectedType] = useState<'generate' | 'enhance' | 'rewrite' | 'expand' | 'summarize'>('generate')

  const contentTypes = [
    { value: 'generate', label: 'Generate', description: 'Create new content from scratch' },
    { value: 'enhance', label: 'Enhance', description: 'Improve existing text' },
    { value: 'rewrite', label: 'Rewrite', description: 'Rewrite in different style' },
    { value: 'expand', label: 'Expand', description: 'Add more details' },
    { value: 'summarize', label: 'Summarize', description: 'Make it concise' },
  ]

  async function handleGenerate() {
    if (!prompt.trim() && selectedType === 'generate') {
      toast({
        title: 'Error',
        description: 'Please enter a prompt',
        variant: 'destructive',
      })
      return
    }

    setIsGenerating(true)
    setGeneratedContent('')

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: selectedType === 'generate' ? prompt : currentContent,
          context: selectedType === 'generate' ? context : prompt,
          type: selectedType,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate content')
      }

      setGeneratedContent(data.content)
      toast({
        title: 'Success',
        description: 'Content generated successfully',
      })
    } catch (error) {
      console.error('Error generating content:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate content',
        variant: 'destructive',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  function handleUseContent() {
    if (generatedContent) {
      onContentGenerated(generatedContent)
      setIsOpen(false)
      setPrompt('')
      setGeneratedContent('')
      toast({
        title: 'Content Applied',
        description: 'The generated content has been applied',
      })
    }
  }

  function handleCopyToClipboard() {
    navigator.clipboard.writeText(generatedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      title: 'Copied',
      description: 'Content copied to clipboard',
    })
  }

  function handleOpenChange(open: boolean) {
    setIsOpen(open)
    if (!open) {
      setPrompt('')
      setGeneratedContent('')
      setSelectedType('generate')
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="shrink-0"
        title="AI Content Generator"
      >
        <Wand2 className="h-4 w-4" />
      </Button>

      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetContent side="right" className="sm:max-w-[800px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Content Generator
            </SheetTitle>
            <SheetDescription>
              Use AI to generate, enhance, or rewrite your content
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 mt-6">
            {/* Content Type Selection */}
            <div className="space-y-2">
              <Label>Content Type</Label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {contentTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setSelectedType(type.value as any)}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      selectedType === type.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="font-medium text-sm">{type.label}</div>
                    <div className="text-xs text-muted-foreground">{type.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Section */}
            <div className="space-y-2">
              <Label htmlFor="prompt">
                {selectedType === 'generate' ? 'Prompt' : 'Instructions'}
              </Label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  selectedType === 'generate'
                    ? placeholder
                    : 'Enter instructions for how to modify the content...'
                }
                rows={4}
                className="resize-none"
              />
              {selectedType !== 'generate' && currentContent && (
                <p className="text-xs text-muted-foreground">
                  Current content will be {selectedType}d based on your instructions
                </p>
              )}
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || (!prompt.trim() && selectedType === 'generate')}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Content
                </>
              )}
            </Button>

            {/* Generated Content */}
            {generatedContent && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Generated Content</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyToClipboard}
                  >
                    {copied ? (
                      <>
                        <Check className="mr-2 h-3 w-3" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-3 w-3" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <div className="p-4 border rounded-lg bg-muted/30 max-h-60 overflow-y-auto">
                  <p className="text-sm whitespace-pre-wrap">{generatedContent}</p>
                </div>
              </div>
            )}
          </div>

          <SheetFooter className="gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleUseContent}
              disabled={!generatedContent}
              className="flex-1"
            >
              Use This Content
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}