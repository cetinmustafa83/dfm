import { NextRequest, NextResponse } from 'next/server'
import { settingsDb } from '@/lib/settings-db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { topic, keywords, tone, length } = body

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      )
    }

    const aiSettings = await settingsDb.getAI()

    if (!aiSettings.apiKey) {
      return NextResponse.json(
        { error: 'AI API key not configured' },
        { status: 400 }
      )
    }

    // Get blog assistant settings
    const blogSettings = aiSettings.blogAssistant || {
      tone: 'professional',
      length: 'medium',
      includeImages: true,
      includeSources: true,
      language: 'en',
      keywordDensity: 2,
    }

    const wordCount = length === 'short' ? '500-800' :
                     length === 'long' ? '2000+' : '1000-1500'

    const prompt = `Write a ${blogSettings.tone} blog post about "${topic}" in ${blogSettings.language}.

Requirements:
- Length: ${wordCount} words
- Tone: ${blogSettings.tone}
- Keywords to include: ${keywords || 'relevant keywords'}
- Keyword density: ~${blogSettings.keywordDensity}%
${blogSettings.includeImages ? '- Suggest 3-5 relevant image descriptions' : ''}
${blogSettings.includeSources ? '- Include credible sources and references' : ''}

Structure:
1. Catchy title (SEO-optimized)
2. Meta description (150-160 characters)
3. Introduction
4. Main content with subheadings
5. Conclusion
6. Call-to-action

Format the response as JSON with the following structure:
{
  "title": "Blog post title",
  "metaDescription": "SEO meta description",
  "content": "Full blog post in markdown format",
  "images": ["image description 1", "image description 2"],
  "sources": ["source 1", "source 2"],
  "keywords": ["keyword1", "keyword2"],
  "excerpt": "Brief excerpt for preview"
}`

    const response = await fetch(`${aiSettings.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${aiSettings.apiKey}`,
      },
      body: JSON.stringify({
        model: aiSettings.model,
        messages: [
          {
            role: 'system',
            content: 'You are a professional blog writer and SEO expert. Generate high-quality, engaging blog posts with proper structure and SEO optimization.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: aiSettings.temperature,
        max_tokens: aiSettings.maxTokens,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'AI API request failed')
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      throw new Error('No content generated')
    }

    // Try to parse JSON response
    let blogPost
    try {
      blogPost = JSON.parse(content)
    } catch {
      // If not JSON, create structured response from raw content
      blogPost = {
        title: topic,
        metaDescription: content.substring(0, 160),
        content: content,
        images: [],
        sources: [],
        keywords: keywords?.split(',').map((k: string) => k.trim()) || [],
        excerpt: content.substring(0, 200) + '...',
      }
    }

    return NextResponse.json({
      success: true,
      blogPost,
      usage: data.usage,
    })
  } catch (error) {
    console.error('Error generating blog post:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate blog post',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}