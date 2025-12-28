import { NextRequest, NextResponse } from 'next/server'
import { settingsDb } from '@/lib/settings-db'

export async function POST(request: NextRequest) {
  try {
    const aiSettings = await settingsDb.getAI()
    
    if (!aiSettings.contentGeneration) {
      return NextResponse.json(
        { error: 'AI content generation is disabled' },
        { status: 403 }
      )
    }

    if (!aiSettings.apiKey) {
      return NextResponse.json(
        { error: 'AI API key not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { prompt, context, type = 'generate', maxTokens } = body

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Build the system prompt based on type
    let systemPrompt = ''
    switch (type) {
      case 'generate':
        systemPrompt = 'You are a professional content writer. Generate engaging, high-quality content based on the user\'s request. Write in a clear, professional tone.'
        break
      case 'enhance':
        systemPrompt = 'You are an expert editor. Enhance the provided text to make it more engaging, professional, and clear while maintaining the original meaning.'
        break
      case 'rewrite':
        systemPrompt = 'You are a skilled copywriter. Rewrite the provided text in a different style while preserving the core message and information.'
        break
      case 'expand':
        systemPrompt = 'You are a content specialist. Expand the provided text with additional relevant details, examples, and context to make it more comprehensive.'
        break
      case 'summarize':
        systemPrompt = 'You are a skilled summarizer. Create a concise summary of the provided text, capturing the key points and main ideas.'
        break
      default:
        systemPrompt = 'You are a helpful AI assistant for content creation.'
    }

    // Add context if provided
    const fullPrompt = context 
      ? `Context: ${context}\n\nUser Request: ${prompt}`
      : prompt

    // Call the AI API
    const response = await fetch(`${aiSettings.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${aiSettings.apiKey}`,
      },
      body: JSON.stringify({
        model: aiSettings.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: fullPrompt }
        ],
        max_tokens: maxTokens || aiSettings.maxTokens,
        temperature: aiSettings.temperature,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('AI API error:', error)
      return NextResponse.json(
        { error: 'Failed to generate content' },
        { status: response.status }
      )
    }

    const data = await response.json()
    const generatedText = data.choices?.[0]?.message?.content || ''

    return NextResponse.json({
      success: true,
      content: generatedText,
      usage: data.usage,
    })
  } catch (error) {
    console.error('Error generating content:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}